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

  console.log(posts);

  if (!posts || isLoading) {
    return <Main />;
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
        {posts.map((post) => (
          <FeedPost post={post} key={post.id} />
        ))}
      </Main>
    </>
  );
}
