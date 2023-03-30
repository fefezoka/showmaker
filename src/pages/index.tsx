import { Main, FeedButton } from '../components';
import { useInfinitePostIdByScroll } from '../hooks';
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
  { label: 'LOL', value: 'lol' },
  { label: 'Outros', value: 'other' },
] as const;
type feed = typeof feedOptions[number];

export default function Timeline() {
  const [feed, setFeed] = useState<feed>(feedOptions[0]);

  const { posts, fetchNextPage, hasNextPage, isLoading } = useInfinitePostIdByScroll(
    feed.value === 'all'
      ? { api: '/api/post/feed/page', query: ['homepagePosts'] }
      : {
          api: `/api/post/bygame/${feed.value}/page`,
          query: ['feed', feed.value],
        }
  );

  return (
    <>
      <NextSeo title="Show Maker // Página inicial" />
      <Main>
        <Box as={'section'} css={{ pb: '0 !important' }}>
          <Heading>Últimos posts</Heading>
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
                value={option.label}
              />
            ))}
          </Flex>
        </Box>
        {!isLoading ? (
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
