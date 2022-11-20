import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import { Main } from '../../components/main/Main';
import axios from 'axios';
import { useQuery } from 'react-query';
import { FeedPost } from '../../components/feedPost/FeedPost';

const Profile = () => {
  const router = useRouter();
  const { title } = router.query;

  const { data: posts, isLoading } = useQuery<Post[]>(
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
        {posts.map((post) => (
          <FeedPost post={post} key={post.id} />
        ))}
      </Main>
    </>
  );
};

export default Profile;
