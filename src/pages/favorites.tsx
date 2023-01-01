import React, { useEffect } from 'react';
import { useGetPosts } from '../hooks/useGetPosts';
import { Main } from '../components/main/Main';
import { FeedPost } from '../components/feedPost/FeedPost';
import { useInfinitePostIdByScroll } from '../hooks/useInfinitePostIdByScroll';
import { useInView } from 'react-intersection-observer';

export default function Favorites() {
  const { ref, inView } = useInView();

  const { ids, fetchNextPage, hasNextPage } = useInfinitePostIdByScroll({
    api: '/api/post/page/favorites',
    query: 'favorites',
  });

  const posts = useGetPosts(
    ids?.pages.reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!ids || !posts) {
    return <Main loading />;
  }

  return (
    <Main>
      <section>
        <h3>Postagens curtidas</h3>
      </section>
      {posts.map(
        (post, index) =>
          post.data && (
            <FeedPost post={post.data} ref={posts.length - 1 === index ? ref : null} />
          )
      )}
    </Main>
  );
}
