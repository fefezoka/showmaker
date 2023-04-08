import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function insert(req: NextApiRequest, res: NextApiResponse) {
  const { id, title, videoUrl, thumbnailUrl, game } = req.body;

  if (!id || !title || !videoUrl || !thumbnailUrl || !game) {
    return res.status(400).json({ message: 'error' });
  }

  const response = await prisma.post.create({
    data: {
      title,
      videoUrl,
      thumbnailUrl,
      game,
      user: {
        connect: {
          id,
        },
      },
    },
    include: {
      likedBy: true,
      user: true,
    },
  });

  return res.status(200).json(response);
}
