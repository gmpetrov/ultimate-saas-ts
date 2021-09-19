import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';

import config from '@app/config';
import test from '@app/middlewares/test';
import { createApiHandler } from '@app/utils/ssr';
import passport from '@app/utils/ssr/passport';

const handler = createApiHandler();

handler
  .use(test)
  .get(
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
      const user = (req as any).user;

      const token = await jwt.sign({ id: user.id }, config.SECRET!, {
        expiresIn: '30d',
      });

      setCookie({ res }, 'jwt', token, {
        // httpOnly: true,
        // secure: true,
        path: '/',
      });

      return res.redirect('/');
    }
  );

export default handler;
