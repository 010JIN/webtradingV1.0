import { OHLCV } from '@/types';

// Mock exchange implementation for development
export class ExchangeService {
  private static generateMockOHLCV(symbol: string, timeframe: string, count: number = 200): OHLCV[] {
    const data: OHLCV[] = [];
    let basePrice = 27000; // Starting price for BTC
    
    if (symbol === 'ETH') basePrice = 1800;
    if (symbol === 'BNB') basePrice = 300;

    const now = new Date();
    const timeframeMs = this.getTimeframeMs(timeframe);

    for (let i = count; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * timeframeMs);
      
      // Generate realistic price movement
      const volatility = basePrice * 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility;
      
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.random() * 1000 + 100;

      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      });

      basePrice = close; // Next candle starts where this one ended
    }

    return data;
  }

  private static getTimeframeMs(timeframe: string): number {
    const timeframes: Record<string, number> = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
    };
    return timeframes[timeframe] || 60 * 60 * 1000; // Default to 1h
  }

  static async fetchOHLCV(symbol: string, timeframe: string, limit: number = 200): Promise<OHLCV[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    return this.generateMockOHLCV(symbol, timeframe, limit);
  }

  static async placeOrder(params: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    amount: number;
    price?: number;
    stopPrice?: number;
    takeProfitPrice?: number;
  }) {
    // Mock order execution
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      orderId: `order_${Date.now()}`,
      status: 'filled',
      filled: params.amount,
      price: params.price || (Math.random() * 1000 + 27000),
      timestamp: new Date(),
    };
  }

  static async getBalance() {
    return {
      BTC: { free: 0.1, used: 0, total: 0.1 },
      ETH: { free: 2.5, used: 0, total: 2.5 },
      USDT: { free: 10000, used: 0, total: 10000 },
    };
  }
}