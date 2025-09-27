import type { NextApiRequest, NextApiResponse } from 'next';
import { PositionCalculator } from '@/lib/position';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { entryPrice, stopPrice, maxLossAmount, leverage, accountBalance } = req.body;

    if (!entryPrice || !maxLossAmount) {
      return res.status(400).json({ 
        message: 'entryPrice and maxLossAmount are required' 
      });
    }

    if (entryPrice <= 0 || maxLossAmount <= 0) {
      return res.status(400).json({ 
        message: 'entryPrice and maxLossAmount must be positive numbers' 
      });
    }

    const positionCalc = PositionCalculator.calculatePosition({
      entryPrice,
      stopPrice,
      maxLossAmount,
      leverage,
      accountBalance,
    });

    const validation = PositionCalculator.validatePosition(positionCalc);

    res.status(200).json({
      position: positionCalc,
      validation,
      calculatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Position calculation error:', error);
    res.status(500).json({ 
      message: 'Failed to calculate position',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}