import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Main } from '../components/main/Main';
import { GetServerSideProps } from 'next/types';
import { getSession } from 'next-auth/react';
import { prisma } from '../lib/prisma';
import axios from 'axios';
import dynamic from 'next/dynamic';
const FeedPost = dynamic(() => import('../components/feedPost/FeedPost'), { ssr: false });

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session?.user?.email && session?.user.name && session?.user.image) {
    await prisma.user.upsert({
      create: {
        email: session.user.email,
        name: session.user.name,
        avatar_url: session.user.image,
      },
      update: {},
      where: { email: session.user.email },
    });
  }

  return {
    props: {
      session,
    },
  };
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    axios
      .get('/api/post/get')
      .then((response) => setPosts(response.data))
      .catch((e) => console.log(e));
  }, []);

  if (!posts) {
    return;
  }

  return (
    <>
      <Head>
        <title>Show Maker</title>
      </Head>

      <Main>
        <div>
          <h3>Últimos posts</h3>
        </div>
        {posts.map((post) => (
          <FeedPost post={post} key={post.id} />
        ))}
      </Main>
    </>
  );
}
