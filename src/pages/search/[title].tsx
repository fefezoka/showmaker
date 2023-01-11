import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Main, FeedPost } from '../../components';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useGetPosts } from '../../hooks/useGetPosts';
import { Box, Heading } from '../../styles';

export default function Search() {
  const router = useRouter();
  const { title } = router.query;

  const { data: ids, isLoading } = useQuery<{ id: string }[]>(
    ['search', title],
    async () => {
      const { data } = await axios.get(`/api/post/search/${title}`);
      return data;
    },
    {
      enabled: !!title,
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  const posts = useGetPosts(ids);

  if (isLoading) {
    return <Main loading />;
  }

  if (!posts || posts.length === 0) {
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
      <Head>
        <title>Procurando por {title}</title>
      </Head>
      <Main>
        <Box as={'section'}>
          <Heading>Procurando por {title}</Heading>
        </Box>
        {posts.map(
          (post) => post.data && <FeedPost post={post.data} key={post.data.id} />
        )}
      </Main>
    </>
  );
}
