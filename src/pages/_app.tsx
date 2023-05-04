import type { AppProps } from 'next/app';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import NextNProgress from 'nextjs-progressbar';
import { ogimage } from '@assets';
import { trpc } from '@utils';
import { global } from '@styles';
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
      <NextNProgress
        color="linear-gradient(90deg, var(--colors-violet11), var(--colors-blue11))"
        options={{ trickle: false, speed: 100 }}
        transformCSS={(css) => {
          css += `#nprogress {
            position: fixed;
            z-index: 9999;
          }`;
          return <style>{css}</style>;
        }}
      />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
