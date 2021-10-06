import { gql } from '@apollo/client';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getRedirectResult,
  onIdTokenChanged,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useCreateUserMutationMutation } from '@app/generated';
import { RouteName } from '@app/types';

const firebaseConfig = {
  apiKey: 'AIzaSyDkTrgg_T-kQOpibv1kSnuUfKLNZ427GyA',
  authDomain: 'ultimate-saas-ts.firebaseapp.com',
  projectId: 'ultimate-saas-ts',
  storageBucket: 'ultimate-saas-ts.appspot.com',
  messagingSenderId: '340610171597',
  appId: '1:340610171597:web:867521d18b64ce9f7d9f84',
};

initializeApp(firebaseConfig);

const auth = getAuth();

const AuthContext = createContext<{
  user: User | null;
  isAuthLoading: boolean;
  signOut: any;
  persistUser: any;
}>({
  user: null,
  isAuthLoading: false,
  signOut: null,
  persistUser: null,
});

gql`
  mutation CreateUserMutation {
    createUser
  }
`;

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();
  const [createUserMutationMutation, { data, loading, error }] =
    useCreateUserMutationMutation({
      variables: {},
    });

  const persistUser = useCallback(
    async (user) => {
      setUser(user);

      const token = await user.getIdToken();

      nookies.destroy(null, 'token');
      nookies.set(null, 'token', token, {
        path: '/',
        secure: true,
        sameSite: 'none',
      });

      await createUserMutationMutation();
    },
    [setUser, createUserMutationMutation]
  );

  const resetUser = useCallback(() => {
    setUser(null);
    nookies.destroy(null, 'token');
    nookies.set(null, 'token', '', { path: '/' });
  }, [setUser]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);

    resetUser();
  }, [resetUser]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).nookies = nookies;
    }
    return onIdTokenChanged(auth, async (user) => {
      setIsAuthLoading(false);

      if (!user) {
        resetUser();
        return;
      }

      await persistUser(user);

      const isRedirect = !!(await getRedirectResult(auth));

      console.log;

      if (isRedirect) {
        router.push(RouteName.HOME);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, signOut, persistUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
