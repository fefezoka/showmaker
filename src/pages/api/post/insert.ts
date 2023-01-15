import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function insert(req: NextApiRequest, res: NextApiResponse) {
  const email = req.body.email;
  const title = req.body.title;
  const videoUrl = req.body.videoUrl;
  const thumbnailUrl = req.body.thumbnailUrl;

  if (!email || !title || !videoUrl || !thumbnailUrl) {
    return res.status(400).json({ message: 'error' });
  }

  const response = await prisma.post.create({
    data: {
      title: title ?? 'callback',
      videoUrl: videoUrl,
      thumbnailUrl: thumbnailUrl,
      user: {
        connect: {
          email: email,
        },
      },
    },
    include: {
      likedBy: true,
      user: true,
    },
  });

  res.status(200).json(response);
}
