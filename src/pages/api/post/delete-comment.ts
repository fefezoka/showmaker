import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function deleteComment(req: NextApiRequest, res: NextApiResponse) {
  const { commentId, postId } = req.body;

  if (!commentId || !postId) {
    return res.status(400).json({ message: 'error' });
  }

  const response = await prisma.postComment.delete({
    where: {
      id: commentId as string,
    },
  });

  if (!response) {
    res.status(200).json({ message: 'error' });
  }

  await prisma.post.update({
    data: {
      commentsAmount: {
        decrement: 1,
      },
    },
    where: {
      id: postId,
    },
  });

  return res.status(200).json({ message: 'ok' });
}
