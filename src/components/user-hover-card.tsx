import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { spinner } from '@/assets';
import { useFollow, useUnfollow } from '@/hooks/follow';
import { Box } from '@/styles/box';
import { Button } from '@/styles/button';
import { Flex } from '@/styles/flex';
import { Grid } from '@/styles/grid';
import { Heading } from '@/styles/heading';
import { ProfileIcon } from '@/styles/profile-icon';
import { diffBetweenDates } from '@/utils/diff-between-dates';
import { trpc } from '@/utils/trpc';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@radix-ui/react-hover-card';
import { User } from 'next-auth';
import { Text } from '@/styles/text';

interface IUserHoverCard {
  user: User;
  children: ReactNode;
}

export const UserHoverCard = ({ user, children }: IUserHoverCard) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const follow = useFollow();
  const unfollow = useUnfollow();

  const { data: posts, isLoading } = trpc.posts.feed.user.useInfiniteQuery(
    {
      username: user.name,
      limit: 3,
    },
    {
      enabled: open,
    }
  );

  const { data: friendshipStatus } = trpc.user.friendshipStatus.useQuery(
    {
      username: user.name,
    },
    {
      enabled: open,
      staleTime: 1,
    }
  );

  const { data: friendshipCount } = trpc.user.friendshipCount.useQuery(
    {
      username: user.name,
    },
    { enabled: open }
  );

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <Flex as={Link} href={`/${user.name}`}>
          {children}
        </Flex>
      </HoverCardTrigger>
      <HoverCardContent>
        <Box css={{ p: '$5 $5 $3 $5', borderBottom: '1px solid $bg4' }}>
          <Flex align={'center'} justify={'between'}>
            <Link href={`/${user.name}`} style={{ cursor: 'pointer' }}>
              <ProfileIcon
                src={user.image}
                css={{ size: 96, border: '2px solid $bg2' }}
                alt=""
              />
            </Link>
            {user.id !== session?.user.id && (
              <Button
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
          <Flex align={'center'} css={{ mt: '$3' }} gap={'1'}>
            <Link href={`/${user.name}`} style={{ cursor: 'pointer' }}>
              <Heading>{user.name}</Heading>
            </Link>
            {friendshipStatus?.followed_by && (
              <Text size={'2'} color={'gray'}>
                {' • '} Segue você
              </Text>
            )}
          </Flex>
          <Box>
            {posts && posts.pages[0].posts[0] && (
              <Text size={'2'}>
                Última postagem {diffBetweenDates(posts.pages[0].posts[0].createdAt)}
              </Text>
            )}

            <Flex gap={'4'}>
              <Text size={'2'}>
                Seguidores{' '}
                <Text weight={600} size={'2'}>
                  {friendshipCount?.followersAmount}
                </Text>
              </Text>
              <Text size={'2'}>
                Seguindo{' '}
                <Text weight={600} size={'2'}>
                  {friendshipCount?.followingAmount}
                </Text>
              </Text>
            </Flex>
          </Box>
        </Box>

        <Box css={{ height: 140, width: '100%' }}>
          {posts && posts.pages[0].posts.length !== 0 ? (
            <Grid columns={'3'} css={{ gap: '2px' }}>
              {posts.pages[0].posts.map((post) => (
                <Box
                  as={'section'}
                  key={post.id}
                  css={{
                    overflow: 'hidden',
                    '&:nth-of-type(1)': {
                      borderBottomLeftRadius: '$2',
                    },

                    '&:nth-of-type(3)': {
                      borderBottomRightRadius: '$2',
                    },
                  }}
                >
                  <Link href={`/post/${post.id}`}>
                    <Box
                      css={{
                        height: 28,
                        px: '$2',
                        ta: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.75rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {post.title && (
                        <Text weight={600} size={'2'}>
                          {post.title}
                        </Text>
                      )}
                    </Box>
                    <Box
                      css={{
                        mt: '$1',
                        transition: 'all 100ms',
                        overflow: 'hidden',
                        pt: '75%',
                        width: '100%',
                        position: 'relative',
                        cursor: 'pointer',

                        img: {
                          objectFit: 'cover',
                        },

                        '&:hover': {
                          opacity: '.7',
                        },
                      }}
                    >
                      <Image src={post.thumbnailUrl} alt="" fill sizes="" />
                    </Box>
                  </Link>
                </Box>
              ))}
            </Grid>
          ) : (
            <Flex justify={'center'} align={'center'} css={{ height: '100%' }}>
              {isLoading ? (
                <Flex justify={'center'}>
                  <Image src={spinner} height={40} width={40} alt="" />
                </Flex>
              ) : (
                <Text weight={600}>Sem posts</Text>
              )}
            </Flex>
          )}
        </Box>
      </HoverCardContent>
    </HoverCard>
  );
};
