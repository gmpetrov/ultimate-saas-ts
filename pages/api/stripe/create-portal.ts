import { createAuthApiHandler, stripe } from '@app/utils/ssr';
import { getCustomerId } from '@app/utils/ssr/stripe';

const handler = createAuthApiHandler();

handler.post(async (req, res) => {
  const userId = req.session?.userId!;

  const customerId = await getCustomerId(userId);

  const { url } = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `http://localhost:3000/account`,
  });

  return res.status(200).json({ url });
});

export default handler;
