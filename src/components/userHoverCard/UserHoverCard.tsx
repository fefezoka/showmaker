import React, { ReactNode, useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import Link from 'next/link';
import { Content, Header, ImageWrapper, Post } from './style';
import { useQuery } from 'react-query';
import axios from 'axios';
import { diffBetweenDates } from '../../utils/diffBetweenDates';
import Image from 'next/image';

interface Props {
  user: User;
  children: ReactNode;
}

export const UserHoverCard = ({ user, children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data } = useQuery<
    { id: string; thumbnailUrl: string; title: string; createdAt: Date }[]
  >(
    ['lastPosts', user.id],
    async () => {
      const { data } = await axios.get(`/api/user/${user.id}/lastPosts`);
      return data;
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: !!open,
    }
  );

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

            {data && (
              <p style={{ fontSize: '14px' }}>
                Última postagem{' '}
                {diffBetweenDates(new Date(), new Date(data[0].createdAt))}
              </p>
            )}
          </Header>
          <div style={{ display: 'flex', paddingTop: '8px', gap: '2px' }}>
            {data ? (
              data.map((post) => (
                <Post key={post.id}>
                  <Link href={`/post/${post.id}`}>
                    <b style={{ fontSize: '14px', lineHeight: '1.5rem' }}>
                      {post.title.slice(0, 17)}
                    </b>
                    <ImageWrapper>
                      <Image src={post.thumbnailUrl} alt="" fill sizes="" />
                    </ImageWrapper>
                  </Link>
                </Post>
              ))
            ) : (
              <div>Sem posts</div>
            )}
          </div>
        </Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
