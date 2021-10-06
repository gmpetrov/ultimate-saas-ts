import { XCircleIcon } from '@heroicons/react/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { Subscription } from '@prisma/client';
import classNames from 'classnames';
import {
  // applyActionCode,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import config from '@app/config';
import { useAuth } from '@app/hooks';
import { RouteName } from '@app/types';

const provider = new GoogleAuthProvider();

const auth = getAuth();

type Props = {
  subscription: Subscription | null;
};

type Fields = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  })
  .required();

const ErrorMessage: React.FC = (props) => (
  <p className="mt-2 text-sm text-red-600" id="email-error">
    {props.children}
  </p>
);

const Page: NextPage<Props> = ({ subscription }) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [globalFormError, setGlobalFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Fields>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    (async () => {
      const email = router.query.email as string;

      // TODO: implement custom email handler https://firebase.google.com/docs/auth/custom-email-handler
      // const code = router.query.oobCode as string;
      // if (code) {
      //   try {
      //     const res = await applyActionCode(auth, code);

      //     await auth.currentUser?.getIdToken(true);
      //   } catch (err) {
      //     const code = (err as any).code;

      //     if (code === 'auth/invalid-action-code') {
      //       return setGlobalFormError('Verification code has expired');
      //     }
      //   }
      // }

      if (email) {
        setValue('email', email);
      }
    })();
  }, [setValue, router]);

  const handleSignInWithGoogle = () => {
    signInWithRedirect(auth, provider);
  };

  const handleSignInWithEmailPassword = async (
    email: string,
    password: string
  ) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!res.user.emailVerified) {
        setGlobalFormError('Please verify your email adress');
        sendEmailVerification(res.user, {
          url: `${config.NEXT_PUBLIC_APP_URL}/signin?email=${encodeURIComponent(
            email
          )}`,
        });
        await signOut();
      } else {
        router.push(RouteName.HOME);
      }
    } catch (err) {
      const code = (err as any)?.code as string;

      if (code === 'auth/wrong-password') {
        setGlobalFormError('Wrong credentials !');
      } else if (code === 'auth/user-disabled') {
        setGlobalFormError('Account blocked, please contact support');
      } else if (code === 'auth/too-many-requests') {
        setGlobalFormError('Too many requests !');
      } else if (code === 'auth/user-not-found') {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        sendEmailVerification(res.user, {
          url: `${config.NEXT_PUBLIC_APP_URL}/signin?email=${encodeURIComponent(
            email
          )}`,
        });

        await signOut();

        router.push(RouteName.THANK_YOU);
      }
    }
  };

  const onSubmit = async (values: Fields) => {
    setGlobalFormError(undefined);
    await handleSignInWithEmailPassword(values.email, values.password);
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Or{' '}
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            start your 14-day free trial
          </a>
        </p>
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  autoComplete="current-password"
                  className={classNames(
                    'block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    {
                      'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500':
                        !!errors.email?.message,
                    }
                  )}
                />

                <ErrorMessage>{errors.password?.message}</ErrorMessage>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="block ml-2 text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href={RouteName.RESET_PASSWORD}>
                  <a className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-6 cursor-pointer">
              <div>
                <a
                  onClick={handleSignInWithGoogle}
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>

                  <img
                    className="w-5 h-5"
                    src="//logo.clearbit.com/google.com?size=80&greyscale=true"
                    alt="github"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
