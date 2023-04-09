import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

export default async function timeline(req: NextApiRequest, res: NextApiResponse) {
  const { page, game } = req.query;
  const session = await getSession({ req: req });

  if (!page) {
    return res.status(400).json({ message: 'error' });
  }

  const response = await prisma.post.findMany({
    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 6,
    take: 6,
    ...(game && { where: { game: game as string } }),
    orderBy: {
      createdAt: 'desc',
    },
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
  });

  return res.status(201).json(
    response.map((post) => {
      return {
        ...post,
        isLiked: post.likedBy.some((like) => like.userId === session?.user.id),
      };
    })
  );
}
