import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export const commentByPostId = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(404).send({ message: 'error' });
  }

  const response = await prisma.postComment.findMany({
    where: {
      postId: id as string,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return res.status(200).json(response);
};

export default commentByPostId;
