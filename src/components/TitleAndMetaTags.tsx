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
  title = 'Show Maker',
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

      <meta name="title" content="Show Maker" />
      <meta name="description" content={description} />

      <meta property="og:url" content={`${url}${path}`} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={description} />
      <meta property="og:video" content={imageUrl} />
      <meta property="og:video:type" content="application/x-shockwave-flash" />
      <meta property="og:video:width" content="320" />
      <meta property="og:video:height" content="180" />

      <meta name="twitter:site" content="@showmaker" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
