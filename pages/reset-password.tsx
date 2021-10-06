import { XCircleIcon } from '@heroicons/react/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import config from '@app/config';
import { RouteName } from '@app/types';

const auth = getAuth();

type Fields = {
  email: string;
};

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

const ErrorMessage: React.FC = (props) => (
  <p className="mt-2 text-sm text-red-600" id="email-error">
    {props.children}
  </p>
);

const Page: NextPage = () => {
  const router = useRouter();
  const [globalFormError, setGlobalFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Fields>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    (async () => {
      const email = router.query.email as string;

      if (email) {
        setValue('email', email);
      }
    })();
  }, [setValue, router]);

  const onSubmit = async (values: Fields) => {
    try {
      setGlobalFormError(undefined);

      await sendPasswordResetEmail(auth, values.email, {
        url: `${config.NEXT_PUBLIC_APP_URL}/signin?email=${encodeURIComponent(
          values.email
        )}`,
      });

      router.push('/thank-you');
    } catch (err) {
      const code = (err as any).code as string;

      switch (code) {
        case 'auth/user-not-found':
          router.push('/thank-you');
          break;
        default:
          console.log(code);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-white sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={RouteName.HOME} passHref>
          <img
            className="w-auto h-12 mx-auto cursor-pointer"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {globalFormError && (
              <div className="p-4 rounded-md bg-red-50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="w-5 h-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {globalFormError}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  className={classNames(
                    'block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    {
                      'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500':
                        !!errors.email?.message,
                    }
                  )}
                />
              </div>

              <ErrorMessage>{errors.email?.message}</ErrorMessage>
            </div>

            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send verification email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
