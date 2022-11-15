import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { FeedPage } from '../components/feedPage/FeedPage';

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
        <section>
          <h3>Últimos posts</h3>
        </section>
        <FeedPage posts={posts} />
      </Main>
    </>
  );
}
