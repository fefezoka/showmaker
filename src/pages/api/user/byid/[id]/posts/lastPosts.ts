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
    select: {
      id: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!response || response.length === 0) {
    res.status(400).json({ message: 'no data' });
  }

  return res.status(200).json(response);
}
