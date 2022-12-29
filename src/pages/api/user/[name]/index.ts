import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  if (!name) {
    return res.status(404).send({ message: 'error' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        name: name as string,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ message: `User ${name} doesn't exist` });
  }
};

export default getUserById;
