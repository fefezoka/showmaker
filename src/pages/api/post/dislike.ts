import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const dislike = async (req: NextApiRequest, res: NextApiResponse) => {
  const { postId } = req.body;

  if (!postId) {
    return res.status(404).json('Error');
  }

  await prisma.likedPost.delete({
    where: {
      postId: postId,
    },
  });

  const response = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likes: {
        decrement: 1,
      },
    },
  });

  return res.status(200).json(response);
};

export default dislike;
