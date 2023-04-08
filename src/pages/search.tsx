import React from 'react';
import { useRouter } from 'next/router';
import { Main, PostPaginator } from '../components';
import { Box, Heading } from '../styles';
import { NextSeo } from 'next-seo';
import { useInfinitePostIdByScroll } from '../hooks';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { q } = query;

  if (!q) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function Search() {
  const router = useRouter();
  const { q: title } = router.query;

  if (!title) {
    router.push('/');
  }

  const { posts, isLoading, fetchNextPage, hasNextPage, isError } =
    useInfinitePostIdByScroll({
      api: `/api/post/search?q=${title}&page=`,
      query: ['posts', 'search', title],
      enabled: !!title,
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
