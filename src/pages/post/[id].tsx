import React from 'react';
import { Main, FeedPost, TitleAndMetaTags } from '../../components';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Box, Heading } from '../../styles';

export default function Post() {
  const router = useRouter();
  const { id } = router.query;

  const { data: post, isLoading } = useQuery<Post>(
    ['post', id],
    async () => {
      const { data } = await axios.get(`/api/post/${id}`);
      return data;
    },
    {
      enabled: !!id,
      staleTime: Infinity,
    }
  );

  if (isLoading) {
    return <Main loading />;
  }

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
      <TitleAndMetaTags
        title={post.user?.name + ' - ' + post.title}
        imageUrl={post.thumbnailUrl}
      />
      <Main>
        <FeedPost post={post} full />
      </Main>
    </>
  );
}
