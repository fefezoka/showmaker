import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const insert = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.body.email;
  const title = req.body.title;
  const videoUrl = req.body.videoUrl;
  const thumbnailUrl = req.body.thumbnailUrl;

  const response = await prisma.post.create({
    data: {
      title: title,
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
};

export default insert;
