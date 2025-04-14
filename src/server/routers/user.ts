import { z } from 'zod';
import axios from '@/server/axios';
import { TRPCError } from '@trpc/server';
import { ManyFriendshipStatus, User } from '@/types/types';
import { OsuProfile } from 'next-auth/providers/osu';
import { authenticatedProcedure, procedure, router } from '@/server/trpc';
import { auth } from '@/server/routers/auth';

export const user = router({
  profile: procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          name: input.name,
        },
        omit: {
          email: true,
          emailVerified: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const osuAccount = await ctx.prisma.account.findMany({
        select: {
          providerAccountId: true,
        },
        where: {
          provider: 'osu',
          AND: {
            userId: user.id,
          },
        },
      });

      const twitchAccount = await ctx.prisma.account.findMany({
        where: {
          provider: 'twitch',
          AND: {
            userId: user.id,
          },
        },
      });

      return {
        ...user,
        ...(osuAccount[0] && { osuAccountId: osuAccount[0].providerAccountId }),
        ...(twitchAccount[0] && {
          twitchAccountId: twitchAccount[0].providerAccountId,
        }),
      };
    }),
  search: procedure
    .input(z.object({ q: z.string(), limit: z.number().optional().default(6) }))
    .query(async ({ ctx, input }) => {
      const response = (await ctx.prisma.user.aggregateRaw({
        pipeline: [
          {
            $search: {
              index: 'name',
              text: {
                query: input.q,
                path: 'name',
                fuzzy: {},
              },
            },
          },
          { $limit: input.limit },
          {
            $project: {
              _id: true,
              name: true,
              image: true,
              createdAt: true,
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

      const filter = response.map((r: any) => ({
        id: r._id,
        name: r.name,
        image: r.image,
        createdAt: new Date(r.createdAt['$date']),
      }));

      return filter as User[];
    }),

  osu: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.account.findMany({
        where: {
          user: {
            name: input.username,
          },
          provider: 'osu',
        },
      });

      if (!response) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Osu profile not found',
        });
      }

      if (
        response[0].expires_at &&
        Math.floor(Date.now() / 1000) > response[0].expires_at
      ) {
        const caller = auth.createCaller(ctx);
        const refresh = await caller.refreshToken({
          client_id: process.env.OSU_ID!,
          client_secret: process.env.OSU_SECRET!,
          refresh_token: response[0].refresh_token!,
          provider: 'osu',
          username: input.username,
        });

        response[0].access_token = refresh.access_token;
      }

      const { data } = await axios.get<
        OsuProfile & { statistics: { global_rank: string; country_rank: string } }
      >('https://osu.ppy.sh/api/v2/me', {
        headers: {
          Authorization: `Bearer ${response[0].access_token}`,
        },
      });

      return data;
    }),
  follow: authenticatedProcedure
    .input(
      z.object({ followingUser: z.object({ id: z.string().uuid(), name: z.string() }) })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.followingUser.id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      await ctx.prisma.follows.createMany({
        data: {
          followingId: input.followingUser.id,
          followerId: ctx.session.user.id,
        },
      });
    }),
  unfollow: authenticatedProcedure
    .input(
      z.object({ followingUser: z.object({ id: z.string().uuid(), name: z.string() }) })
    )
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.follows.deleteMany({
          where: {
            followingId: input.followingUser.id,
            followerId: ctx.session.user.id,
          },
        })
    ),
  following: procedure.input(z.object({ userId: z.string().uuid() })).query(
    async ({ ctx, input }) =>
      await ctx.prisma.user.findMany({
        where: {
          followers: {
            some: {
              followerId: input.userId,
            },
          },
        },
      })
  ),
  followers: procedure.input(z.object({ userId: z.string().uuid() })).query(
    async ({ ctx, input }) =>
      await ctx.prisma.user.findMany({
        where: {
          following: {
            some: {
              followingId: input.userId,
            },
          },
        },
      })
  ),
  friendshipStatus: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          name: input.username,
        },
        select: {
          followers: true,
          following: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (!ctx.session) {
        return {
          followedBy: false,
          following: false,
        };
      }

      const sessionUserId = ctx.session.user.id;

      return {
        following: user.followers.some(
          (follower) => follower.followerId === sessionUserId
        ),
        followedBy: user.following.some(
          (following) => following.followingId === sessionUserId
        ),
      };
    }),
  manyFriendshipStatus: procedure
    .input(
      z.object({
        users: z
          .array(z.object({ name: z.string() }))
          .min(1)
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          name: {
            in: input.users?.map((user) => user.name),
          },
        },
        select: {
          id: true,
          followers: true,
          following: true,
        },
      });

      if (!users) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return users
        .map((user) => {
          if (!ctx.session) {
            return {
              followedBy: false,
              following: false,
              id: user.id,
            };
          }

          const sessionUserId = ctx.session.user.id;

          return {
            following: user.followers.some(
              (follower) => follower.followerId === sessionUserId
            ),
            followedBy: user.following.some(
              (following) => following.followingId === sessionUserId
            ),
            id: user.id,
          };
        })
        .reduce(
          (accumulator, current) => Object.assign(accumulator, { [current.id]: current }),
          {}
        ) as ManyFriendshipStatus;
    }),
  friendshipCount: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const followersAmount = await ctx.prisma.follows.count({
        where: { following: { name: input.username } },
      });
      const followingAmount = await ctx.prisma.follows.count({
        where: { follower: { name: input.username } },
      });

      return {
        followersAmount,
        followingAmount,
      };
    }),
});
