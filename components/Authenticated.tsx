import React from 'react';

import { useAuth } from '@app/hooks';

type Props = {
  loader?: React.ReactNode;
};

const Authenticated: React.FC<Props> = (props) => {
  const { isAuthLoading, user } = useAuth();

  if (isAuthLoading) {
    return (props.loader as any) || null;
  }

  return !!user ? props.children : null;
};

export default Authenticated;
