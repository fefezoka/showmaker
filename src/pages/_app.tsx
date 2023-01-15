import type { AppProps } from 'next/app';
import { global } from '../styles/global';
import { Session } from 'next-auth/core/types';
import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClientProvider, QueryClient, Hydrate, DehydratedState } from 'react-query';
import { ReactNode } from 'react';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';
import Head from 'next/head';
import ogimage from '../assets/ogimage.png';

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

  return (
    <>
      <Head>
        <title>Show Maker</title>
        <meta
          name="description"
          content="O maior rede social já feita. Elon Musk me contrate"
        />
        <meta property="og:url" content={`https://show-maker.vercel.app`} />
        <meta property="og:title" content="Show Maker" />
        <meta
          property="og:description"
          content="O maior rede social já feita. Elon Musk me contrate"
        />
        <meta property="og:site_name" content="Show Maker" />
        <meta property="og:image" content={ogimage.src} />
        <meta property="og:type" content="website" />

        <meta name="twitter:site" content="@showmaker" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="show-maker.vercel.app" />
        <meta property="twitter:url" content={`https://show-maker.vercel.app`} />
        <meta name="twitter:title" content="Show Maker" />
        <meta
          name="twitter:description"
          content="O maior rede social já feita. Elon Musk me contrate"
        />
        <meta name="theme-color" content="#fff" />
      </Head>

      {session.status === 'loading' ? (
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
      ) : (
        <>{children}</>
      )}
    </>
  );
};
