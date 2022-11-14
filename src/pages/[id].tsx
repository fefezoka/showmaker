import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Main } from '../components/main/Main';
import { FeedPost } from '../components/feedPost/FeedPost';

interface Props {
  user: User;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const { data: user } = await axios.get(`${process.env.SITE_URL}/api/user/${id}`);

  return {
    props: {
      user,
    },
  };
};

const Profile = ({ user }: Props) => {
  const createdAt = new Date(user.createdAt);
  console.log(user);
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
              <Image src={user.avatar_url} height={72} width={72} alt="" />
            </div>
            <h2>{user.name}</h2>
          </div>
          <span>
            Usuário desde {createdAt.getUTCDate()}/{createdAt.getUTCMonth() + 1}/
            {createdAt.getFullYear()}
          </span>
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
