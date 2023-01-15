import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type TitleAndMetaTagsProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  url?: string;
  pathname?: string;
};

export function TitleAndMetaTags({
  title = 'Show Maker',
  description = 'A maior rede social já feita. Elon Musk me contrate',
  imageUrl,
  videoUrl,
  url = 'https://show-maker.vercel.app',
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
      <meta property="og:site_name" content="Show Maker" />
      {videoUrl ? (
        <meta property="og:video" content={videoUrl} />
      ) : (
        <meta property="og:image" content={imageUrl} />
      )}
      <meta property="og:type" content="website" />

      <meta name="twitter:site" content="@showmaker" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="show-maker.vercel.app" />
      <meta property="twitter:url" content={`${url}${path}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {videoUrl ? (
        <meta name="twitter:video" content={videoUrl} />
      ) : (
        <meta name="twitter:image" content={imageUrl} />
      )}
      <meta name="theme-color" content="#faaaff" />
    </Head>
  );
}
