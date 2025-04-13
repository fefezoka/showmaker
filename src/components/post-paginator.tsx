import { FeedPost } from '@/components/feed-post';
import { Box } from '@/styles/box';
import { PostSkeleton } from '@/styles/skeleton';
import { PostPagination } from '@/types/types';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

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
