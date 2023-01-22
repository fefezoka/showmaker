import { Main, FeedButton } from '../components';
import { useGetPosts } from '../hooks/useGetPosts';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';
import { Box, Flex, Heading } from '../styles';
import { PostPaginator } from '../components/PostPaginator';
import { NextSeo } from 'next-seo';
import { useState } from 'react';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';

const feedOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Valorant', value: 'valorant' },
  { label: 'FIFA', value: 'fifa' },
  { label: 'CS:GO', value: 'csgo' },
  { label: 'Rainbow Six', value: 'r6' },
  { label: 'Rocket League', value: 'rocketleague' },
  { label: 'Outro', value: 'other' },
] as const;
type feed = typeof feedOptions[number];

export default function Timeline() {
  const [feed, setFeed] = useState<feed>(feedOptions[0]);

  const fetchFeeds: { api: string; query: string | string[] }[] = [
    { api: '/api/post/feed/page', query: 'homepageIds' },
    {
      api: `/api/post/bygame/${feed.value}/page`,
      query: ['feed', feed.value as string],
    },
  ];

  const { ids, fetchNextPage, hasNextPage } = useInfinitePostIdByScroll(
    feed.value === 'all' ? fetchFeeds[0] : fetchFeeds[1]
  );

  const posts = useGetPosts(
    ids?.pages.reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  );

  return (
    <>
      <NextSeo title="Show Maker // Página inicial" />
      <Main>
        <Box as={'section'}>
          <Heading>Últimos posts</Heading>
          <Flex justify={'between'} wrap={'wrap'} css={{ mt: '$2' }}>
            {feedOptions.map((option) => (
              <FeedButton
                active={feed.value === option.value}
                key={option.value}
                onClick={() => setFeed(option)}
                value={option.label}
              />
            ))}
          </Flex>
        </Box>
        {!posts.slice(0, 6).some((post) => post.isLoading) ? (
          <PostPaginator
            posts={posts}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        ) : (
          <Flex justify={'center'} css={{ mt: '$2' }}>
            <Image src={Spinner} width={52} height={52} alt="" />
          </Flex>
        )}
      </Main>
    </>
  );
}
