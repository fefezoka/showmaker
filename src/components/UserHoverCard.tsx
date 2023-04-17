import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as HoverCard from '@radix-ui/react-hover-card';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { keyframes, styled } from '../../stitches.config';
import Spinner from '../assets/Spinner.svg';
import { trpc } from '../utils/trpc';
import { User } from '../@types/types';
import { ProfileIcon } from '@components';
import { Box, Flex, Heading, Text } from '@styles';

const Fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

interface UserHoverCardProps {
  user: User;
  children: ReactNode;
}

export const Content = styled(HoverCard.Content, {
  backgroundColor: '$bg',
  borderRadius: '$3',
  width: '440px',
  zIndex: '$modal',
  border: '2px solid $bgalt',
  transition: 'all 200ms ease-out',
  animation: `250ms ${Fade}`,
  boxShadow: '0px 0px 12px black',
});

export const UserHoverCard = ({ user, children }: UserHoverCardProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: posts, isLoading } = trpc.user.lastPosts.useQuery(
    {
      username: user.name,
    },
    { enabled: open }
  );

  return (
    <HoverCard.Root open={open} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <Link href={`/${user.name}`} prefetch={false}>
          {children}
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <Content>
          <Box css={{ p: '$5 $5 $3 $5', borderBottom: '2px solid $bgalt' }}>
            <Link href={`/${user.name}`} style={{ cursor: 'pointer' }}>
              <Box>
                <ProfileIcon src={user.image} css={{ size: '96px' }} alt="" />
                <Box css={{ mt: '$3' }}>
                  <Heading>{user.name}</Heading>
                </Box>
              </Box>
            </Link>

            <Box>
              {posts && posts[0] && (
                <Text size={'2'}>
                  Última postagem {diffBetweenDates(new Date(posts[0].createdAt))}
                </Text>
              )}

              <Flex gap={'4'}>
                <Text size={'2'}>
                  Seguindo{' '}
                  <Text weight={600} size={'3'}>
                    {user.followingAmount}
                  </Text>
                </Text>
                <Text size={'2'}>
                  Seguidores{' '}
                  <Text weight={600} size={'3'}>
                    {user.followersAmount}
                  </Text>
                </Text>
              </Flex>
            </Box>
          </Box>
          <Flex css={{ gap: '2px', minHeight: '140px' }}>
            {posts && posts.length !== 0 ? (
              posts.map((post) => (
                <Box
                  as={'section'}
                  key={post.id}
                  css={{
                    width: 'calc(100%/3)',
                    overflow: 'hidden',
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
                        px: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Text size={'3'} weight={600} css={{ lh: '1.875rem' }}>
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
              ))
            ) : (
              <Flex
                justify={'center'}
                align={'center'}
                css={{ minHeight: '140px', width: '100%' }}
              >
                {isLoading ? (
                  <Flex justify={'center'}>
                    <Image src={Spinner} height={40} width={40} alt="" />
                  </Flex>
                ) : (
                  <Text weight={600}>Sem posts</Text>
                )}
              </Flex>
            )}
          </Flex>
        </Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
