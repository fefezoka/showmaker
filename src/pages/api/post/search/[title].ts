import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export const searchPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title } = req.query;

  if (!title) {
    return res.status(404).send({ message: 'error' });
  }

  const response = (await prisma.post.aggregateRaw({
    pipeline: [
      {
        $search: {
          index: 'title',
          text: {
            query: title,
            path: 'title',
            fuzzy: {},
          },
        },
      },
      {
        $lookup: {
          from: 'LikedPost',
          localField: '_id',
          foreignField: 'postId',
          as: 'likedBy',
        },
      },
      {
        $lookup: {
          from: 'User',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
    ],
  })) as any;

  if (response.length === 0 || !response) {
    return res.status(404).json({ message: 'no results' });
  }

  const format = response.map((post: any) => ({
    ...post,
    id: post._id,
    createdAt: post.createdAt.$date,
    updatedAt: post.updatedAt.$date,
    user: post.user[0],
  }));

  return res.status(200).json(format);
};

export default searchPost;
