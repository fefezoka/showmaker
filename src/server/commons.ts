import { LikedPost, Post } from '@types';
import { Session } from 'next-auth';

export const infiniteQuery = (
  posts: (Omit<Post, 'isLiked'> & {
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
      const { updatedAt, ...rest } = post;

      return {
        ...rest,
        isLiked: post.likedBy.some((like) => like.userId === session?.user.id),
      };
    }),
    nextCursor,
  };
};
