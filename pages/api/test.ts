import { createAuthApiHandler } from '@app/utils/server';
import { prisma } from '@app/utils/server';

const handler = createAuthApiHandler();

handler
  .post(async (req, res) => {
    return res.json({ hello: 'world' });
  })
  .get(() => {
    console.log('prisma', prisma);
  });

export default handler;
