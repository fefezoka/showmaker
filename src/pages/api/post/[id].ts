import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const getPostById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(404).send({ message: 'error' });
  }

  const response = await prisma.post.findUnique({
    where: {
      id: id as string,
    },
    include: {
      user: true,
    },
  });

  return res.status(200).json(response);
};

export default getPostById;
