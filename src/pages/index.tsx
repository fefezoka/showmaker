import { Main, FeedButton, PostPaginator } from '@components';
import { Box, Flex, Heading } from '@styles';
import { NextSeo } from 'next-seo';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

const feedOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Valorant', value: 'valorant' },
  { label: 'FIFA', value: 'fifa' },
  { label: 'CS:GO', value: 'csgo' },
  { label: 'Rainbow Six', value: 'r6' },
  { label: 'LOL', value: 'lol' },
  { label: 'Outros', value: 'other' },
] as const;
type feed = typeof feedOptions[number];

export default function Timeline() {
  const [feed, setFeed] = useState<feed>(feedOptions[0]);
  const utils = trpc.useContext();

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.posts.infinitePosts.feed.useInfiniteQuery(
    {
      ...(feed.value !== 'all' && { game: feed.value }),
    },
    {
      getNextPageParam: (lastPage) => lastPage.posts.length === 6 && lastPage.posts[5].id,
      onSuccess(data) {
        data.pages.forEach((page) =>
          page.posts.forEach((post) =>
            utils.posts.byId.setData({ postId: post.id }, post)
          )
        );
      },
    }
  );

  return (
    <>
      <NextSeo title="Show Maker // Página inicial" />
      <Main>
        <Box as={'section'} css={{ pb: '0 !important' }}>
          <Heading size="2">Últimos posts</Heading>
          <Flex
            justify={'between'}
            css={{
              mt: '$2',
              overflowX: 'scroll',
              '&::-webkit-scrollbar': { display: 'none' },
              '@bp2': { overflowX: 'unset' },
            }}
          >
            {feedOptions.map((option) => (
              <FeedButton
                active={feed.value === option.value}
                key={option.value}
                onClick={() => setFeed(option)}
              >
                {option.label}
              </FeedButton>
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
    </>
  );
}
