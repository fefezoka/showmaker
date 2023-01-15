import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../../../lib/prisma';

export default async function userPosts(req: NextApiRequest, res: NextApiResponse) {
  const { id, page } = req.query;

  if (!page || !id) {
    return res.status(400).json({ message: 'error' });
  }

  const response = await prisma.post.findMany({
    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 6,
    take: 6,
    select: {
      id: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      userId: id as string,
    },
  });

  return res.status(200).json(response);
}
