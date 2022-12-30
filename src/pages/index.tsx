import Head from 'next/head';
import { Main } from '../components/main/Main';
import { FeedPost } from '../components/feedPost/FeedPost';
import { useInView } from 'react-intersection-observer';
import { useGetPosts } from '../hooks/useGetPosts';
import { useEffect } from 'react';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';

export default function Home() {
  const { ref, inView } = useInView();

  const { ids, fetchNextPage, hasNextPage } = useInfinitePostIdByScroll({
    api: '/api/post/page',
    query: ['homepageids'],
  });

  const posts = useGetPosts(
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
