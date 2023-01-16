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

export const UserHoverCard = ({ user, children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data, isLoading } = useQuery<Post[]>(
    ['lastPosts', user.id],
    async () => {
      const { data } = await axios.get(`/api/user/byid/${user.id}/posts/lastPosts`);
      return data;
    },
    {
      enabled: !!open,
    }
  );

  const posts = useGetPosts(data);

  return (
    <HoverCard.Root open={open ? true : false} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
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
              {posts[0] && posts[0].data && (
                <Text size={'3'}>
                  Última postagem{' '}
                  {diffBetweenDates(new Date(), new Date(posts[0].data.createdAt))}
                </Text>
              )}

              <Flex gap={'4'}>
                <Text size={'3'}>
                  Seguindo{' '}
                  <Text weight={'bold'} size={'3'}>
                    {user.followingAmount ?? 0}
                  </Text>
                </Text>
                <Text size={'3'}>
                  Seguidores{' '}
                  <Text weight={'bold'} size={'3'}>
                    {user.followersAmount ?? 0}
                  </Text>
                </Text>
              </Flex>
            </Box>
          </Box>
          <Flex css={{ pt: '$2', gap: '2px', height: '152px' }}>
            {posts.length !== 0 ? (
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
                          borderBottomLeftRadius: '$2',
                        },

                        '&:nth-of-type(3)': {
                          borderBottomRightRadius: '$2',
                        },
                      }}
                    >
                      <Link href={`/post/${post.data.id}`}>
                        <Text size={'3'} css={{ lh: '1.5rem', fontWeight: 700 }}>
                          {post.data.title.slice(0, 17)}
                        </Text>
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
                          <Image src={post.data.thumbnailUrl} alt="" fill sizes="" />
                        </Box>
                      </Link>
                    </Box>
                  )
              )
            ) : (
              <Flex
                justify={'center'}
                align={'center'}
                css={{ height: '152px', width: '100%' }}
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
