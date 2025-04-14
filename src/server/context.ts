import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiResponse } from '@trpc/server/adapters/next';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { getServerSession } from 'next-auth';

export const createContext = async ({
  req,
  res,
}: {
  req: NextApiRequest | GetServerSidePropsContext['req'];
  res: NextApiResponse | GetServerSidePropsContext['res'];
}) => {
  const session = await getServerSession(req, res, authOptions);

  return {
    session,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
