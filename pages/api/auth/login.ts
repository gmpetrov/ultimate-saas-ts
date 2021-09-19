import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

import config from '@app/config';
import test from '@app/middlewares/test';
import { createApiHandler } from '@app/utils/ssr';
import passport from '@app/utils/ssr/passport';

const handler = createApiHandler();

handler.use(test).post(passport.authenticate('local'), async (req, res) => {
  const user = (req as any).user as User;

  const payload = {
    id: user.id,
  };

  const token = await jwt.sign(payload, config.SECRET!, {
    expiresIn: '30d',
  });

  return res.json({ user: (req as any).user, token });
});

export default handler;
