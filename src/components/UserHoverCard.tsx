import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { keyframes, styled } from 'stitches.config';
import * as HoverCard from '@radix-ui/react-hover-card';
import { User } from '@types';
import { spinner } from '@assets';
import { diffBetweenDates, trpc } from '@utils';
import { useFollow, useUnfollow } from '@hooks';
import { Box, Flex, Grid, Heading, Text, Button, ProfileIcon } from '@styles';

const Fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

interface IUserHoverCard {
  user: User;
  children: ReactNode;
}

export const Content = styled(HoverCard.Content, {
  bc: '$bg1',
  br: '$3',
  width: '440px',
  zIndex: '$modal',
  border: '2px solid $bg2',
  transition: 'all 200ms ease-out',
  animation: `250ms ${Fade}`,
  bs: '0px 0px 12px black',
});

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
    <HoverCard.Root open={open} onOpenChange={setOpen} defaultOpen>
      <HoverCard.Trigger asChild>
        <Flex as={Link} href={`/${user.name}`}>
          {children}
        </Flex>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <Content>
          <Box css={{ p: '$5 $5 $3 $5', borderBottom: '2px solid $bg2' }}>
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
                <Text size={'2'} color={'secondary'}>
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
                      textAlign: 'center',

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
                          px: '$1',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Text weight={600} css={{ lh: '1.875rem' }} size={'2'}>
                          {post.title}
                        </Text>
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
        </Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
