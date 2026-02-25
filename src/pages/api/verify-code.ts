import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, userId } = req.body;

  if (!code || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const profile = await prisma.userProfile.findFirst({
      where: {
        userId,
        secretCode: code,
      },
    });

    if (!profile) {
      return res.status(401).json({ message: 'Invalid code' });
    }

    return res.status(200).json({ verified: true });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}
