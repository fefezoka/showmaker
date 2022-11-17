import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { useQuery } from 'react-query';
import { FeedPost } from '../components/feedPost/FeedPost';

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
      staleTime: Infinity,
    }
  );

  if (!user || isLoading) {
    return <Main />;
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
            <div style={{ borderRadius: '50%', overflow: 'hidden', height: '72px' }}>
              <Image src={user.image} height={72} width={72} alt="" />
            </div>
            <h2>{user.name}</h2>
          </div>
          {/* <span>
            Usuário desde {createdAt.getUTCDate()}/{createdAt.getUTCMonth() + 1}/
            {createdAt.getFullYear()}
          </span> */}
        </section>
        <section>
          <h3>Últimos posts</h3>
        </section>
        {user.posts.map((post) => (
          <FeedPost post={post} key={post.id} />
        ))}
      </Main>
    </>
  );
};

export default Profile;
