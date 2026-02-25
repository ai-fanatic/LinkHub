import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const generateSecretCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      });
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching profile' });
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const secretCode = generateSecretCode();
      const profile = await prisma.userProfile.upsert({
        where: { userId },
        update: {
          ...req.body,
          updatedAt: new Date(),
        },
        create: {
          userId,
          secretCode,
          ...req.body,
        },
      });

      // If this is a new profile, return the secret code
      if (req.method === 'POST') {
        return res.status(200).json({ ...profile, secretCode });
      }

      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating profile' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
