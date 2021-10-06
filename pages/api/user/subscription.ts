import { createAuthApiHandler, prisma } from '@app/utils/server';

const handler = createAuthApiHandler();

handler.get(async (req, res) => {
  const userId = req.session?.userId!;

  const subscription = await prisma.subscription?.findFirst({
    where: {
      userId: userId,
      status: {
        in: ['active', 'trialing'],
      },
    },
  });

  return res.status(200).json({ subscription });
});

export default handler;
