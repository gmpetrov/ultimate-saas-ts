import { NextApiRequest } from 'next';

import { prisma } from '@app/utils/server';
import { firebaseAdmin } from '@app/utils/server';

export type AppNextApiRequest = NextApiRequest & {
  session: firebaseAdmin.auth.DecodedIdToken;
};

export type ApolloServerContext = AppNextApiRequest & {
  prisma: typeof prisma;
  session: firebaseAdmin.auth.DecodedIdToken;
};

export enum RouteName {
  HOME = '/',
  ACCOUNT = '/account',
  SIGN_IN = '/signin',
  RESET_PASSWORD = '/reset-password',
  THANK_YOU = '/thank-you',
  GRAPHQL = '/api/graphql',
}
