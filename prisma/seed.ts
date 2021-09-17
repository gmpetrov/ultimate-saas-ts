import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

async function main() {
  const products = await stripe.products.list();
  const prices = await stripe.prices.list();

  await Promise.all(
    products.data.map((each) =>
      prisma.product.upsert({
        where: {
          id: each.id,
        },
        create: {
          id: each.id,
          name: each.name,
          description: each.description,
          active: each.active,
          image: each.images?.[0],
          metadata: each.metadata,
        },
        update: {
          name: each.name,
          description: each.description,
          active: each.active,
          image: each.images?.[0],
          metadata: each.metadata,
        },
      })
    )
  );

  await Promise.all(
    prices.data.map((each) =>
      prisma.price.upsert({
        where: {
          id: each.id,
        },
        create: {
          id: each.id,
          currency: each.currency,
          active: each.active,
          type: each.type,
          unitAmount: each.unit_amount,
          product: {
            connect: {
              id: each.product as string,
            },
          },
        },
        update: {
          currency: each.currency,
          active: each.active,
          type: each.type,
          unitAmount: each.unit_amount,
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
