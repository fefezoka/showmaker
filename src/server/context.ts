import { getSession } from 'next-auth/react';
import { prisma } from '../lib/prisma';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { inferAsyncReturnType } from '@trpc/server';

export const createContext = async (opts: any) => {
  const session = await getSession({ req: opts.req });

  return {
    session,
    prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
