import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: name } = req.query;

  console.log(name);

  if (!name) {
    return res.status(404).send({ message: 'error' });
  }

  try {
    const user = (await prisma.user.findUnique({
      where: {
        name: name as string,
      },
      include: {
        posts: {
          include: {
            likedBy: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })) as User;

    const { posts, ...rest } = user;

    const filter = posts.map((post) => {
      return {
        ...post,
        user: rest,
      };
    });

    return res.status(200).json({ ...rest, posts: filter });
  } catch (error) {
    return res.status(404).json({ message: `User ${name} doesn't exist` });
  }
};

export default getUserById;
