import React from 'react';
import { useRouter } from 'next/router';
import { Main, PostPaginator } from '../../components';
import { Box, Heading } from '../../styles';
import { NextSeo } from 'next-seo';
import { useInfinitePostIdByScroll } from '../../hooks';

export default function Search() {
  const router = useRouter();
  const { title } = router.query;

  const { posts, isLoading, fetchNextPage, hasNextPage, isError } =
    useInfinitePostIdByScroll({
      api: `/api/post/search/${title}/page`,
      query: ['search', title],
    });

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

        <PostPaginator
          posts={posts}
          loading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      </Main>
    </>
  );
}
