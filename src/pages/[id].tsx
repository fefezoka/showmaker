import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { Main } from '../components/main/Main';
import { FeedPost } from '../components/feedPost/FeedPost';
import { useSession } from 'next-auth/react';
import { FeedPage } from '../components/feedPage/FeedPage';

const Profile = () => {
  const { data: session } = useSession();
  const [filteredData, setFilteredData] = useState<Post[]>();
  const [createdAt, setCreatedAt] = useState<Date>();

  useEffect(() => {
    if (!session) {
      return;
    }
    const { posts, ...user }: User = session.user;
    const data = posts.map((post) => {
      return {
        ...post,
        user: user,
      };
    });
    setFilteredData(data as Post[]);
    setCreatedAt(new Date(session.user.createdAt));
  }, [session]);

  if (!session || !createdAt) {
    return;
  }

  return (
    <>
      <Head>
        <title>Perfil do {session.user.name}</title>
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
              <Image src={session.user.image} height={72} width={72} alt="" />
            </div>
            <h2>{session.user.name}</h2>
          </div>
          <span>
            Usuário desde {createdAt.getUTCDate()}/{createdAt.getUTCMonth() + 1}/
            {createdAt.getFullYear()}
          </span>
        </section>
        <section>
          <h3>Últimos posts</h3>
        </section>
        {filteredData && <FeedPage posts={filteredData} />}
      </Main>
    </>
  );
};

export default Profile;
