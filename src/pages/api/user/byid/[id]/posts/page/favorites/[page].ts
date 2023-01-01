import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../../../../lib/prisma';

export default async function favorites(req: NextApiRequest, res: NextApiResponse) {
  const { page, id } = req.query;

  const response = await prisma.post.findMany({
    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 6,
    take: 6,
    where: {
      likedBy: {
        some: {
          userId: id as string,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
    },
  });

  return res.status(200).json(response);
}
