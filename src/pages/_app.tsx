import type { AppProps } from 'next/app';
import { global } from '../style/global';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  global();
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
