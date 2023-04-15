import { z } from 'zod';
import { authenticatedProcedure, procedure, router } from '../trpc';
import axios from 'axios';
import { TRPCError } from '@trpc/server';

export const auth = router({
  disconnectAccount: authenticatedProcedure
    .input(z.object({ provider: z.string() }))
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.account.deleteMany({
          where: {
            provider: input.provider,
            AND: {
              userId: ctx.session.user.id,
            },
          },
        })
    ),
  accounts: authenticatedProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.account.findMany({
        select: {
          id: true,
          provider: true,
          providerAccountId: true,
        },
        where: {
          provider: {
            not: 'discord',
          },
          AND: {
            userId: ctx.session.user.id,
          },
        },
      })
  ),
  refreshToken: procedure
    .input(
      z.object({
        client_id: z.string(),
        client_secret: z.string(),
        access_token: z.string(),
        refresh_token: z.string(),
        username: z.string(),
        provider: z.enum(['osu', 'twitch']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const providers = {
        twitch: 'https://id.twitch.tv/oauth2/token',
        osu: 'https://osu.ppy.sh/oauth/token',
      };

      try {
        const { data } = await axios.post(providers[input.provider], {
          client_id: input.client_id,
          client_secret: input.client_secret,
          refresh_token: input.refresh_token,
          grant_type: 'refresh_token',
          ...(input.provider === 'osu' && {
            access_token: input.access_token,
          }),
        });

        await ctx.prisma.account.updateMany({
          where: {
            provider: input.provider,
            AND: {
              user: {
                name: input.username,
              },
            },
          },
          data: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_in + Math.floor(Date.now() / 1000),
          },
        });
        return {
          access_token: data.access_token,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error',
        });
      }
    }),
});
