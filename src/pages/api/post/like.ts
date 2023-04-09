import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function like(req: NextApiRequest, res: NextApiResponse) {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const response = await prisma.likedPost.create({
    data: {
      postId,
      userId,
    },
  });

  if (!response) {
    return res.status(400).json({ message: 'error' });
  }

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

  return res.status(201).json({ message: 'ok' });
}
