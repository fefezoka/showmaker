import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { followingId, followerId } = req.body;

  if (followingId === followerId) {
    return res.status(400).json({ message: 'error' });
  }

  await prisma.follows.createMany({
    data: {
      followingId: followingId,
      followerId: followerId,
    },
  });

  await prisma.user.update({
    data: {
      followersAmount: {
        increment: 1,
      },
    },
    where: {
      id: followingId,
    },
  });

  await prisma.user.update({
    data: {
      followingAmount: {
        increment: 1,
      },
    },
    where: {
      id: followerId,
    },
  });

  res.status(200).json({ message: 'ok' });
};
