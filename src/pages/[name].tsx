import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { blitz } from '@/assets';
import { NextSeo } from 'next-seo';
import { trpc } from '@/utils/trpc';
import { Main } from '@/components/main';
import { Flex } from '@/styles/flex';
import { Text } from '@/styles/text';
import { Box } from '@/styles/box';
import { FullProfileIcon } from '@/styles/full-profile-icon';
import { Heading } from '@/styles/heading';
import { UserFollowTabs } from '@/components/user-follow-tabs';
import { OsuHoverCard } from '@/components/osu-hover-card';
import { ProviderIcon } from '@/styles/provider-icon';
import { Button } from '@/styles/button';
import { PostPaginator } from '@/components/post-paginator';
import { ProfileSkeleton } from '@/styles/skeleton';
import { useFollow, useUnfollow } from '@/hooks/follow';

type Feed = 'posts' | 'favorites';

export default function Profile() {
  const router = useRouter();
  const name = router.query.name as string;
  const [feed, setFeed] = useState<Feed>('posts');
  const { data: session } = useSession();
  const follow = useFollow();
  const unfollow = useUnfollow();

  const {
    data: user,
    isLoading,
    isError,
  } = trpc.user.profile.useQuery(
    { name: name },
    {
      enabled: !!name,
    }
  );

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading: postsIsLoading,
  } = trpc.posts.feed.user.useInfiniteQuery(
    { username: name, feed },
    { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !!name }
  );

  const { data: friendshipStatus } = trpc.user.friendshipStatus.useQuery(
    { username: name },
    { enabled: !!name }
  );

  const { data: friendshipCount } = trpc.user.friendshipCount.useQuery(
    { username: name },
    { enabled: !!name }
  );

  if (isError) {
    return (
      <Main>
        <NextSeo title={`Usuário ${name ?? ''} não encontrado`} />
        <Flex as={'section'} direction={'column'} justify={'center'} align={'center'}>
          <Text size={'6'}>
            Usuário{' '}
            <Text size={'6'} weight={600}>
              {name}
            </Text>{' '}
            não encontrado
          </Text>
          <Image src={blitz} alt="" height={256} width={256} />
        </Flex>
      </Main>
    );
  }

  return (
    <Main>
      {user && <NextSeo title={`Perfil de ${user.name}`} />}
      {!isLoading && user ? (
        <Box as={'section'} css={{ pb: '0 !important' }}>
          <Flex
            justify={'between'}
            align={'center'}
            css={{ mb: '$3', '@bp2': { mb: '$5' } }}
          >
            <Flex gap={{ '@initial': '3', '@bp2': '5' }} align="center">
              <FullProfileIcon
                src={user.image}
                css={{ size: 84, '@bp2': { size: 144 } }}
              />
              <Box>
                <Heading size={'3'}>{user.name}</Heading>
                {(friendshipStatus?.followedBy && friendshipStatus.following && (
                  <Text size={'2'} color={'gray'}>
                    Segue um ao outro
                  </Text>
                )) ||
                  (friendshipStatus?.followedBy && (
                    <Text size={'2'} color={'gray'}>
                      Segue você
                    </Text>
                  ))}
              </Box>
            </Flex>

            {session?.user.id !== user.id && (
              <Button
                type="button"
                disabled={follow.isPending}
                onClick={() => {
                  friendshipStatus?.following
                    ? unfollow.mutate({ followingUser: user })
                    : follow.mutate({ followingUser: user });
                }}
              >
                {friendshipStatus?.following ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </Flex>

          <Flex justify={'between'} align={'center'} gap={'5'}>
            <Box>
              <Box css={{ mb: '$1' }}>
                <Text size={'2'}>Usuário desde </Text>
                <Text size={'2'} weight={600}>
                  {new Intl.DateTimeFormat('pt-BR').format(user.createdAt.getTime())}
                </Text>
              </Box>
              <Flex gap={'3'}>
                <UserFollowTabs userId={user.id} defaultTab="followers">
                  <Box as={'button'} type="button">
                    <Text size={'2'}>Seguidores </Text>
                    <Text size={'2'} weight={600}>
                      {friendshipCount?.followersAmount}
                    </Text>
                  </Box>
                </UserFollowTabs>
                <UserFollowTabs userId={user.id} defaultTab="following">
                  <Box as={'button'} type="button">
                    <Text size={'2'}>Seguindo </Text>
                    <Text size={'2'} weight={600}>
                      {friendshipCount?.followingAmount}
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
            <Button
              ghost
              type="button"
              onClick={() => setFeed('posts')}
              active={feed === 'posts'}
            >
              Últimos posts
            </Button>
            <Button
              ghost
              type="button"
              onClick={() => setFeed('favorites')}
              active={feed === 'favorites'}
            >
              Posts curtidos
            </Button>
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
  );
}
