import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import BlitzNotFound from '../assets/blitz.webp';
import { NextSeo } from 'next-seo';
import { trpc } from '../utils/trpc';
import {
  FullProfileIcon,
  Button,
  OsuHoverCard,
  FeedButton,
  PostPaginator,
  UserFollowTabs,
  ProviderIcon,
} from '@components';
import { useFollow, useUnfollow } from '@hooks';
import { Box, Flex, Text, Heading, ProfileSkeleton } from '@styles';

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
  } = trpc.posts.infinitePosts.feed.useInfiniteQuery(
    { ...(feed === 'posts' && { username: name }), feed, limit: 6 },
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

  const { data: friendship_status } = trpc.user.friendshipStatus.useQuery(
    { username: name },
    { enabled: !!name }
  );

  const { data: friendship_count } = trpc.user.friendshipCount.useQuery(
    { username: name },
    { enabled: !!name }
  );

  if (isError) {
    return (
      <>
        <NextSeo title={`Usuário ${name ?? ''} não encontrado`} />
        <Flex as={'section'} direction={'column'} justify={'center'} align={'center'}>
          <Text size={'6'}>
            Usuário{' '}
            <Text size={'6'} weight={600}>
              {name}
            </Text>{' '}
            não encontrado
          </Text>
          <Image src={BlitzNotFound} alt="" height={256} width={256} />
        </Flex>
      </>
    );
  }

  const handleFollowClick = async () => {
    if (!session) {
      return signIn('discord');
    }

    user &&
      (friendship_status?.following
        ? unfollowSomeone.mutate({ followingUser: user })
        : followSomeone.mutate({ followingUser: user }));
  };

  return (
    <>
      {user && <NextSeo title={`Perfil de ${user.name}`} />}
      {!isLoading ? (
        <Box as={'section'} css={{ pb: '0 !important' }}>
          <Flex
            justify={'between'}
            align={'center'}
            css={{ mb: '$3', '@bp2': { mb: '$5' } }}
          >
            <Flex gap={{ '@initial': '3', '@bp2': '6' }} align="center">
              <FullProfileIcon
                src={user.image}
                css={{ size: '84px', '@bp2': { size: '144px' } }}
              />
              <Box>
                <Heading size={'3'}>{user.name}</Heading>
                {(friendship_status?.followed_by && friendship_status.following && (
                  <Text size={'2'} color={'secondary'}>
                    Segue um ao outro
                  </Text>
                )) ||
                  (friendship_status?.followed_by && (
                    <Text size={'2'} color={'secondary'}>
                      Segue você
                    </Text>
                  ))}
              </Box>
            </Flex>

            {session?.user.id !== user.id && (
              <Button
                type="button"
                disabled={followSomeone.isLoading}
                onClick={handleFollowClick}
              >
                {friendship_status?.following ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </Flex>

          <Flex justify={'between'} align={'center'} gap={'5'}>
            <Box>
              <Box css={{ mb: '$1' }}>
                <Text size={'2'}>Usuário desde </Text>
                <Text size={'2'} weight={600}>
                  {new Intl.DateTimeFormat('pt-BR').format(
                    new Date(user.createdAt).getTime()
                  )}
                </Text>
              </Box>
              <Flex gap={'3'}>
                <UserFollowTabs userId={user.id} defaultTab="followers">
                  <Box as={'button'}>
                    <Text size={'2'}>Seguidores </Text>
                    <Text size={'2'} weight={600}>
                      {friendship_count?.followersAmount}
                    </Text>
                  </Box>
                </UserFollowTabs>
                <UserFollowTabs userId={user.id} defaultTab="following">
                  <Box as={'button'}>
                    <Text size={'2'}>Seguindo </Text>
                    <Text size={'2'} weight={600}>
                      {friendship_count?.followingAmount}
                    </Text>
                  </Box>
                </UserFollowTabs>
              </Flex>
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
                    <ProviderIcon provider="twitch" />
                  </Link>
                </Box>
              )}
            </Flex>
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
      ) : (
        <ProfileSkeleton />
      )}

      <PostPaginator
        loading={postsIsLoading}
        posts={posts}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </>
  );
}
