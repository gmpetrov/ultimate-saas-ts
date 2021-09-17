import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';

import config from '@app/config';
import { prisma } from '@app/utils/ssr';

const options: NextAuthOptions = {
  // session: {
  //   jwt: true,
  // },
  // jwt: {
  //   secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
  // },
  providers: [
    GitHubProvider({
      clientId: config.GITHUB_ID,
      clientSecret: config.GITHUB_SECRET,
    }),
    EmailProvider({
      server: config.SMTP_SERVER,
      from: config.SMTP_FROM,
    }),
    // Providers.Credentials({
    //   credentials: {
    //     username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials, req) {
    //     // Add logic here to look up the user from the credentials supplied
    //     const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' };

    //     if (user) {
    //       // Any object returned will be saved in `user` property of the JWT
    //       return user;
    //     } else {
    //       // If you return null or false then the credentials will be rejected
    //       return null;
    //       // You can also Reject this callback with an Error or with a URL:
    //       // throw new Error('error message') // Redirect to error page
    //       // throw '/path/to/redirect'        // Redirect to a URL
    //     }
    //   },
    // }),
  ],
  adapter: PrismaAdapter(prisma),

  secret: config.SECRET,
  callbacks: {
    session: async ({ session, user }) => {
      session.userId = user.id;
      return Promise.resolve(session);
    },
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
