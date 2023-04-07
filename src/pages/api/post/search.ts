import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  const { q: title, page } = req.query;
  const session = await getSession({ req });

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
      {
        $lookup: {
          from: 'LikedPost',
          localField: '_id',
          foreignField: 'postId',
          as: 'likedBy',
        },
      },
      {
        $skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 6,
      },
      { $limit: 6 },
      {
        $project: {
          title: 1,
          videoUrl: 1,
          thumbnailUrl: 1,
          likes: 1,
          commentsAmount: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          game: 1,
          user: 1,
          likedBy: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ],
  })) as any;

  if (response.length === 0 || !response) {
    return res.status(404).json({ message: 'no results' });
  }

  const filter = response
    .filter((r: any) => r.score > 0.8)
    .map((r: any) => ({
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
      isLiked: r.likedBy.some((like: any) => like.userId === session?.user.id) ?? false,
    }));

  return res.status(200).json(filter);
}
