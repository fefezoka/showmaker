import { Post, postSchema } from '../../common/types';
import { procedure, router } from '../trpc';
import { z } from 'zod';

export const posts = router({
  infinitePosts: router({
    feed: procedure
      .input(
        z.object({
          game: z.string().optional(),
          cursor: z.string().optional(),
        })
      )
      .query(async ({ input, ctx }) => {
        const posts = await ctx.prisma.post.findMany({
          take: 7,
          ...(input.game && { where: { game: input.game } }),
          cursor: input.cursor ? { id: input.cursor } : undefined,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                followersAmount: true,
                followingAmount: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            likedBy: true,
          },
        });

        let nextCursor: typeof input.cursor | undefined = undefined;
        if (posts.length > 6) {
          const nextItem = posts.pop();
          nextCursor = nextItem!.id;
        }

        return {
          posts: posts.map((post) => {
            return {
              ...post,
              isLiked: post.likedBy.some((like) => like.userId === ctx.session?.user.id),
            };
          }),
          nextCursor,
        };
      }),
    search: procedure
      .input(z.object({ q: z.string(), cursor: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const response = (await ctx.prisma.post.aggregateRaw({
          pipeline: [
            {
              $search: {
                index: 'title',
                text: {
                  query: input.q,
                  path: 'title',
                  fuzzy: {},
                },
              },
            },
            {
              $lookup: {
                from: 'User',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $lookup: {
                from: 'LikedPost',
                localField: '_id',
                foreignField: 'postId',
                as: 'likedBy',
              },
            },
            {
              $skip: input.cursor ? (input.cursor === 1 ? 0 : (input.cursor - 1) * 6) : 0,
            },
            { $limit: 6 },
            {
              $project: {
                title: 1,
                videoUrl: 1,
                thumbnailUrl: 1,
                likes: 1,
                commentsAmount: 1,
                userId: 1,
                createdAt: 1,
                updatedAt: 1,
                game: 1,
                user: 1,
                likedBy: 1,
                score: { $meta: 'searchScore' },
              },
            },
          ],
        })) as any;

        if (response.length === 0 || !response) {
          return;
        }

        const filter = response
          .filter((r: any) => r.score > 0.8)
          .map((r: any) => ({
            id: r._id,
            title: r.title,
            likes: r.likes,
            thumbnailUrl: r.thumbnailUrl,
            videoUrl: r.videoUrl,
            commentsAmount: r.commentsAmount,
            game: r.game,
            createdAt: r.createdAt['$date'],
            updatedAt: r.updatedAt['$date'],
            user: {
              name: r.user[0].name,
              image: r.user[0].image,
              followersAmount: r.user[0].followersAmount,
              followingAmount: r.user[0].followingAmount,
              id: r.user[0]._id,
              createdAt: r.user[0].createdAt['$date'],
              updatedAt: r.user[0].updatedAt['$date'],
            },
            isLiked:
              r.likedBy.some((like: any) => like.userId === ctx.session?.user.id) ??
              false,
          }));

        return {
          posts: filter as Post[],
        };
      }),
    user: router({
      profile: procedure
        .input(
          z.object({
            name: z.string(),
            cursor: z.string().optional(),
            feed: z.enum(['posts', 'favorites']),
          })
        )
        .query(async ({ ctx, input }) => {
          const posts = await ctx.prisma.post.findMany({
            take: 7,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  createdAt: true,
                  updatedAt: true,
                  followersAmount: true,
                  followingAmount: true,
                },
              },
              likedBy: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              ...(input.feed === 'posts' && { user: { name: input.name } }),
              ...(input.feed === 'favorites' && {
                likedBy: {
                  some: {
                    user: {
                      name: input.name,
                    },
                  },
                },
              }),
            },
          });
          let nextCursor: typeof input.cursor | undefined = undefined;
          if (posts.length > 6) {
            const nextItem = posts.pop();
            nextCursor = nextItem!.id;
          }

          console.log(posts);

          return {
            posts: posts.map((post) => {
              return {
                ...post,
                isLiked: post.likedBy.some(
                  (like) => like.userId === ctx.session?.user.id
                ),
              };
            }),
            nextCursor,
          };
        }),
    }),
  }),
  create: procedure
    .input(
      z.object({
        title: z.string(),
        game: z.string(),
        thumbnailUrl: z.string(),
        videoUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.post.create({
        data: {
          title: input.title,
          videoUrl: input.videoUrl,
          thumbnailUrl: input.thumbnailUrl,
          game: input.game,
          user: {
            connect: {
              id: ctx.session?.user.id,
            },
          },
        },
        include: {
          likedBy: true,
          user: true,
        },
      });

      return {
        ...response,
        isLiked: false,
      };
    }),
  delete: procedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
      return response;
    }),
  byId: procedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          user: true,
          likedBy: true,
        },
      });

      if (!post) {
        return;
      }

      const { emailVerified, email, ...user } = post.user;

      return {
        ...post,
        user: {
          ...user,
        },
        isLiked: post.likedBy.some((like) => like.userId === ctx.session?.user.id),
      };
    }),

  comments: procedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.postComment.findMany({
        where: {
          postId: input.postId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
        },
      });
      return response;
    }),
  like: procedure
    .input(
      z.object({
        post: postSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        return;
      }

      const response = await ctx.prisma.likedPost.create({
        data: {
          postId: input.post.id,
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.post.update({
        where: {
          id: input.post.id,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
      return response;
    }),
  dislike: procedure
    .input(z.object({ post: postSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        return;
      }

      const response = await ctx.prisma.likedPost.deleteMany({
        where: {
          postId: input.post.id,
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.post.update({
        where: {
          id: input.post.id,
        },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
      return response;
    }),

  createComment: procedure
    .input(
      z.object({
        message: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        return;
      }

      const response = await ctx.prisma.postComment.create({
        data: {
          message: input.message,
          postId: input.postId,
          userId: ctx.session.user.id,
        },
        include: {
          user: true,
        },
      });

      await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          commentsAmount: {
            increment: 1,
          },
        },
      });
      return response;
    }),
  deleteComment: procedure
    .input(
      z.object({
        commentId: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.postComment.delete({
        where: {
          id: input.commentId,
        },
      });

      if (!response) {
        return;
      }

      await ctx.prisma.post.update({
        data: {
          commentsAmount: {
            decrement: 1,
          },
        },
        where: {
          id: input.postId,
        },
      });

      return {
        message: 'ok',
      };
    }),
});
