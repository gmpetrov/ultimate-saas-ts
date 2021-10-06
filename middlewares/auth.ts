import { NextApiRequest, NextApiResponse } from 'next';
import { Middleware } from 'next-connect';
import nookies from 'nookies';

import { AppNextApiRequest } from '@app/types';
import { firebaseAdmin, getSession } from '@app/utils/server';

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
