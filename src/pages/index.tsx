import Head from 'next/head';
import { useState } from 'react';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { FeedPage } from '../components/feedPage/FeedPage';
import { useQuery } from 'react-query';
import { GetServerSideProps } from 'next';

interface Props {
  posts: Post[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: posts } = await axios.get(`${process.env.SITE_URL}/api/post/get`);

  return {
    props: {
      posts,
    },
  };
};

export default function Home({ posts }: Props) {
  // const [posts, setPosts] = useState<Post[]>();

  // const { isLoading } = useQuery(
  //   ['posts'],
  //   async () => {
  //     return await axios.get(`/api/post/get`);
  //   },
  //   {
  //     onSuccess: (data) => setPosts(data.data),
  //   }
  // );

  // if (!posts || isLoading) {
  //   return;
  // }

  return (
    <>
      <Head>
        <title>Show Maker</title>
      </Head>

      <Main>
        <section>
          <h3>Últimos posts</h3>
        </section>
        <FeedPage posts={posts} />
      </Main>
    </>
  );
}
