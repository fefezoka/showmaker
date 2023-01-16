import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Main, FullProfileIcon, Button, OsuHoverCard } from '../components';
import { useQuery } from 'react-query';
import { useGetPosts } from '../hooks/useGetPosts';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { Box, Flex, Text, Heading } from '../styles';
import { styled } from '../../stitches.config';
import { PostPaginator } from '../components/PostPaginator';

type Feed = 'posts' | 'favorites';

export const FeedButton = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  fontSize: '$3',
  padding: '$3 $4',
  transition: 'background-color 200ms',
  color: '$white',

  '&:hover': {
    backgroundColor: '$bgalt',
  },

  '@bp2': {
    fontSize: '$4',
  },

  variants: {
    active: {
      true: {
        fontWeight: 'bold',
        borderBottom: '3px solid $blue',
      },
    },
  },
});

export default function Profile() {
  const [feed, setFeed] = useState<Feed>('posts');
  const { data: session } = useSession();
  const router = useRouter();
  const { name } = router.query;
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>(
    ['user', name],
    async () => {
      const { data } = await axios.get(`/api/user/byname/${name}`);
      return data;
    },
    {
      enabled: !!name,
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  const feedOptions = [
    {
      api: `/api/user/byid/${user?.id}/posts/page`,
      query: ['userposts', name as string],
      enabled: !!user,
    },
    {
      api: `/api/user/byid/${user?.id}/posts/page/favorites`,
      query: ['favorites', name as string],
      enabled: !!user,
    },
  ];

  const { ids, fetchNextPage, hasNextPage } = useInfinitePostIdByScroll(
    feedOptions[feed === 'posts' ? 0 : 1]
  );

  const posts = useGetPosts(
    ids?.pages.reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  );

  if (isLoading) {
    return <Main loading />;
  }

  if (!user) {
    return (
      <>
        <Head>
          <title>Perfil não encontrado</title>
        </Head>
        <Main>
          <Box as={'section'}>
            <Heading>Usuário {name} não encontrado</Heading>
          </Box>
        </Main>
      </>
    );
  }

  const handleFollowClick = async () => {
    if (!session) {
      return signIn('discord');
    }

    await axios.post(`/api/user/${user.isFollowing ? 'unfollow' : 'follow'}`, {
      followerId: session.user.id,
      followingId: user.id,
    });

    queryClient.setQueryData<User>(['user', name], (old) =>
      old
        ? {
            ...old,
            followersAmount: old.isFollowing
              ? old.followersAmount - 1
              : old.followersAmount + 1,
            isFollowing: !old.isFollowing,
          }
        : { ...user, isFollowing: !user.isFollowing }
    );

    queryClient.setQueryData<User>(['user', session.user.name], (old) =>
      old
        ? {
            ...old,
            followingAmount: user.isFollowing
              ? old.followingAmount - 1
              : old.followingAmount + 1,
          }
        : session.user
    );
  };

  return (
    <>
      <Main>
        <Box as={'section'} css={{ pb: '0 !important' }}>
          <Flex justify={'between'} align={'center'} css={{ mb: '$6' }}>
            <Flex gap={{ '@initial': '3', '@bp2': '6' }} align="center">
              <FullProfileIcon
                src={user.image}
                css={{ size: '84px', '@bp2': { size: '144px' } }}
              />
              <Box>
                <Heading size="2">{user.name}</Heading>
                {(user.followYou && user.isFollowing && (
                  <Text size={'3'}>Segue um ao outro</Text>
                )) ||
                  (user.followYou && <Text size={'3'}>Segue você</Text>)}
              </Box>
            </Flex>

            {!(session?.user.id === user.id) && (
              <Button
                type="button"
                value={
                  user.isFollowing
                    ? 'Parar de seguir'
                    : user.followYou
                    ? 'Seguir de volta'
                    : 'Seguir'
                }
                onClick={handleFollowClick}
              />
            )}
          </Flex>

          <Flex justify={'between'} align={'center'} gap={'5'}>
            <Box>
              <Box css={{ mb: '$1' }}>
                <Text size={'3'}>Usuário desde </Text>
                <Text size={'3'} weight={'bold'}>
                  {new Date(user.createdAt).getDate()}/
                  {new Date(user.createdAt).getMonth() + 1}/
                  {new Date(user.createdAt).getFullYear()}
                </Text>
              </Box>
              <Box>
                <Text size={'3'}>Seguindo </Text>
                <Text size={'3'} weight={'bold'} css={{ mr: '$3' }}>
                  {user.followingAmount}
                </Text>
                <Text size={'3'}>Seguidores </Text>
                <Text size={'3'} weight={'bold'}>
                  {user.followersAmount}
                </Text>
              </Box>
            </Box>

            {user.osuAccountId && (
              <OsuHoverCard userId={user.id} osuAccountId={user.osuAccountId} />
            )}
          </Flex>

          <Flex justify={'center'} css={{ pt: '$4' }}>
            <FeedButton
              type="button"
              onClick={() => setFeed('posts')}
              active={feed === 'posts'}
            >
              Últimos posts
            </FeedButton>
            <FeedButton
              type="button"
              onClick={() => setFeed('favorites')}
              active={feed === 'favorites'}
            >
              Posts curtidos
            </FeedButton>
          </Flex>
        </Box>

        {posts.slice(0, 6).some((post) => post.status === 'loading') ? (
          <Flex justify={'center'} css={{ mt: '$4' }}>
            <Image src={Spinner} alt="" width={54} height={54} />
          </Flex>
        ) : (
          <PostPaginator
            posts={posts}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </Main>
    </>
  );
}
