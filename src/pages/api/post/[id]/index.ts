import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req: req });
  const { id } = req.query;

  if (!id) {
    return res.status(404).send({ message: 'error' });
  }

  const response = await prisma.post.findUnique({
    where: {
      id: id as string,
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

  if (!response) {
    return res.status(404).json({ message: 'error' });
  }

  const { likedBy, ...rest } = response;

  return res.status(200).json({
    ...rest,
    isLiked: response?.likedBy.some((like) => like.userId === session?.user.id) ?? false,
  });
}
