import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { UseQueryResult } from 'react-query';
import { FeedPost } from './FeedPost';

interface Props {
  hasNextPage: boolean | undefined;
  fetchNextPage: () => {};
  posts: UseQueryResult<Post, unknown>[];
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
      ;
    </>
  );
};
