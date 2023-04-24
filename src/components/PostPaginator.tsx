import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box } from '../styles';
import { PostSkeleton } from '../styles/Skeleton';
import { FeedPost } from './FeedPost';
import { InfiniteData } from '@tanstack/react-query';
import { Post } from '../@types/types';

interface IPostPaginator {
  hasNextPage: boolean | undefined;
  fetchNextPage: () => {};
  posts: InfiniteData<{ posts: Post[]; nextCursor?: string | undefined }> | undefined;
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
              ref={page.posts.length - 1 === index ? ref : null}
              post={post}
              key={post.id}
            />
          ))
        )}
    </>
  );
};
