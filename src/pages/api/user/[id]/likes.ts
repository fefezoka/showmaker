import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export const likes = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(404).send({ message: 'error' });
  }

  const response = await prisma.likedPost.findMany({
    where: {
      userId: id as string,
    },
  });

  console.log(id);

  return res.status(200).json(response);
};

export default likes;
