import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Main } from '../../components/main/Main';
import axios from 'axios';
import { useQuery } from 'react-query';
import { FeedPost } from '../../components/feedPost/FeedPost';
import { useGetPosts } from '../../hooks/useGetPosts';

export default () => {
  const router = useRouter();
  const { title } = router.query;

  const { data: ids, isLoading } = useQuery<{ id: string }[]>(
    ['search', title],
    async () => {
      const { data } = await axios.get(`/api/post/search/${title}`);
      return data;
    },
    {
      enabled: !!title,
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  const posts = useGetPosts(ids);

  if (isLoading) {
    return <Main loading />;
  }

  if (!posts) {
    return (
      <Main>
        <section>
          <h2>Post não encontrado</h2>
        </section>
      </Main>
    );
  }

  return (
    <>
      <Head>
        <title>Procurando por {title}</title>
      </Head>
      <Main>
        <section>
          <h3>Procurando por {title}</h3>
        </section>
        {posts.map(
          (post) => post.data && <FeedPost post={post.data} key={post.data.id} />
        )}
      </Main>
    </>
  );
};
