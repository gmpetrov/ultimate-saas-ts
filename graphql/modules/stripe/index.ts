import { Length, MaxLength } from 'class-validator';
import { NextApiRequest } from 'next';
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
} from 'type-graphql';

import config from '@app/config';
import type { ApolloServerContext } from '@app/types';
import stripe, { getCustomerId } from '@app/utils/server/stripe';

@InputType()
export class CreateCheckoutSessionInput {
  @Field()
  price!: string;
}

@Resolver()
class StripeResolvers {
  constructor() {}

  @Authorized()
  @Mutation((returns) => String)
  async createPortal(@Ctx() { session }: ApolloServerContext) {
    const customerId = await getCustomerId(session.uid);

    const { url } = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${config.NEXT_PUBLIC_APP_URL}/account`,
    });

    return url;
  }

  @Authorized()
  @Mutation((returns) => String)
  async createCheckoutSession(
    @Ctx() { session }: ApolloServerContext,

    @Arg('data')
    data: CreateCheckoutSessionInput
  ) {
    const customerId = await getCustomerId(session.uid);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer: customerId,
      client_reference_id: session.uid,
      line_items: [
        {
          price: data.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata: {},
      },
      success_url: `${config.NEXT_PUBLIC_APP_URL}/account`,
      cancel_url: `${config.NEXT_PUBLIC_APP_URL}/`,
    });

    return checkoutSession.id;
  }
}

export { StripeResolvers };
