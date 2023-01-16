import React from 'react';
import { Main, FeedPost } from '../../components';
import axios from 'axios';
import { dehydrate, QueryClient } from 'react-query';
import { Box, Heading } from '../../styles';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';

interface Props {
  post: Post;
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
      post: dehydrate(queryClient).queries[0].state.data,
    },
  };
};

export default function Post({ post }: Props) {
  if (!post) {
    return (
      <Main>
        <Box as={'section'}>
          <Heading>Post não encontrado</Heading>
        </Box>
      </Main>
    );
  }

  return (
    <>
      <NextSeo
        title={post.user?.name + ' - ' + post.title}
        openGraph={{
          images: [{ url: post.thumbnailUrl }],
          videos: [{ url: post.videoUrl }],
          type: 'video.other',
        }}
      />
      <Main>
        <FeedPost post={post} full />
      </Main>
    </>
  );
}
