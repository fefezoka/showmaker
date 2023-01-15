import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type TitleAndMetaTagsProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  pathname?: string;
};

export function TitleAndMetaTags({
  title = 'Showmaker',
  description = 'O maior rede social já feita. Elon Musk me contrate',
  imageUrl,
  url = 'https://showmaker.vercel.app',
  pathname,
}: TitleAndMetaTagsProps) {
  const router = useRouter();

  const path = pathname || router.pathname;

  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta property="og:url" content={`${url}${path}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:video" content={imageUrl} />

      {/* <meta name="twitter:site" content="@radix_ui" /> */}
      {/* <meta name="twitter:card" content="summary_large_image" /> */}
    </Head>
  );
}
