import Head from 'next/head';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { useQuery } from 'react-query';
import { FeedPost } from '../components/feedPost/FeedPost';
import { useGetPost } from '../hooks/useGetPost';

export default function Home() {
  const { data: ids } = useQuery<{ id: string }[]>(
    'ids',
    async () => {
      const { data } = await axios.get(`/api/post/get`);
      return data;
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    }
  );

  const posts = useGetPost(ids);

  if (!ids || !posts) {
    return <Main loading />;
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
        {posts.map(
          (post) => post.data && <FeedPost post={post.data} key={post.data.id} />
        )}
      </Main>
    </>
  );
}
