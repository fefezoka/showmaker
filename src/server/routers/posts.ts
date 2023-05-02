import { Post, postSchema } from '@types';
import { authenticatedProcedure, procedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { infiniteQuery } from '../commons';

export const posts = router({
  feed: router({
    home: procedure
      .input(
        z.object({
          game: z.string().optional(),
          cursor: z.string().optional(),
          limit: z.number().optional().default(6),
        })
      )
      .query(async ({ input, ctx }) =>
        infiniteQuery(
          await ctx.prisma.post.findMany({
            take: input.limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              ...(input.game && { game: input.game }),
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  createdAt: true,
                },
              },
              likedBy: true,
            },
          }),
          {
            limit: input.limit,
            session: ctx.session,
            cursor: input.cursor,
          }
        )
      ),
    user: procedure
      .input(
        z.object({
          username: z.string(),
          feed: z.enum(['favorites', 'posts']).optional(),
          limit: z.number().optional().default(6),
          cursor: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) =>
        infiniteQuery(
          await ctx.prisma.post.findMany({
            take: input.limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              ...(input.feed !== 'favorites' && { user: { name: input.username } }),
              ...(input.feed === 'favorites' && {
                likedBy: {
                  some: {
                    user: {
                      name: input.username,
                    },
                  },
                },
              }),
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  createdAt: true,
                },
              },
              likedBy: true,
            },
          }),
          { limit: input.limit, session: ctx.session, cursor: input.cursor }
        )
      ),
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
                game: 1,
                user: 1,
                likedBy: 1,
                score: { $meta: 'searchScore' },
              },
            },
          ],
        })) as any;

        if (response.length === 0 || !response) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Posts not found',
          });
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
            createdAt: new Date(r.createdAt['$date']),
            user: {
              name: r.user[0].name,
              image: r.user[0].image,
              id: r.user[0]._id,
              createdAt: new Date(r.user[0].createdAt['$date']),
            },
            isLiked: r.likedBy.some((like: any) => like.userId === ctx.session?.user.id),
          }));

        return {
          posts: filter as Post[],
        };
      }),
  }),
  create: authenticatedProcedure
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
              id: ctx.session.user.id,
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
  edit: authenticatedProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
        title: z.string().optional(),
        game: z.string().optional(),
      })
    )
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.post.update({
          data: {
            ...(input.title && { title: input.title }),
            ...(input.game && { game: input.game }),
          },
          where: { id: input.postId },
        })
    ),
  delete: authenticatedProcedure.input(z.object({ postId: z.string().uuid() })).mutation(
    async ({ ctx, input }) =>
      await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      })
  ),
  byId: procedure
    .input(z.object({ postId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          user: {
            select: {
              id: true,
              createdAt: true,
              name: true,
              image: true,
            },
          },
          likedBy: true,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      const { updatedAt, ...rest } = post;

      return {
        ...rest,
        user: {
          ...post.user,
        },
        isLiked: post.likedBy.some((like) => like.userId === ctx.session?.user.id),
      };
    }),
  comments: procedure.input(z.object({ postId: z.string().uuid() })).query(
    async ({ ctx, input }) =>
      await ctx.prisma.postComment.findMany({
        where: {
          postId: input.postId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
        },
      })
  ),
  like: authenticatedProcedure
    .input(
      z.object({
        post: postSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
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
  dislike: authenticatedProcedure
    .input(z.object({ post: postSchema }))
    .mutation(async ({ ctx, input }) => {
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

  createComment: authenticatedProcedure
    .input(
      z.object({
        message: z.string(),
        postId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
  editComment: authenticatedProcedure
    .input(
      z.object({ message: z.string(), commentId: z.string().uuid(), postId: z.string() })
    )
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.postComment.update({
          data: { message: input.message },
          where: { id: input.commentId },
        })
    ),
  deleteComment: authenticatedProcedure
    .input(
      z.object({
        commentId: z.string(),
        postId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.postComment.delete({
        where: {
          id: input.commentId,
        },
      });

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
