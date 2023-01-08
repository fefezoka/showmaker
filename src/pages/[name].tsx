import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Main } from '../components/main/Main';
import { useQuery } from 'react-query';
import { FeedPost } from '../components/feed-post/FeedPost';
import { useGetPosts } from '../hooks/useGetPosts';
import { FullProfileIcon } from '../components/full-profile-icon/FullProfileIcon';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';
import { Button } from '../components/button/Button';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import {
  FeedButton,
  FeedButtonWrapper,
  FollowSpan,
  ProfileContainer,
} from '../page-styles/profile';
import OsuHoverCard from '../components/osu-hover-card/OsuHoverCard';

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
      api: `/api/user/byid/${user?.id}/posts/page`,
      query: ['userposts', name as string],
      enabled: !!user,
    },
    {
      api: `/api/user/byid/${user?.id}/posts/page/favorites`,
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

  // const data = useQuery(
  //   ['osu'],
  //   async () => {
  //     const { data } = await axios.get('https://osu.ppy.sh/oauth/token');
  //     return data;
  //   },
  //   { retry: false, refetchOnWindowFocus: false }
  // );

  if (isLoading) {
    return <Main loading />;
  }

  if (!user) {
    return (
      <>
        <Head>
          <title>Perfil não encontrado</title>
        </Head>
        <Main>
          <section>
            <h2>Usuário {name} não encontrado</h2>
          </section>
        </Main>
      </>
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
        <section style={{ paddingBottom: 0 }}>
          <ProfileContainer>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              <FullProfileIcon src={user.image} size={128} />
              <div>
                <h2>{user.name}</h2>
                {(user.followYou && user.isFollowing && (
                  <FollowSpan>Segue um ao outro</FollowSpan>
                )) ||
                  (user.followYou && <FollowSpan>Segue você</FollowSpan>)}
              </div>
            </div>

            {!(session?.user.id === user.id) && (
              <Button
                value={
                  user.isFollowing
                    ? 'Parar de seguir'
                    : user.followYou
                    ? 'Seguir de volta'
                    : 'Seguir'
                }
                onClick={handleFollowClick}
              />
            )}
          </ProfileContainer>

          <div style={{ fontSize: '15px' }}>
            <div>
              Usuário desde{' '}
              <span style={{ fontWeight: 'bold' }}>
                {new Date(user.createdAt).getDate()}/
                {new Date(user.createdAt).getMonth() + 1}/
                {new Date(user.createdAt).getFullYear()}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>
                Seguindo <b>{user.followingAmount}</b>
              </span>
              <span>
                Seguidores <b>{user.followersAmount}</b>
              </span>
            </div>
            <div>
              <button onClick={() => signIn('osu')}>logar</button>
              <button onClick={() => signOut()}>deslogar</button>
              <OsuHoverCard userId={user.id} />
            </div>
          </div>

          <FeedButtonWrapper>
            <FeedButton onClick={() => setFeed('posts')} active={feed === 'posts'}>
              Últimos posts
            </FeedButton>
            <FeedButton
              onClick={() => setFeed('favorites')}
              active={feed === 'favorites'}
            >
              Posts curtidos
            </FeedButton>
          </FeedButtonWrapper>
        </section>

        {posts.slice(0, 6).some((post) => post.status === 'loading') ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Image src={Spinner} alt="" width={54} height={54} />
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
