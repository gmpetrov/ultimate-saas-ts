import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { ErrorHandler, Middleware } from 'next-connect';

import { AppNextApiRequest } from '@app/types';
import { prisma } from '@app/utils';

const auth: Middleware<AppNextApiRequest, NextApiResponse> = async (
  req,
  res,
  next
) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).end('Forbidden');
  }

  req.session = session;

  return next();
};

export default auth;
