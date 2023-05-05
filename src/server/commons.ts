import { LikedPost, Post } from '@types';
import { Session } from 'next-auth';

export const infiniteQuery = (
  posts: (Omit<Post, 'isLiked' | 'likes'> & {
    user: { id: string; name: string; image: string; createdAt: Date };
    likedBy: LikedPost[];
  })[],
  { limit, cursor, session }: { limit: number; cursor?: string; session: Session | null }
) => {
  let nextCursor: typeof cursor | undefined = undefined;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem!.id;
  }

  return {
    posts: posts.map((post) => {
      return {
        ...post,
        likes: post.likedBy.length,
        isLiked: post.likedBy.some((like) => like.userId === session?.user.id),
      };
    }),
    nextCursor,
  };
};
