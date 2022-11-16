import type { AppProps } from 'next/app';
import { global } from '../style/global';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  global();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
