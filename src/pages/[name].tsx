import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { signIn, useSession } from 'next-auth/react';
import {
  Main,
  FullProfileIcon,
  Button,
  OsuHoverCard,
  FeedButton,
  PostPaginator,
} from '../components';
import { useFollowSomeone, useInfinitePostIdByScroll } from '../hooks';
import Image from 'next/image';
import twitchIcon from '../assets/twitch-icon.png';
import Spinner from '../assets/Spinner.svg';
import { Box, Flex, Text, Heading } from '../styles';
import { NextSeo } from 'next-seo';

type Feed = 'posts' | 'favorites';

export default function Profile() {
  const router = useRouter();
  const { name } = router.query;
  const [feed, setFeed] = useState<Feed>('posts');
  const { data: session } = useSession();
  const followSomeone = useFollowSomeone();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>(
    ['user', name],
    async () => {
      const { data } = await axios.get(`/api/user/byname/${name}`);
      return data;
    },
    {
      enabled: !!name,
    }
  );

  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isLoading: postsIsLoading,
  } = useInfinitePostIdByScroll(
    feed === 'posts'
      ? {
          api: `/api/user/byid/${user?.id}/posts/page`,
          query: ['userposts', name as string],
          enabled: !!user,
        }
      : {
          api: `/api/user/byid/${user?.id}/posts/page/favorites`,
          query: ['favorites', name as string],
          enabled: !!user,
        }
  );

  if (isError) {
    return (
      <>
        <NextSeo title={`Usuário ${name ?? ''} não encontrado`} />
        <Main>
          <Box as={'section'}>
            <Heading>Usuário {name} não encontrado</Heading>
          </Box>
        </Main>
      </>
    );
  }

  if (isLoading || !user) {
    return <Main loading />;
  }

  const handleFollowClick = async () => {
    if (!session) {
      return signIn('discord');
    }

    followSomeone.mutate(user);
  };

  return (
    <>
      <NextSeo title={`Perfil de ${user.name}`} />
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

            {session?.user.id !== user.id && (
              <Button
                type="button"
                value={
                  user.isFollowing
                    ? 'Parar de seguir'
                    : user.followYou
                    ? 'Seguir de volta'
                    : 'Seguir'
                }
                disabled={followSomeone.isLoading}
                onClick={handleFollowClick}
              />
            )}
          </Flex>

          <Flex justify={'between'} align={'center'} gap={'5'}>
            <Box>
              <Box css={{ mb: '$1' }}>
                <Text size={'3'}>Usuário desde </Text>
                <Text size={'3'} weight={'bold'}>
                  {new Intl.DateTimeFormat('pt-BR').format(
                    new Date(user.createdAt).getTime()
                  )}
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

            <Flex align={'center'} gap={'2'}>
              {user.osuAccountId && (
                <OsuHoverCard userId={user.id} osuAccountId={user.osuAccountId} />
              )}
              {user.twitchAccountId && (
                <div>
                  <Link
                    href={'https://twitch.tv/' + user.twitchAccountId}
                    target={'_blank'}
                  >
                    <Image alt="" height={32} width={32} src={twitchIcon} />
                  </Link>
                </div>
              )}
            </Flex>
          </Flex>

          <Flex justify={'center'} css={{ pt: '$4' }}>
            <FeedButton
              type="button"
              onClick={() => setFeed('posts')}
              active={feed === 'posts'}
              value={'Últimos posts'}
            />
            <FeedButton
              value={'Posts curtidos'}
              type="button"
              onClick={() => setFeed('favorites')}
              active={feed === 'favorites'}
            />
          </Flex>
        </Box>

        {!postsIsLoading ? (
          <PostPaginator
            posts={posts}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        ) : (
          <Flex justify={'center'} css={{ mt: '$4' }}>
            <Image src={Spinner} alt="" width={54} height={54} />
          </Flex>
        )}
      </Main>
    </>
  );
}
