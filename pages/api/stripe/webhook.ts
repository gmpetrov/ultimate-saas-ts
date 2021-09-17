import { PriceType, SubscriptionStatus } from '@prisma/client';
import Stripe from 'stripe';

import appConfig from '@app/config';
import { timestampToDate } from '@app/utils';
import { createApiHandler, prisma, stripe } from '@app/utils/ssr';

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

const handler = createApiHandler();

handler.post(async (req, res) => {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      appConfig.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log(`❌ Error message: ${err?.message}`);
    return res.status(400).send(`Webhook Error: ${err?.message}`);
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          const data = event.data.object as Stripe.Product;
          await prisma.product.upsert({
            where: {
              id: data.id,
            },
            update: {
              name: data.name,
              description: data.description,
              active: data.active,
              metadata: data.metadata,
            },
            create: {
              id: data.id,
              name: data.name,
              description: data.description,
              active: data.active,
              metadata: data.metadata,
            },
          });
          break;
        case 'price.created':
        case 'price.updated': {
          const data = event.data.object as Stripe.Price;
          await prisma.price.upsert({
            where: {
              id: data.id,
            },
            update: {
              active: data.active,
              currency: data.currency,
              type: data.type as PriceType,
              unitAmount: data.unit_amount,
              interval: data.recurring?.interval,
              interval_count: data.recurring?.interval_count,
              trial_period_days: data.recurring?.trial_period_days,
            },
            create: {
              id: data.id,
              active: data.active,
              currency: data.currency,
              type: data.type as PriceType,
              unitAmount: data.unit_amount,
              interval: data.recurring?.interval,
              interval_count: data.recurring?.interval_count,
              trial_period_days: data.recurring?.trial_period_days,
              product: {
                connect: {
                  id: data.product as string,
                },
              },
            },
          });
          break;
        }
        case 'customer.subscription.deleted': {
          const data = event.data.object as Stripe.Subscription;

          await prisma.subscription.delete({
            where: {
              id: data.id,
            },
          });
        }
        case 'customer.subscription.updated': {
          const data = event.data.object as Stripe.Subscription;

          await prisma.subscription.update({
            where: {
              id: data.id,
            },
            data: {
              price: {
                connect: {
                  id: data.items.data[0].price.id,
                },
              },
              status: data.status,
              metadata: data.metadata,
              cancel_at_period_end: data.cancel_at_period_end,
              canceled_at: timestampToDate(data.canceled_at!),
              cancel_at: timestampToDate(data.cancel_at!),
              start_date: timestampToDate(data.start_date!),
              ended_at: timestampToDate(data.ended_at!),
              trial_start: timestampToDate(data.trial_start!),
              trial_end: timestampToDate(data.trial_end!),
            },
          });
          break;
        }
        case 'checkout.session.completed':
          {
            const data = event.data.object as Stripe.Checkout.Session;

            const subscription = await stripe.subscriptions.retrieve(
              data.subscription as string,
              {
                expand: ['default_payment_method'],
              }
            );

            await prisma.subscription.upsert({
              where: {
                id: subscription.id,
              },
              create: {
                id: subscription.id,
                user: {
                  connect: {
                    id: data.client_reference_id!,
                  },
                },
                price: {
                  connect: {
                    id: subscription.items.data[0].price.id,
                  },
                },
                status: subscription.status as SubscriptionStatus,
                metadata: subscription.metadata,
                cancel_at_period_end: subscription.cancel_at_period_end,
                canceled_at: timestampToDate(subscription.canceled_at!),
                cancel_at: timestampToDate(subscription.cancel_at!),
                start_date: timestampToDate(subscription.start_date!),
                ended_at: timestampToDate(subscription.ended_at!),
                trial_start: timestampToDate(subscription.trial_start!),
                trial_end: timestampToDate(subscription.trial_end!),
              },
              update: {
                status: subscription.status as SubscriptionStatus,
                metadata: subscription.metadata,
                price: {
                  connect: {
                    id: subscription.items.data[0].price.id,
                  },
                },
                cancel_at_period_end: subscription.cancel_at_period_end,
                canceled_at: timestampToDate(subscription.canceled_at!),
                cancel_at: timestampToDate(subscription.cancel_at!),
                start_date: timestampToDate(subscription.start_date!),
                ended_at: timestampToDate(subscription.ended_at!),
                trial_start: timestampToDate(subscription.trial_start!),
                trial_end: timestampToDate(subscription.trial_end!),
              },
            });
          }

          break;
        default:
          throw new Error(`Unhandled relevant event! ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send('Webhook error: "Webhook handler failed. View logs."');
    }
  }

  res.json({ received: true });
});

export default handler;
