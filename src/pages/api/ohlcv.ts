import type { NextApiRequest, NextApiResponse } from 'next';
import { ExchangeService } from '@/lib/exchange';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { symbol = 'BTC', timeframe = '1h', limit = 200 } = req.query;

    const ohlcvData = await ExchangeService.fetchOHLCV(
      symbol as string,
      timeframe as string,
      parseInt(limit as string) || 200
    );

    res.status(200).json({
      data: ohlcvData,
      symbol,
      timeframe,
      count: ohlcvData.length,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('OHLCV fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch OHLCV data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}