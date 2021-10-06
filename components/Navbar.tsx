import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';

import { useAuth } from '@app/hooks';
import { RouteName } from '@app/types';

import Authenticated from './Authenticated';
import NotAuthenticated from './NotAuthenticated';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0">
                  <img
                    className="block w-auto h-8 lg:hidden"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden w-auto h-8 lg:block"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href={RouteName.HOME}>
                    <a
                      className={classNames(
                        'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                        {
                          'border-indigo-500 text-gray-900':
                            router.pathname === '/',
                          '': router.pathname !== '/',
                        }
                      )}
                    >
                      Pricings
                    </a>
                  </Link>

                  <Link href={RouteName.ACCOUNT}>
                    <a
                      className={classNames(
                        'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                        {
                          'border-indigo-500 text-gray-900':
                            router.pathname === '/account',
                          '': router.pathname !== '/account',
                        }
                      )}
                    >
                      Account
                    </a>
                  </Link>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}

                <Authenticated
                  loader={
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                  }
                >
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="w-8 h-8 rounded-full"
                          src={
                            user?.photoURL ||
                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                          }
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href={RouteName.ACCOUNT}>
                              <a
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Account
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={() => signOut()}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </Authenticated>

                <NotAuthenticated>
                  <Link href={RouteName.SIGN_IN}>
                    <a>Sign in</a>
                  </Link>
                </NotAuthenticated>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-4 space-y-1">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}

              <Link href={RouteName.HOME}>
                <a className="block py-2 pl-3 pr-4 text-base font-medium text-indigo-700 border-l-4 border-indigo-500 bg-indigo-50">
                  Pricings
                </a>
              </Link>
              <Link href={RouteName.ACCOUNT}>
                <a className="block py-2 pl-3 pr-4 text-base font-medium text-gray-500 border-l-4 border-transparent hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
                  Account
                </a>
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
