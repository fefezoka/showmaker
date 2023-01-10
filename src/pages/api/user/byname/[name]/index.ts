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

  const linkedToOsu = await prisma.account.findMany({
    where: {
      provider: 'osu',
      AND: {
        user: {
          name: name as string,
        },
      },
    },
  });

  if (user) {
    return res.status(200).json({
      ...user,
      followYou: user?.following.some(
        (follower) => follower.followingId === session?.user.id
      ),
      isFollowing: user?.followers.some(
        (follower) => follower.followerId === session?.user.id
      ),
      linkedToOsu: linkedToOsu.length !== 0,
    });
  }
  return res.status(404).json({ message: 'user not found' });
}
