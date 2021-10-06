import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

import { RouteName } from '@app/types';

const Page: NextPage = () => {
  return (
    <div className="flex items-center h-screen bg-white">
      <div className="container px-2 mx-auto text-center">
        <h1 className="text-3xl sm:text-4.5xl text-black font-extrabold mb-4">
          Thank you! Now check your email...
        </h1>
        <p className="max-w-lg mx-auto mb-8">
          You should get a confirmation email soon, open it up and{' '}
          <strong className="font-semibold text-black">
            click the “Confirm your subscription” button
          </strong>{' '}
          so we can keep you up to date.
        </p>

        <Link href={RouteName.SIGN_IN}>
          <a className="inline-flex justify-center w-full max-w-[8rem] bg-gray-700 text-gray-200 rounded-md text-sm font-semibold py-3 px-4 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 cursor-pointer">
            Done
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Page;
