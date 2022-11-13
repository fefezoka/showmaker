import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const insert = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.body.email;
  const title = req.body.title;
  const url = req.body.url;

  const response = await prisma.post.create({
    data: {
      title: title,
      video_url: url,
      user: {
        connect: {
          email: email,
        },
      },
    },
  });

  res.status(200).json(response);
};

export default insert;
