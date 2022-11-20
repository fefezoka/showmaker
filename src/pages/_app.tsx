import type { AppProps } from 'next/app';
import { global } from '../style/global';
import { Session } from 'next-auth/core/types';
import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactNode } from 'react';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  global();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </QueryClientProvider>
  );
};

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
        <Image src={Spinner} alt="" height={64} width={64} />
      </div>
    );
  }
  return <>{children}</>;
};

export default MyApp;
