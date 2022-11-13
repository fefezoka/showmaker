import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
    },
  });

  return res.status(200).json(response);
};

export default get;
