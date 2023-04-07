import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';

export default async function profile(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req: req });
  const { name } = req.query;

  if (!name) {
    return res.status(404).send({ message: 'error' });
  }

  const user = await prisma.user.findUnique({
    where: {
      name: name as string,
    },
    include: {
      followers: true,
      following: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'user not found' });
  }

  const { email, emailVerified, updatedAt, ...filteredUser } = user;

  const osuAccount = await prisma.account.findMany({
    select: {
      providerAccountId: true,
    },
    where: {
      provider: 'osu',
      AND: {
        userId: user.id,
      },
    },
  });

  const twitchAccount = await prisma.account.findMany({
    where: {
      provider: 'twitch',
      AND: {
        userId: user.id,
      },
    },
  });

  // if (
  //   twitchAccount.length !== 0 &&
  //   twitchAccount[0].expires_at &&
  //   Math.floor(Date.now() / 1000) > twitchAccount[0].expires_at
  // ) {
  //   const { data } = await axios.post(`${process.env.SITE_URL}/api/auth/refreshToken`, {
  //     client_id: process.env.TWITCH_ID,
  //     client_secret: process.env.TWITCH_SECRET,
  //     refresh_token: twitchAccount[0].refresh_token,
  //     provider: 'twitch',
  //     user_id: user.id,
  //   });

  //   twitchAccount[0].access_token = data.acess_token;
  // }

  // const twitchUsername =
  //   twitchAccount[0] &&
  //   (await axios.get(
  //     'https://api.twitch.tv/helix/users?id=' + twitchAccount[0].providerAccountId,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${twitchAccount[0].access_token}`,
  //         'Client-Id': process.env.TWITCH_ID,
  //       },
  //     }
  //   ));

  return res.status(200).json({
    ...filteredUser,
    followYou: user.following.some(
      (follower) => follower.followingId === session?.user.id
    ),
    isFollowing: user.followers.some(
      (follower) => follower.followerId === session?.user.id
    ),
    ...(osuAccount[0] && { osuAccountId: osuAccount[0].providerAccountId }),
    ...(twitchAccount[0] && { twitchAccountId: twitchAccount[0].providerAccountId }),
  });
}
