import React, { ReactNode, useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { Content, Header, ImageWrapper, Post } from './style';
import { useQuery } from 'react-query';
import { diffBetweenDates } from '../../utils/diffBetweenDates';
import { useGetPosts } from '../../hooks/useGetPosts';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

interface Props {
  user: User;
  children: ReactNode;
}

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
          <Header>
            <Link href={`/${user.name}`} style={{ cursor: 'pointer' }}>
              <div>
                <ProfileIcon src={user.image} size={96} alt="" />
                <h2 style={{ marginTop: '8px' }}>{user.name}</h2>
              </div>
            </Link>

            <div style={{ fontSize: '14px' }}>
              {posts[0] && posts[0].data && (
                <p>
                  Última postagem{' '}
                  {diffBetweenDates(new Date(), new Date(posts[0].data.createdAt))}
                </p>
              )}

              <div style={{ display: 'flex', gap: '16px' }}>
                <span>
                  Seguindo <b>{user.followingAmount}</b>
                </span>
                <span>
                  Seguidores <b>{user.followersAmount}</b>
                </span>
              </div>
            </div>
          </Header>
          <div style={{ display: 'flex', paddingTop: '8px', gap: '2px' }}>
            {posts ? (
              posts.map(
                (post) =>
                  post.data && (
                    <Post key={post.data.id}>
                      <Link href={`/post/${post.data.id}`}>
                        <b style={{ fontSize: '14px', lineHeight: '1.5rem' }}>
                          {post.data.title.slice(0, 17)}
                        </b>
                        <ImageWrapper>
                          <Image src={post.data.thumbnailUrl} alt="" fill sizes="" />
                        </ImageWrapper>
                      </Link>
                    </Post>
                  )
              )
            ) : (
              <div>Sem posts</div>
            )}
          </div>
        </Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
