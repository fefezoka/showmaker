import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';

export default async function osu(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'error' });
  }

  const response = await prisma.account.findMany({
    where: {
      user: {
        id: id as string,
      },
      provider: 'osu',
    },
  });

  if (!response) {
    return res.status(404).json({ message: 'error' });
  }

  if (response[0].expires_at && Math.floor(Date.now() / 1000) > response[0].expires_at) {
    const { data } = await axios.post('https://osu.ppy.sh/oauth/token', {
      client_id: process.env.OSU_ID,
      client_secret: process.env.OSU_SECRET,
      refresh_token: response[0].refresh_token,
      grant_type: 'refresh_token',
      access_token: response[0].access_token,
    });

    await prisma.account.updateMany({
      where: {
        provider: 'osu',
        AND: {
          user: {
            id: id as string,
          },
        },
      },
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_in + Math.floor(Date.now() / 1000),
      },
    });

    response[0].access_token = data.access_token;
  }

  const { data } = await axios.get('https://osu.ppy.sh/api/v2/me', {
    headers: {
      Authorization: `Bearer ${response[0].access_token}`,
    },
  });

  return res.status(200).json(data);
}
