import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  osuAccountId: z.string().optional(),
  twitchAccountId: z.string().optional(),
});

export const postCommentsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  postId: z.string(),
  createdAt: z.string(),
  message: z.string(),
  user: userSchema,
});

export const likedPostSchema = z.object({
  id: z.string(),
  userId: z.string(),
  postId: z.string(),
  createdAt: z.string().nullable(),
});

export const postSchema = z.object({
  commentsAmount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  game: z.string(),
  id: z.string(),
  isLiked: z.boolean(),
  likes: z.number(),
  title: z.string(),
  userId: z.string(),
  thumbnailUrl: z.string(),
  postComments: z.array(postCommentsSchema).optional(),
  likedBy: z.array(likedPostSchema),
  videoUrl: z.string(),
  user: userSchema,
});

export const postPaginationSchema = z.object({
  pages: z.array(
    z.object({
      posts: z.array(postSchema),
      nextCursor: z.string().optional(),
    })
  ),
});

export type Post = z.infer<typeof postSchema>;
export type LikedPost = z.infer<typeof likedPostSchema>;
export type PostComment = z.infer<typeof postCommentsSchema>;
export type User = z.infer<typeof userSchema>;
export type PostPagination = z.infer<typeof postPaginationSchema>;
export type manyFriendshipStatus = Record<
  string,
  { id: string; following: boolean; followed_by: boolean }
>;
