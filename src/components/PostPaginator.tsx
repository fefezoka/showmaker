import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FeedPost } from './FeedPost';

interface Props {
  hasNextPage: boolean | undefined;
  fetchNextPage: () => {};
  posts: Post[] | undefined;
}

export const PostPaginator = ({ hasNextPage, fetchNextPage, posts }: Props) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      {posts &&
        posts.map((post, index) => (
          <FeedPost
            ref={posts.length - 1 === index ? ref : null}
            post={post}
            key={post.id}
          />
        ))}
    </>
  );
};
