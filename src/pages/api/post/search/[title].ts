import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function search(req: NextApiRequest, res: NextApiResponse) {
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
          from: 'User',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      // {
      //   $lookup: {
      //     from: 'LikedBy',
      //     localField: 'userId',
      //     foreignField: '_id',
      //     as: 'likedBy',
      //   },
      // },
    ],
  })) as any;

  if (response.length === 0 || !response) {
    return res.status(404).json({ message: 'no results' });
  }

  const filter = response.map((r: any) => ({
    id: r._id,
    title: r.title,
    likes: r.likes,
    thumbnailUrl: r.thumbnailUrl,
    videoUrl: r.videoUrl,
    commentsAmount: r.commentsAmount,
    game: r.game,
    createdAt: r.createdAt['$date'],
    updatedAt: r.updatedAt['$date'],
    user: {
      name: r.user[0].name,
      image: r.user[0].image,
      followersAmount: r.user[0].followersAmount,
      followingAmount: r.user[0].followingAmount,
      id: r.user[0]._id,
      createdAt: r.user[0].createdAt['$date'],
      updatedAt: r.user[0].updatedAt['$date'],
    },
  }));

  return res.status(200).json(filter);
}
