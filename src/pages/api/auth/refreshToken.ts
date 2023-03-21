import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function refreshToken(req: NextApiRequest, res: NextApiResponse) {
  const { client_id, client_secret, access_token, refresh_token, user_id, provider } =
    req.body as {
      client_id: string;
      client_secret: string;
      access_token?: string;
      refresh_token: string;
      user_id: string;
      provider: 'twitch' | 'osu';
    };

  if (!client_id || !client_secret || !refresh_token || !provider || !user_id) {
    return res.status(400).json({ message: 'missing values' });
  }

  const providers = {
    twitch: 'https://id.twitch.tv/oauth2/token',
    osu: 'https://osu.ppy.sh/oauth/token',
  };

  const { data } = await axios.post(providers[provider], {
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token,
    grant_type: 'refresh_token',
    ...(provider === 'osu' && {
      access_token: access_token,
    }),
  });

  await prisma.account.updateMany({
    where: {
      provider: provider,
      AND: {
        user: {
          id: user_id,
        },
      },
    },
    data: {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_in + Math.floor(Date.now() / 1000),
    },
  });

  return res.status(200).json({ acess_token: data.access_token });
}
