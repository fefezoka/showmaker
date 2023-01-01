import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(404).json('Error');
  }

  await prisma.likedPost.create({
    data: {
      postId: postId,
      userId: userId,
    },
  });

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likes: {
        increment: 1,
      },
    },
  });

  return res.status(200).json({ message: 'ok' });
};
