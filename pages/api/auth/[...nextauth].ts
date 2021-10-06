import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';

import config from '@app/config';
import { prisma } from '@app/utils/server';

const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: config.GITHUB_ID,
      clientSecret: config.GITHUB_SECRET,
    }),
    EmailProvider({
      server: config.SMTP_SERVER,
      from: config.SMTP_FROM,
    }),
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
