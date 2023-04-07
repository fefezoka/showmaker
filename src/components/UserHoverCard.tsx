import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ProfileIcon } from './ProfileIcon';
import { useQuery } from '@tanstack/react-query';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import axios from 'axios';
import { keyframes, styled } from '../../stitches.config';
import { Box, Flex, Heading, Text } from '../styles';
import Spinner from '../assets/Spinner.svg';

const Fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

interface Props {
  user: User;
  href: string;
  children: ReactNode;
}

export const Content = styled(HoverCard.Content, {
  color: '$white',
  backgroundColor: '$bg',
  borderRadius: '$3',
  width: '440px',
  zIndex: '$modal',
  border: '2px solid $bgalt',
  transition: 'all 200ms ease-out',
  animation: `250ms ${Fade}`,
  boxShadow: '0px 0px 12px black',
});

export const UserHoverCard = ({ user, href, children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: posts, isLoading } = useQuery<Post[]>(
    ['lastPosts', user.id],
    async () => {
      const { data } = await axios.get(`/api/user/${user.name}/last-posts`);
      return data;
    },
    {
      enabled: !!open,
    }
  );

  return (
    <HoverCard.Root open={open} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <Link href={href} prefetch={false}>
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
                <Text size={'3'}>
                  Última postagem {diffBetweenDates(new Date(posts[0].createdAt))}
                </Text>
              )}

              <Flex gap={'4'}>
                <Text size={'3'}>
                  Seguindo{' '}
                  <Text weight={'bold'} size={'3'}>
                    {user.followingAmount}
                  </Text>
                </Text>
                <Text size={'3'}>
                  Seguidores{' '}
                  <Text weight={'bold'} size={'3'}>
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
                      <Text size={'3'} weight={'bold'} css={{ lh: '1.875rem' }}>
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
                  <Text weight={'bold'}>Sem posts</Text>
                )}
              </Flex>
            )}
          </Flex>
        </Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
