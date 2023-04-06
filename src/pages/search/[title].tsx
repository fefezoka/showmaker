import React from 'react';
import { useRouter } from 'next/router';
import { Main, FeedPost } from '../../components';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Box, Heading } from '../../styles';
import { NextSeo } from 'next-seo';
import { PostSkeleton } from '../../styles/Skeleton';

export default function Search() {
  const router = useRouter();
  const { title } = router.query;

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>(
    ['search', title],
    async () => {
      const { data } = await axios.get(`/api/post/search/${title}`);
      return data;
    },
    {
      enabled: !!title,
    }
  );

  if (isError) {
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

        {isLoading ? (
          <Box>
            <PostSkeleton />
            <PostSkeleton />
          </Box>
        ) : (
          posts.map((post) => post && <FeedPost post={post} key={post.id} />)
        )}
      </Main>
    </>
  );
}
