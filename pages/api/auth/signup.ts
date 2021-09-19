import crypto from 'crypto';

import test from '@app/middlewares/test';
import { createApiHandler } from '@app/utils/ssr';
import { prisma } from '@app/utils/ssr';

const handler = createApiHandler();

handler.use(test).post(async (req, res) => {
  console.log('body', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).end('Bad Request');
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (dbUser) {
    return res.status(400).end('Bad Request');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  const newUser = await prisma.user.create({
    data: {
      email,
      salt,
      password: hash,
    },
  });

  return res.status(200).json({ user: newUser });
});

export default handler;
