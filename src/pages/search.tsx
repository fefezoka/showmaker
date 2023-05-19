import React from 'react';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { trpc } from '@utils';
import { ListUsers, Main, PostPaginator } from '@components';
import { Box, Grid, Heading } from '@styles';

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
    props: {
      q,
    },
  };
};

export default function Search({ q }: { q: string }) {
  const posts = trpc.posts.feed.search.useInfiniteQuery(
    { q },
    {
      enabled: !!q,
      getNextPageParam: (lastPage, pages) =>
        lastPage.posts.length === 6 && pages.length + 1,
    }
  );

  const users = trpc.user.search.useQuery({ q, limit: 2 });

  if (posts.isError && users.isError) {
    return (
      <Main>
        <Box as={'section'}>
          <Heading size="2">Post não encontrado</Heading>
        </Box>
      </Main>
    );
  }

  return (
    <Main>
      <NextSeo title={`Procurando por ${q}`} />
      <Box as={'section'}>
        <Heading size="2">Procurando por &quot;{q}&quot;</Heading>
      </Box>

      {users.data && users.data.length !== 0 && (
        <Box as={'section'}>
          <Heading>Usuários</Heading>
          <Grid
            columns={{ '@initial': '1', '@bp2': '2' }}
            gap={'2'}
            css={{ mt: '$1', height: 76 }}
          >
            <ListUsers users={users.data} transparent={false} />
          </Grid>
        </Box>
      )}
      <PostPaginator
        posts={posts.data}
        loading={posts.isLoading}
        fetchNextPage={posts.fetchNextPage}
        hasNextPage={posts.hasNextPage}
      />
    </Main>
  );
}
