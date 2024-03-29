import { NextSeo } from 'next-seo';
import { useState } from 'react';
import { trpc } from '@utils';
import { Main, PostPaginator, gameOptions } from '@components';
import { Box, Flex, Heading, Button } from '@styles';

const feedOptions = [{ label: 'Todos', value: 'all' }, ...gameOptions] as const;
type feed = (typeof feedOptions)[number];

export default function Timeline() {
  const [feed, setFeed] = useState<feed>(feedOptions[0]);

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.posts.feed.home.useInfiniteQuery(
    {
      ...(feed.value !== 'all' && { game: feed.value }),
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <Main>
      <NextSeo title="Show Maker // Página inicial" />
      <Box as={'section'} css={{ pb: '0 !important' }}>
        <Heading size="2">Últimos posts</Heading>
        <Flex
          justify={'between'}
          css={{
            mt: '$2',
            ox: 'scroll',
            '&::-webkit-scrollbar': { display: 'none' },
            '@bp2': { ox: 'unset' },
          }}
        >
          {feedOptions.map((option) => (
            <Button
              ghost
              active={feed.value === option.value}
              key={option.value}
              onClick={() => setFeed(option)}
            >
              {option.label}
            </Button>
          ))}
        </Flex>
      </Box>
      <PostPaginator
        loading={isLoading}
        posts={posts}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </Main>
  );
}
