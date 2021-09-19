import '@app/styles/globals.css';

import type { AppProps } from 'next/app';

import { AuthProvider } from '@app/hooks/useAuth';

const App = ({
  Component,
  pageProps: { user, jwt, ...otherProps },
}: AppProps) => {
  return (
    <AuthProvider.Provider value={{ user: JSON.parse(user), jwt }}>
      <Component {...otherProps} />;
    </AuthProvider.Provider>
  );
};

export default App;
