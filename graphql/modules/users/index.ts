import {
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Subscription, User } from '@app/generated/type-graphql';
import type { ApolloServerContext } from '@app/types';
import { prisma } from '@app/utils/server';

@Resolver(User)
class UserResolvers {
  constructor() {}

  @FieldResolver((returns) => Subscription)
  async subscription(@Root() user: User) {
    if (!user.subscription && user.subscription) {
      return await prisma.subscription.findUnique({
        where: { id: user.subscription },
      });
    }
    return user.subscription || null;
  }

  @Authorized()
  @Mutation((returns) => String)
  async createUser(@Ctx() { session }: ApolloServerContext) {
    const user = await prisma.user.upsert({
      where: {
        id: session?.uid,
      },
      create: {
        id: session.uid,
        email: session?.email,
        emailVerified: session?.email_verified,
        picture: session?.picture,
      },
      update: {
        email: session?.email,
        emailVerified: session?.email_verified,
        picture: session?.picture,
      },
    });

    return user.id;
  }

  @Authorized()
  @Query((returns) => User)
  async me(@Ctx() { session }: ApolloServerContext) {
    return await prisma.user.findUnique({
      where: {
        id: session.uid,
      },
      include: {
        subscription: {
          include: {
            price: true,
          },
        },
      },
    });
  }
}

export { UserResolvers };
