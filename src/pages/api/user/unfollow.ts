import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function unfollow(req: NextApiRequest, res: NextApiResponse) {
  const { followingId, followerId } = req.body;

  if (followingId === followerId || !followingId || !followerId) {
    return res.status(400).json({ message: 'missing fields' });
  }

  await prisma.follows.deleteMany({
    where: {
      followingId: followingId,
      followerId: followerId,
    },
  });

  await prisma.user.update({
    data: {
      followersAmount: {
        decrement: 1,
      },
    },
    where: {
      id: followingId,
    },
  });

  await prisma.user.update({
    data: {
      followingAmount: {
        decrement: 1,
      },
    },
    where: {
      id: followerId,
    },
  });

  res.status(201).json({ message: 'ok' });
}
