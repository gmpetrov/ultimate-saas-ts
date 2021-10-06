import '../styles/globals.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import type { AppProps } from 'next/app';

import { AuthProvider } from '@app/hooks';
import { RouteName } from '@app/types';

const client = new ApolloClient({
  uri: RouteName.GRAPHQL,
  cache: new InMemoryCache(),
});

const App = ({
  Component,
  pageProps: { session, ...otherProps },
}: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Component {...otherProps} />
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
