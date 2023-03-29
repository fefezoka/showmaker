import React from 'react';
import { useRouter } from 'next/router';
import { Main, FeedPost } from '../../components';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Box, Heading } from '../../styles';
import { NextSeo } from 'next-seo';

export default function Search() {
  const router = useRouter();
  const { title } = router.query;

  const { data: posts, isLoading } = useQuery<Post[]>(
    ['search', title],
    async () => {
      const { data } = await axios.get(`/api/post/search/${title}`);
      return data;
    },
    {
      enabled: !!title,
    }
  );

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
      <NextSeo title={`Procurando por ${title}`} />
      <Main>
        <Box as={'section'}>
          <Heading>Procurando por {title}</Heading>
        </Box>
        {posts.map((post) => post && <FeedPost post={post} key={post.id} />)}
      </Main>
    </>
  );
}
