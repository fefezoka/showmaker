import type { AppProps } from 'next/app';
import { global } from '../styles/global';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient, Hydrate, DehydratedState } from 'react-query';
import { DefaultSeo } from 'next-seo';
import ogimage from '../assets/ogimage.png';

const queryClient = new QueryClient();

export default function myApp({
  Component,
  pageProps,
}: AppProps<{ session: Session; dehydratedState: DehydratedState }>) {
  global();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Hydrate state={pageProps.dehydratedState}>
          <>
            <DefaultSeo
              title="Show Maker"
              openGraph={{
                images: [{ url: ogimage.src }],
                siteName: 'Show Maker',
                description: 'A maior rede social já feita. Elon Musk me contrate',
                url: 'https://show-maker.vercel.app',
                type: 'website',
              }}
              twitter={{ cardType: 'summary_large_image' }}
            />
            <Component {...pageProps} />
          </>
        </Hydrate>
      </SessionProvider>
    </QueryClientProvider>
  );
}
