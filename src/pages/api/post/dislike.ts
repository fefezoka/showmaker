import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const dislike = async (req: NextApiRequest, res: NextApiResponse) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(404).json({ message: 'error' });
  }

  await prisma.likedPost.deleteMany({
    where: {
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
        decrement: 1,
      },
    },
  });

  return res.status(200).json({ message: 'ok' });
};

export default dislike;
