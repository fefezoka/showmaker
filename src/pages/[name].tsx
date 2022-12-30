import React, { useEffect } from 'react';
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

const Profile = () => {
  const router = useRouter();
  const { name } = router.query;
  const { inView, ref } = useInView();

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

  const { ids, fetchNextPage, hasNextPage } = useInfinitePostIdByScroll({
    api: `api/user/byid/${user?.id}/posts/page`,
    query: ['user', name as string],
    enabled: !!user,
  });

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
              gap: '16px',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <FullProfileIcon src={user.image} size={96} />
            <h2>{user.name}</h2>
          </div>
          <span>
            Usuário desde {new Date(user.createdAt).getUTCDate()}/
            {new Date(user.createdAt).getUTCMonth() + 1}/
            {new Date(user.createdAt).getFullYear()}
          </span>
        </section>
        <section>
          <h3>Últimos posts</h3>
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
};

export default Profile;
