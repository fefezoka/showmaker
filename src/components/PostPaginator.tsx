import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PostPagination } from '@types';
import { FeedPost } from '@components';
import { Box, PostSkeleton } from '@styles';

interface IPostPaginator {
  hasNextPage: boolean | undefined;
  fetchNextPage: () => {};
  posts: PostPagination | undefined;
  loading?: boolean;
}

export const PostPaginator = ({
  hasNextPage,
  fetchNextPage,
  posts,
  loading = true,
}: IPostPaginator) => {
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
        posts.pages.map((page) =>
          page.posts.map((post, index) => (
            <FeedPost
              ref={page.posts.length - 1 === index ? ref : undefined}
              post={post}
              key={post.id}
            />
          ))
        )}
    </>
  );
};
