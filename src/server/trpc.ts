import { TRPCError, inferRouterInputs, inferRouterOutputs, initTRPC } from '@trpc/server';
import { Context } from '@/server/context';
import superjson from 'superjson';
import { inferReactQueryProcedureOptions } from '@trpc/react-query';
import { AppRouter } from '@/server/routers/_app';

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const authenticatedProcedure = procedure.use(isAuthenticated);
