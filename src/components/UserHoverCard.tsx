import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ProfileIcon } from './ProfileIcon';
import { useQuery } from 'react-query';
import { diffBetweenDates } from '../utils/diffBetweenDates';
import { useGetPosts } from '../hooks/useGetPosts';
import axios from 'axios';
import { keyframes, styled } from '../../stitches.config';
import { Box, Flex, Text } from '../styles';

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
  children: ReactNode;
}

export const Content = styled(HoverCard.Content, {
  color: '$white',
  backgroundColor: '$bg',
  borderRadius: '12px',
  width: '440px',
  zIndex: '$modal',
  border: '2px solid $bgalt',
  transition: 'all 200ms ease-out',
  animation: `250ms ${Fade}`,
  boxShadow: '0px 0px 12px black',
});

export const UserHoverCard = ({ user, children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data } = useQuery<Post[]>(
    ['lastPosts', user.id],
    async () => {
      const { data } = await axios.get(`/api/user/byid/${user.id}/posts/lastPosts`);
      return data;
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: !!open,
    }
  );

  const posts = useGetPosts(data);

  return (
    <HoverCard.Root open={open ? true : false} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <Content>
          <Box css={{ p: '20px 20px 12px 20px', borderBottom: '2px solid $bgalt' }}>
            <Link href={`/${user.name}`} style={{ cursor: 'pointer' }}>
              <Box>
                <ProfileIcon src={user.image} size={96} alt="" />
                <h2 style={{ marginTop: '8px' }}>{user.name}</h2>
              </Box>
            </Link>

            <Box css={{ fontSize: '14px' }}>
              {posts[0] && posts[0].data && (
                <Text>
                  Última postagem{' '}
                  {diffBetweenDates(new Date(), new Date(posts[0].data.createdAt))}
                </Text>
              )}

              <Flex gap={'4'}>
                <Text>
                  Seguindo <Text weight={'bold'}>{user.followingAmount}</Text>
                </Text>
                <Text>
                  Seguidores <Text weight={'bold'}>{user.followersAmount}</Text>
                </Text>
              </Flex>
            </Box>
          </Box>
          <Flex gap="1" css={{ pt: '8px' }}>
            {posts ? (
              posts.map(
                (post) =>
                  post.data && (
                    <Box
                      as={'section'}
                      key={post.data.id}
                      css={{
                        width: 'calc(100%/3)',
                        overflow: 'hidden',
                        textAlign: 'center',

                        '&:nth-of-type(1)': {
                          borderBottomLeftRadius: '8px',
                        },

                        '&:nth-of-type(3)': {
                          borderBottomRightRadius: '8px',
                        },
                      }}
                    >
                      <Link href={`/post/${post.data.id}`}>
                        <Text css={{ fontSize: '14px', lh: '1.5rem', fontWeight: 700 }}>
                          {post.data.title.slice(0, 17)}
                        </Text>
                        <Box
                          css={{
                            mt: '4px',
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
                          <Image src={post.data.thumbnailUrl} alt="" fill sizes="" />
                        </Box>
                      </Link>
                    </Box>
                  )
              )
            ) : (
              <Box>Sem posts</Box>
            )}
          </Flex>
        </Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
