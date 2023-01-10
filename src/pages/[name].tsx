import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Main, FeedPost, FullProfileIcon, Button, OsuHoverCard } from '../components';
import { useQuery } from 'react-query';
import { useGetPosts } from '../hooks/useGetPosts';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { Box, Flex, Text } from '../styles';
import { styled } from '../../stitches.config';

type Feed = 'posts' | 'favorites';

export const FeedButton = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  fontSize: '.875rem',
  padding: '14px 20px',
  borderRadius: '8px',
  transition: 'all 200ms',
  color: '$white',

  '&:hover': {
    backgroundColor: '$bgalt',
  },

  '@dsk2': {
    fontSize: '1rem',
  },

  variants: {
    active: {
      true: {
        fontWeight: 'bold',
      },
    },
  },
});

export default function Profile() {
  const [feed, setFeed] = useState<Feed>('posts');
  const { data: session } = useSession();
  const router = useRouter();
  const { name } = router.query;
  const { inView, ref } = useInView();
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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

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
            <h2>Usuário {name} não encontrado</h2>
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
      <Head>
        <title>Perfil de {user.name}</title>
      </Head>
      <Main>
        <Box as={'section'} css={{ pb: '0 !important' }}>
          <Flex justify={'between'} align={'center'} css={{ mb: '$4' }}>
            <Flex gap={{ '@initial': '3', '@dsk2': '6' }} align="center">
              <FullProfileIcon
                src={user.image}
                css={{ size: '72px', '@dsk2': { size: '128px' } }}
              />
              <Box>
                <h2>{user.name}</h2>
                {(user.followYou && user.isFollowing && <Text>Segue um ao outro</Text>) ||
                  (user.followYou && <Text>Segue você</Text>)}
              </Box>
            </Flex>

            {!(session?.user.id === user.id) && (
              <Button
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

          <Box css={{ fontSize: '15px' }}>
            <Box>
              Usuário desde{' '}
              <Text weight={'bold'}>
                {new Date(user.createdAt).getDate()}/
                {new Date(user.createdAt).getMonth() + 1}/
                {new Date(user.createdAt).getFullYear()}
              </Text>
            </Box>
            <Flex justify="between" align="center">
              <Flex gap={'5'}>
                <Text>
                  Seguindo <Text weight={'bold'}>{user.followingAmount}</Text>
                </Text>
                <Text>
                  Seguidores <Text weight={'bold'}>{user.followersAmount}</Text>
                </Text>
              </Flex>
              {<OsuHoverCard userId={user.id} />}
            </Flex>
          </Box>

          <Flex justify={'center'} css={{ pt: '$4' }}>
            <FeedButton onClick={() => setFeed('posts')} active={feed === 'posts'}>
              Últimos posts
            </FeedButton>
            <FeedButton
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
          posts.map(
            (post, index) =>
              post.data && (
                <FeedPost
                  post={post.data}
                  key={post.data.id}
                  ref={posts.length - 1 === index ? ref : null}
                />
              )
          )
        )}
      </Main>
    </>
  );
}
