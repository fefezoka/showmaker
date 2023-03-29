import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../../lib/prisma';

export default async function lastPosts(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'error' });
  }

  const response = await prisma.post.findMany({
    where: {
      userId: id as string,
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

  return res.status(200).json(response);
}
