import Head from 'next/head';
import { Main } from '../components/main/Main';
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import { FeedPost } from '../components/feedPost/FeedPost';
import { useInView } from 'react-intersection-observer';
import { useGetPost } from '../hooks/useGetPost';
import { useEffect } from 'react';

export default function Home() {
  const { ref, inView } = useInView();

  const {
    data: ids,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['ids'],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get(`/api/post/page/${pageParam}`);
      return data;
    },
    {
      getNextPageParam: (currentPage, pages) => {
        return currentPage.length == 6 && pages.length + 1;
      },
      refetchOnWindowFocus: false,
    }
  );

  const posts = useGetPost(
    ids?.pages.reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (!ids || !posts || posts.slice(0, 6).some((post) => post.isLoading === true)) {
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
          (post, index) =>
            post.data && (
              <FeedPost
                ref={posts.length - 1 === index ? ref : null}
                post={post.data}
                key={post.data.id}
              />
            )
        )}
      </Main>
    </>
  );
}
