import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function disconnectAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const response = await prisma.account.delete({
    where: {
      id: accountId,
    },
  });

  if (!response) {
    return res.status(400).json({ message: 'error' });
  }

  res.status(201).json(response);
}
