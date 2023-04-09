import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function remove(req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ message: 'error' });
  }

  const response = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  res.status(201).json(response);
}
