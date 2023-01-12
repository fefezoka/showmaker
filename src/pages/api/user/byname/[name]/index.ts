import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../lib/prisma';

export default async function profile(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req: req });
  const { name } = req.query;

  if (!name) {
    return res.status(404).send({ message: 'error' });
  }

  const user = await prisma.user.findUnique({
    where: {
      name: name as string,
    },
    include: {
      followers: true,
      following: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'user not found' });
  }

  const osuAccount = await prisma.account.findMany({
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

  return res.status(200).json({
    ...user,
    followYou: user?.following.some(
      (follower) => follower.followingId === session?.user.id
    ),
    isFollowing: user?.followers.some(
      (follower) => follower.followerId === session?.user.id
    ),
    ...(osuAccount[0] && { osuAccountId: osuAccount[0].providerAccountId }),
  });
}
