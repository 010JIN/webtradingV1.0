import type { NextApiRequest, NextApiResponse } from 'next';
import { TechnicalIndicators } from '@/lib/indicators';
import { OHLCV } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { symbol, timeframe, ohlcv, params } = req.body;

    if (!symbol || !timeframe || !ohlcv) {
      return res.status(400).json({ message: 'symbol, timeframe, and ohlcv data are required' });
    }

    // Convert timestamps to Date objects
    const processedOhlcv: OHLCV[] = ohlcv.map((candle: any) => ({
      ...candle,
      timestamp: new Date(candle.timestamp),
    }));

    // Calculate signals
    const signals = TechnicalIndicators.calculateSignals(
      symbol,
      timeframe,
      processedOhlcv,
      params
    );

    res.status(200).json({
      signals,
      count: signals.length,
      calculatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Signal calculation error:', error);
    res.status(500).json({ 
      message: 'Failed to calculate signals',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}