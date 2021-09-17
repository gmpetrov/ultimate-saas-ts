import config from '@app/config';
import { createAuthApiHandler, stripe } from '@app/utils/ssr';
import { getCustomerId } from '@app/utils/ssr/stripe';

const handler = createAuthApiHandler();

handler.post(async (req, res) => {
  const { price, quantity = 1, metadata = {} } = req.body;

  if (!price) {
    throw new Error('Missing parameter price');
  }

  const userId = req.session?.userId!;

  const customerId = await getCustomerId(userId);

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    customer: customerId,
    client_reference_id: userId,
    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    subscription_data: {
      trial_from_plan: true,
      metadata: {},
    },
    success_url: `${config.NEXTAUTH_URL}/account`,
    cancel_url: `${config.NEXTAUTH_URL}/`,
  });

  return res.status(200).json({ sessionId: checkoutSession.id });
});

export default handler;
