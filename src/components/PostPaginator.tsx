import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box } from '../styles';
import { PostSkeleton } from '../styles/Skeleton';
import { FeedPost } from './FeedPost';

interface Props {
  hasNextPage: boolean | undefined;
  fetchNextPage: () => {};
  posts: Post[] | undefined;
  loading?: boolean;
}

export const PostPaginator = ({
  hasNextPage,
  fetchNextPage,
  posts,
  loading = true,
}: Props) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (loading) {
    return (
      <Box>
        <PostSkeleton />
        <PostSkeleton />
      </Box>
    );
  }

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
