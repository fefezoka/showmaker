import Head from 'next/head';
import React, { useEffect } from 'react';
import { FeedPost } from '../components/feedPost/FeedPost';
import { Main } from '../components/main/Main';
import { useGetPosts } from '../hooks/useGetPosts';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';
import { useInView } from 'react-intersection-observer';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export default function Following() {
  const { inView, ref } = useInView();

  const { ids, fetchNextPage, hasNextPage } = useInfinitePostIdByScroll({
    api: 'api/post/page/following',
    query: 'following',
  });

  const posts = useGetPosts(
    ids?.pages.reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  );

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (!ids || !posts || posts.slice(0, 6).some((post) => post.status === 'loading')) {
    return <Main loading />;
  }

  return (
    <>
      <Head>
        <title>Posts recomendados</title>
      </Head>
      <Main>
        <section>
          <h3>Posts recomendados</h3>
        </section>
        {posts.map(
          (post, index) =>
            post.data && (
              <FeedPost post={post.data} ref={posts.length - 1 === index ? ref : null} />
            )
        )}
      </Main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx: ctx });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
