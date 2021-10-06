import { FieldResolver, Resolver, Root } from 'type-graphql';

import { Price, Subscription } from '@app/generated/type-graphql';
import { prisma } from '@app/utils/server';

@Resolver((of) => Subscription)
class SubscriptionResolvers {
  constructor() {}

  @FieldResolver((returns) => Price)
  async price(@Root() subscription: Subscription) {
    if (!subscription.price && subscription.priceId) {
      return await prisma.price.findUnique({
        where: { id: subscription.priceId },
      });
    }
    return subscription.price || null;
  }
}

export { SubscriptionResolvers };
