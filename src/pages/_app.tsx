import type { AppProps } from 'next/app';
import { global } from '../styles/global';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import ogimage from '../assets/ogimage.jpeg';
import { trpc } from '../utils/trpc';

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  global();

  return (
    <SessionProvider session={pageProps.session}>
      <>
        <DefaultSeo
          title="Show Maker"
          openGraph={{
            images: [{ url: ogimage.src }],
            siteName: 'Show Maker',
            description: 'Posta ai',
            url: 'https://show-maker.vercel.app',
            type: 'website',
          }}
          twitter={{ cardType: 'summary_large_image' }}
          additionalMetaTags={[{ name: 'theme-color', content: '#000' }]}
        />
        <Component {...pageProps} />
      </>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
