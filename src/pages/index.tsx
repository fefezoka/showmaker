import Head from 'next/head';
import { useState } from 'react';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { FeedPage } from '../components/feedPage/FeedPage';
import { useQuery } from 'react-query';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>();

  const { isLoading } = useQuery(
    'posts',
    async () => {
      return await axios.get(`/api/post/get`);
    },
    {
      onSuccess: (data) => setPosts(data.data),
    }
  );

  if (!posts || isLoading) {
    return;
  }

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
