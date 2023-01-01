import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../lib/prisma';

export default async function favorites(req: NextApiRequest, res: NextApiResponse) {
  const { page } = req.query;
  const session = await getSession({ req: req });

  if (!session) {
    return res.status(400).json({ message: 'no session' });
  }

  const response = await prisma.post.findMany({
    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 6,
    take: 6,
    where: {
      user: {
        followers: {
          some: {
            followerId: session?.user.id,
          },
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
