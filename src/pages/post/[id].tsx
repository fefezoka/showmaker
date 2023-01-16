import React from 'react';
import { Main, FeedPost } from '../../components';
import axios from 'axios';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { Box, Heading } from '../../styles';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

interface Props {
  dehydratedState: Post;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params!.id;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    ['post', id],
    async () => {
      const { data } = await axios.get(`${process.env.SITE_URL}/api/post/${id}`);
      return data;
    },
    {
      staleTime: Infinity,
    }
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient).queries[0]?.state.data ?? null,
    },
  };
};

export default function Post({ dehydratedState }: Props) {
  const router = useRouter();
  const { id } = router.query;

  const { data: post, isLoading } = useQuery(
    ['post', id],
    async () => {
      const { data } = await axios.get(`/api/post/${id}`);
      return data;
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return (
    <>
      {dehydratedState && (
        <NextSeo
          title={dehydratedState.user?.name + ' - ' + dehydratedState.title}
          openGraph={{
            images: [{ url: dehydratedState.thumbnailUrl }],
            videos: [{ url: dehydratedState.videoUrl }],
            type: 'video.other',
          }}
        />
      )}

      <Main loading={isLoading}>
        {post && !isLoading && <FeedPost post={post} full />}
        {!post && !isLoading && (
          <Box as={'section'}>
            <Heading>Post não encontrado</Heading>
          </Box>
        )}
      </Main>
    </>
  );
}
