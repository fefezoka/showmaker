import React from 'react';
import { useRouter } from 'next/router';
import { Main, PostPaginator } from '../components';
import { Box, Heading } from '../styles';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { trpc } from '../utils/trpc';

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

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isError,
  } = trpc.posts.infinitePosts.search.useInfiniteQuery(
    { q: title as string },
    {
      enabled: !!title,
      getNextPageParam: (lastPage, pages) =>
        lastPage.posts.length === 6 && pages.length + 1,
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
