import { User } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { omit } from 'lodash';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import JwtStrategy from 'passport-jwt';
import LocalStrategy from 'passport-local';

import config from '@app/config';
import { prisma } from '@app/utils/ssr';

passport.serializeUser((user, done) => {
  done(null, (user as any).email);
});

passport.deserializeUser(async (email, done) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  done(null, user);
});

export const generateSalt = () => crypto.randomBytes(16).toString('hex');

export const generateHash = (password: string, salt: string) =>
  crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

export const validatePassword = (user: User, password: string) =>
  user.password === generateHash(password, user.salt!);

export const getUserFromToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, config.SECRET!);

    const user = await prisma.user.findUnique({
      where: {
        id: (payload as any).id as string,
      },
    });

    return omit(user, ['password', 'salt']);
  } catch {
    return null;
  }
};

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !validatePassword(user, password)) {
        done(null, null);
      } else {
        done(null, omit(user, ['password', 'salt']));
      }
    }
  )
);

passport.use(
  new GitHubStrategy.Strategy(
    {
      clientID: config.GITHUB_ID!,
      clientSecret: config.GITHUB_SECRET!,
      callbackURL: 'http://localhost:3000/api/auth/test-github',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      const { id, displayName, emails, provider, photos } = profile;

      const email = emails?.[0]?.value as string;
      const image = photos?.[0]?.value as string;

      const user = await prisma.user.upsert({
        where: {
          email,
        },
        create: {
          email,
          image,
          name: displayName,
        },
        update: {
          image,
          name: displayName,
        },
        include: {
          accounts2: true,
        },
      });

      const account = user.accounts2.find((one) => one.providerUserId === id);

      if (!account) {
        await prisma.account2.create({
          data: {
            providerUserId: id,
            provider,
            accessToken,
            refreshToken,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } else {
        await prisma.account2.update({
          where: {
            id: account.id,
          },
          data: {
            accessToken,
            refreshToken,
          },
        });
      }

      return done(null, omit(user, ['password', 'salt']));
    }
  )
);

passport.use(
  new JwtStrategy.Strategy(
    {
      secretOrKey: config.SECRET,
      jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      const user = await prisma.user.findUnique({
        where: {
          id: token.id,
        },
      });

      if (!user) {
        return done(null, false);
      }

      return done(null, omit(user, ['password', 'salt']));
    }
  )
);

export default passport;
