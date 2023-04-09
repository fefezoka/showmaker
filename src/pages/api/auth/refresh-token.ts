import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function refreshToken(req: NextApiRequest, res: NextApiResponse) {
  const { client_id, client_secret, access_token, refresh_token, username, provider } =
    req.body as {
      client_id: string;
      client_secret: string;
      access_token?: string;
      refresh_token: string;
      username: string;
      provider: 'twitch' | 'osu';
    };

  if (!client_id || !client_secret || !refresh_token || !provider || !username) {
    return res.status(400).json({ message: 'missing values' });
  }

  const providers = {
    twitch: 'https://id.twitch.tv/oauth2/token',
    osu: 'https://osu.ppy.sh/oauth/token',
  };

  try {
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
            name: username,
          },
        },
      },
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_in + Math.floor(Date.now() / 1000),
      },
    });

    return res.status(201).json({ access_token: data.access_token });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
}
