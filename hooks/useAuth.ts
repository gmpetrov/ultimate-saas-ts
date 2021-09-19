import { User } from '@prisma/client';
import React, { useContext } from 'react';

export const AuthProvider = React.createContext(
  {} as {
    user?: User;
    jwt?: string;
  }
);

const useAuth = () => {
  const { jwt, user } = useContext(AuthProvider);

  return {
    jwt,
    user,
  };
};

export default useAuth;
