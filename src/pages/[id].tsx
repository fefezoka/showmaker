import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { useQuery } from 'react-query';
import { FeedPost } from '../components/feedPost/FeedPost';
import { ProfileIcon } from '../components/profileIcon/ProfileIcon';
import { useGetPost } from '../hooks/useGetPost';

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: user, isLoading } = useQuery<User>(
    ['user', id],
    async () => {
      const { data } = await axios.get(`/api/user/${id}`);
      return data;
    },
    {
      enabled: !!id,
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  const posts = useGetPost(user?.posts);

  if (isLoading) {
    return <Main loading />;
  }

  if (!user) {
    return (
      <Main>
        <section>
          <h2>Usuário {id} não encontrado</h2>
        </section>
      </Main>
    );
  }

  return (
    <>
      <Head>
        <title>Perfil do {user.name}</title>
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
            <ProfileIcon src={user.image} size={92} />
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
        {posts.map(
          (post) => post.data && <FeedPost post={post.data} key={post.data.id} />
        )}
      </Main>
    </>
  );
};

export default Profile;
