import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';

export default async function osu(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

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

  const { data } = await axios.get('https://osu.ppy.sh/api/v2/me', {
    headers: {
      Authorization: `Bearer ${response[0].access_token}`,
    },
  });

  return res.status(200).json(data);
}
