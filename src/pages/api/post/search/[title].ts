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
        $project: {
          id: true,
        },
      },
    ],
  })) as any;

  if (response.length === 0 || !response) {
    return res.status(404).json({ message: 'no results' });
  }

  const filter = response.map((r: { _id: string }) => ({ id: r._id }));

  console.log(filter);

  return res.status(200).json(filter);
};

export default searchPost;
