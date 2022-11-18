import Head from 'next/head';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { useQuery } from 'react-query';
import { FeedPost } from '../components/feedPost/FeedPost';

export default function Home() {
  const { data: posts, isLoading } = useQuery<Post[]>(
    'posts',
    async () => {
      const { data } = await axios.get(`/api/post/get`);
      return data;
    },
    {
      staleTime: Infinity,
    }
  );

  if (!posts || isLoading) {
    return <Main routes="home" />;
  }

  return (
    <>
      <Head>
        <title>Show Maker</title>
      </Head>

      <Main routes="home">
        <section>
          <h3>Últimos posts</h3>
        </section>
        {posts.map((post) => (
          <FeedPost post={post} key={post.id} />
        ))}
      </Main>
    </>
  );
}
