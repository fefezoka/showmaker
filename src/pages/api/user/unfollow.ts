import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { followingId, followerId } = req.body;

  if (followingId === followerId) {
    return res.status(400).json({ message: 'error' });
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

  res.status(200).json({ message: 'ok' });
};
