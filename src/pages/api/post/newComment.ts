import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { message, postId, userId } = req.body;

  const response = await prisma.postComment.create({
    data: {
      message: message,
      postId: postId,
      userId: userId,
    },
    include: {
      user: true,
    },
  });

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      commentsAmount: {
        increment: 1,
      },
    },
  });

  return res.status(200).json(response);
};
