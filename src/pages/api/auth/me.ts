import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { Database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await Database.findUserById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionExpiry: user.subscriptionExpiry,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}