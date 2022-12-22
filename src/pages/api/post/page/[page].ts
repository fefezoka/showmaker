import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page } = req.query;

  const response = await prisma.post.findMany({
    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 6,
    take: 6,
    select: {
      id: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json(response);
};

export default get;
