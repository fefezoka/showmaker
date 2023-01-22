import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../../lib/prisma';

export default async function feedByGame(req: NextApiRequest, res: NextApiResponse) {
  const { page, game } = req.query;

  const response = await prisma.post.findMany({
    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 6,
    take: 6,
    where: { game: game as string },
    select: {
      id: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json(response);
}
