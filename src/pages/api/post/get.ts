import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await prisma.post.findMany({
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
