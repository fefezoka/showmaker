import type { AppProps } from 'next/app';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { ogimage } from '@assets';
import { trpc } from '@utils';
import { ToastContainer, global } from '@styles';
import { ThemeProvider } from 'next-themes';
import { lightTheme } from '../../stitches.config';

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  global();

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider
        disableTransitionOnChange
        attribute="class"
        value={{ dark: 'dark-theme', light: lightTheme.className }}
        defaultTheme="system"
      >
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
        <ToastContainer />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
