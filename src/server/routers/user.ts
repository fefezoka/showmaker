import { z } from 'zod';
import { procedure, router } from '../trpc';
import axios from 'axios';

export const user = router({
  profile: procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          name: input.name,
        },
        select: {
          id: true,
          name: true,
          image: true,
          followersAmount: true,
          followingAmount: true,
          createdAt: true,
          updatedAt: true,
          followers: true,
          following: true,
        },
      });

      if (!user) {
        return;
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
        followYou: user.following.some(
          (follower) => follower.followingId === ctx.session?.user.id
        ),
        isFollowing: user.followers.some(
          (follower) => follower.followerId === ctx.session?.user.id
        ),
        ...(osuAccount[0] && { osuAccountId: osuAccount[0].providerAccountId }),
        ...(twitchAccount[0] && {
          twitchAccountId: twitchAccount[0].providerAccountId,
        }),
      };
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
        return;
      }

      if (
        response[0].expires_at &&
        Math.floor(Date.now() / 1000) > response[0].expires_at
      ) {
        const { data } = await axios.post(
          `${process.env.SITE_URL}/api/auth/refresh-token`,
          {
            client_id: process.env.OSU_ID,
            client_secret: process.env.OSU_SECRET,
            refresh_token: response[0].refresh_token,
            username: input.username,
            provider: 'osu',
            access_token: response[0].access_token,
          }
        );

        response[0].access_token = data.access_token;
      }

      const { data } = await axios.get('https://osu.ppy.sh/api/v2/me', {
        headers: {
          Authorization: `Bearer ${response[0].access_token}`,
        },
      });

      return data;
    }),
  lastPosts: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.post.findMany({
        where: {
          user: {
            name: input.username,
          },
        },
        take: 3,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              followersAmount: true,
              followingAmount: true,
            },
          },
          likedBy: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return response;
    }),
  follow: procedure
    .input(z.object({ followingUser: z.object({ id: z.string(), name: z.string() }) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        return;
      }

      await ctx.prisma.follows.createMany({
        data: {
          followingId: input.followingUser.id,
          followerId: ctx.session.user.id,
        },
      });

      await ctx.prisma.user.update({
        data: {
          followersAmount: {
            increment: 1,
          },
        },
        where: {
          id: input.followingUser.id,
        },
      });

      await ctx.prisma.user.update({
        data: {
          followingAmount: {
            increment: 1,
          },
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
  unfollow: procedure
    .input(z.object({ followingUser: z.object({ id: z.string(), name: z.string() }) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        return;
      }

      await ctx.prisma.follows.deleteMany({
        where: {
          followingId: input.followingUser.id,
          followerId: ctx.session.user.id,
        },
      });

      await ctx.prisma.user.update({
        data: {
          followersAmount: {
            decrement: 1,
          },
        },
        where: {
          id: input.followingUser.id,
        },
      });

      await ctx.prisma.user.update({
        data: {
          followingAmount: {
            decrement: 1,
          },
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
});
