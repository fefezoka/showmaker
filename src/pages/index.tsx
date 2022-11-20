import Head from 'next/head';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { FeedPost } from '../components/feedPost/FeedPost';

export default function Home() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<Post[]>(
    'posts',
    async () => {
      const { data } = await axios.get(`/api/post/get`);
      return data;
    },
    {
      onSuccess: (data) => {
        if (data) {
          data.forEach((post) => queryClient.setQueryData(['post', post.id], post));
        }
      },
      staleTime: Infinity,
    }
  );

  if (!posts || isLoading) {
    return <Main routes="home" loading />;
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
