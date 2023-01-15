import type { AppProps } from 'next/app';
import { global } from '../styles/global';
import { Session } from 'next-auth/core/types';
import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClientProvider, QueryClient, Hydrate, DehydratedState } from 'react-query';
import { ReactNode } from 'react';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

export default function myApp({
  Component,
  pageProps,
}: AppProps<{ session: Session; dehydratedState: DehydratedState }>) {
  global();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </Layout>
      </SessionProvider>
    </QueryClientProvider>
  );
}

const Layout = ({ children }: Props) => {
  const session = useSession();

  if (session.status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <h2>Show Maker</h2>
        <Image src={Spinner} alt="" priority loading="eager" height={64} width={64} />
      </div>
    );
  }
  return <>{children}</>;
};
