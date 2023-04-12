import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import {
  Main,
  FullProfileIcon,
  Button,
  OsuHoverCard,
  FeedButton,
  PostPaginator,
} from '../components';
import { useFollow, useUnfollow } from '../hooks';
import Image from 'next/image';
import twitchIcon from '../assets/twitch-icon.png';
import BlitzNotFound from '../assets/blitz.webp';
import { Box, Flex, Text, Heading, ProfileSkeleton } from '../styles';
import { NextSeo } from 'next-seo';
import { trpc } from '../utils/trpc';

type Feed = 'posts' | 'favorites';

export default function Profile() {
  const router = useRouter();
  const name = router.query.name as string;
  const [feed, setFeed] = useState<Feed>('posts');
  const { data: session } = useSession();
  const followSomeone = useFollow();
  const unfollowSomeone = useUnfollow();
  const utils = trpc.useContext();

  const {
    data: user,
    isLoading,
    isError,
  } = trpc.user.profile.useQuery(
    { name: name as string },
    {
      enabled: !!name,
    }
  );

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading: postsIsLoading,
  } = trpc.posts.infinitePosts.user.profile.useInfiniteQuery(
    { name: name as string, feed },
    {
      getNextPageParam: (lastPage) => lastPage.posts.length === 6 && lastPage.posts[5].id,
      onSuccess(data) {
        data.pages.forEach((page) =>
          page.posts.forEach((post) =>
            utils.posts.byId.setData({ postId: post.id }, post)
          )
        );
      },
      enabled: !!name,
    }
  );

  if (isError) {
    return (
      <>
        <NextSeo title={`Usuário ${name ?? ''} não encontrado`} />
        <Main>
          <Flex as={'section'} direction={'column'} justify={'center'} align={'center'}>
            <Text size={'6'}>
              Usuário{' '}
              <Text size={'6'} weight={'bold'}>
                {name}
              </Text>{' '}
              não encontrado
            </Text>
            <Image src={BlitzNotFound} alt="" height={256} width={256} />
          </Flex>
        </Main>
      </>
    );
  }

  const handleFollowClick = async () => {
    if (!session) {
      return signIn('discord');
    }

    user &&
      (user.isFollowing
        ? unfollowSomeone.mutate({ followingUser: user })
        : followSomeone.mutate({ followingUser: user }));
  };

  return (
    <>
      {user && <NextSeo title={`Perfil de ${user.name}`} />}
      <Main>
        {!isLoading ? (
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
                  disabled={followSomeone.isLoading}
                  onClick={handleFollowClick}
                  value={
                    user.isFollowing
                      ? 'Parar de seguir'
                      : user.followYou
                      ? 'Seguir de volta'
                      : 'Seguir'
                  }
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
                  <OsuHoverCard username={user.name} osuAccountId={user.osuAccountId} />
                )}
                {user.twitchAccountId && (
                  <Box>
                    <Link
                      href={'https://twitch.tv/' + user.twitchAccountId}
                      target={'_blank'}
                    >
                      <Image alt="" height={32} width={32} src={twitchIcon} />
                    </Link>
                  </Box>
                )}
              </Flex>
            </Flex>

            <Flex justify={'center'} css={{ pt: '$4' }}>
              <FeedButton
                value={'Últimos posts'}
                type="button"
                onClick={() => setFeed('posts')}
                active={feed === 'posts'}
              />
              <FeedButton
                value={'Posts curtidos'}
                type="button"
                onClick={() => setFeed('favorites')}
                active={feed === 'favorites'}
              />
            </Flex>
          </Box>
        ) : (
          <ProfileSkeleton />
        )}

        <PostPaginator
          loading={postsIsLoading}
          posts={posts}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      </Main>
    </>
  );
}
