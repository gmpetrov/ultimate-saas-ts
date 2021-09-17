import { NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Middleware } from 'next-connect';

import { AppNextApiRequest } from '@app/types';

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
