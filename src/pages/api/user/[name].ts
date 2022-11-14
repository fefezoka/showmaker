import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  if (!name) {
    return res.status(404).send({ message: 'error' });
  }

  const response = await prisma.user.findUnique({
    where: {
      name: name as string,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
        },
      },
    },
  });

  return res.status(200).json(response);
};

export default getUserById;
