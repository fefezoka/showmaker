import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { useQuery } from 'react-query';
import { FeedPost } from '../components/feedPost/FeedPost';
import { useGetPosts } from '../hooks/useGetPosts';
import { FullProfileIcon } from '../components/fullProfileIcon/FullProfileIcon';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';
import { Button } from '../components/button/Button';
import { signIn, useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';

type Feed = 'posts' | 'favorites';

export default function Profile() {
  const [feed, setFeed] = useState<Feed>('posts');
  const { data: session } = useSession();
  const router = useRouter();
  const { name } = router.query;
  const { inView, ref } = useInView();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>(
    ['user', name],
    async () => {
      const { data } = await axios.get(`/api/user/byname/${name}`);
      return data;
    },
    {
      enabled: !!name,
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  const feedOptions = [
    {
      api: `api/user/byid/${user?.id}/posts/page`,
      query: ['userposts', name as string],
      enabled: !!user,
    },
    {
      api: `api/user/byid/${user?.id}/posts/page/favorites`,
      query: ['favorites', name as string],
      enabled: !!user,
    },
  ];

  const { ids, fetchNextPage, hasNextPage } = useInfinitePostIdByScroll(
    feedOptions[feed === 'posts' ? 0 : 1]
  );

  const posts = useGetPosts(
    ids?.pages.reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <Main loading />;
  }

  if (!user) {
    return (
      <Main>
        <section>
          <h2>Usuário {name} não encontrado</h2>
        </section>
      </Main>
    );
  }

  const handleFollowClick = async () => {
    if (!session) {
      return signIn('discord');
    }

    await axios.post(`/api/user/${user.isFollowing ? 'unfollow' : 'follow'}`, {
      followerId: session.user.id,
      followingId: user.id,
    });

    queryClient.setQueryData<User>(['user', name], (old) =>
      old
        ? {
            ...old,
            followersAmount: old.isFollowing
              ? old.followersAmount - 1
              : old.followersAmount + 1,
            isFollowing: !old.isFollowing,
          }
        : { ...user, isFollowing: !user.isFollowing }
    );

    queryClient.setQueryData<User>(['user', session.user.name], (old) =>
      old
        ? {
            ...old,
            followingAmount: user.isFollowing
              ? old.followingAmount - 1
              : old.followingAmount + 1,
          }
        : session.user
    );
  };

  return (
    <>
      <Head>
        <title>Perfil de {user.name}</title>
      </Head>
      <Main>
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              <FullProfileIcon src={user.image} size={128} />
              <h2>{user.name}</h2>
            </div>

            {!(session?.user.id === user.id) && (
              <Button
                value={user.isFollowing ? 'Parar de seguir' : 'Seguir'}
                onClick={handleFollowClick}
              />
            )}
          </div>

          <div>
            Usuário desde{' '}
            <span style={{ fontWeight: 'bold' }}>
              {new Date(user.createdAt).getDate()}/
              {new Date(user.createdAt).getMonth() + 1}/
              {new Date(user.createdAt).getFullYear()}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>
              Seguindo <b>{user.followingAmount}</b>
            </span>
            <span>
              Seguidores <b>{user.followersAmount}</b>
            </span>
          </div>
        </section>
        <section style={{ display: 'flex', gap: '16px' }}>
          <Button
            onClick={() => setFeed('posts')}
            value={'Últimos posts'}
            variant={'profile'}
            active={feed === 'posts'}
          />
          <Button
            onClick={() => setFeed('favorites')}
            value={'Posts curtidos'}
            variant={'profile'}
            active={feed === 'favorites'}
          />
        </section>
        {posts.slice(0, 6).some((post) => post.status === 'loading') ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={Spinner} alt="" width={72} height={72} />
          </div>
        ) : (
          posts.map(
            (post, index) =>
              post.data && (
                <FeedPost
                  post={post.data}
                  key={post.data.id}
                  ref={posts.length - 1 === index ? ref : null}
                />
              )
          )
        )}
      </Main>
    </>
  );
}
