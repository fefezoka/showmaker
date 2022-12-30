import React, { ReactNode, useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import Link from 'next/link';
import { Content, Header, ImageWrapper, Post } from './style';
import { useQuery } from 'react-query';
import axios from 'axios';
import { diffBetweenDates } from '../../utils/diffBetweenDates';
import Image from 'next/image';
import { useGetPosts } from '../../hooks/useGetPosts';

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

            {posts[0] && posts[0].data && (
              <p style={{ fontSize: '14px' }}>
                Última postagem{' '}
                {diffBetweenDates(new Date(), new Date(posts[0].data.createdAt))}
              </p>
            )}
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
