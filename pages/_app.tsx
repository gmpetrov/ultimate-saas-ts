import '@app/styles/globals.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

const App = ({
  Component,
  pageProps: { session, ...otherProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...otherProps} />;
    </SessionProvider>
  );
};

export default App;
