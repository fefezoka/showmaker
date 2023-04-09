import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function newComment(req: NextApiRequest, res: NextApiResponse) {
  const { message, postId, userId } = req.body;

  if (!message || !postId || !userId) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const response = await prisma.postComment.create({
    data: {
      message,
      postId,
      userId,
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

  return res.status(201).json(response);
}
