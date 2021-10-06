import { useApolloClient } from '@apollo/client';
import { ExclamationIcon } from '@heroicons/react/solid';
import { Subscription } from '@prisma/client';
import gql from 'graphql-tag';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

import { Navbar } from '@app/components';
import { RouteName } from '@app/types';
import { getSession, prisma } from '@app/utils/server';

type Props = {
  subscription: Subscription | null;
};

const createPortal = gql`
  mutation CreatePortal {
    createPortal
  }
`;

const Page: NextPage<Props> = ({ subscription }) => {
  const apollo = useApolloClient();

  const handleCreatePortal = async () => {
    const res = await apollo.mutate({
      mutation: createPortal,
    });

    const url = res?.data?.createPortal;

    window.location.assign(url);
  };

  return (
    <div className="bg-white">
      <Navbar />

      <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl font-extrabold text-gray-800 sm:text-center">
            Account
          </h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            We partnered with Stripe for a simplified billing.
          </p>

          <div className="mt-12 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Manage subscription
              </h3>
              {!!subscription?.cancel_at && (
                <div className="p-4 my-6 border-l-4 border-yellow-400 bg-yellow-50">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationIcon
                        className="w-5 h-5 text-yellow-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Your subscription will end the{' '}
                        {subscription.cancel_at.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                <div className="max-w-xl text-sm text-gray-500">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae voluptatibus corrupti atque repudiandae nam.
                  </p>
                </div>
                <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                  {!!subscription ? (
                    <button
                      onClick={handleCreatePortal}
                      type="button"
                      className="inline-flex items-center px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    >
                      Change plan
                    </button>
                  ) : (
                    <Link href={RouteName.HOME} passHref>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      >
                        Subscribe
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context);
  let subscription = null;

  if (!!session) {
    subscription = await prisma.subscription.findFirst({
      where: {
        userId: session?.uid,
        status: {
          in: ['active', 'trialing'],
        },
      },
      include: {
        price: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return {
    redirect: !session && {
      destination: '/signin',
      permanent: false,
    },
    props: {
      subscription,
    },
  };
};

export default Page;
