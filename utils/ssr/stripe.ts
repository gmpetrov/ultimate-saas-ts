import Stripe from 'stripe';

import config from '@app/config';
import { prisma } from '@app/utils/ssr';

const stripe = new Stripe(config.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

export const getCustomerId = async (userId: string) => {
  let customer = await prisma.customer.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!!customer) {
    return customer.id;
  }

  const newCustomer = await stripe.customers.create({
    metadata: {
      userId: userId,
    },
  });

  await prisma.customer.create({
    data: {
      id: newCustomer.id,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return newCustomer.id;
};

export default stripe;
