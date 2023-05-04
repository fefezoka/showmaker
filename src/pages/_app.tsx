import type { AppProps } from 'next/app';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { ogimage } from '@assets';
import { trpc } from '@utils';
import { global } from 'src/styles';
import { useQueryDefaults } from '@hooks';

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  useQueryDefaults();
  global();

  return (
    <SessionProvider session={pageProps.session}>
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
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
