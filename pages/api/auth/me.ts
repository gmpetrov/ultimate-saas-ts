import { User } from '@prisma/client';

import test from '@app/middlewares/test';
import { createApiHandler } from '@app/utils/ssr';
import passport from '@app/utils/ssr/passport';

const handler = createApiHandler();

handler
  .use(test)
  .get(passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = (req as any).user as User;

    return res.json({ user });
  });

export default handler;
