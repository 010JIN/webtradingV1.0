export interface User {
  id: string;
  email: string;
  subscriptionStatus: 'free' | 'pro' | 'enterprise';
  subscriptionExpiry?: Date;
  createdAt: Date;
}

export interface Signal {
  id: string;
  symbol: string;
  timeframe: string;
  timestamp: Date;
  signalType: 'buy' | 'sell' | 'overbought' | 'oversold';
  price: number;
  payload?: {
    emaShort?: number;
    emaLong?: number;
    rsi?: number;
    atr?: number;
    [key: string]: any;
  };
  createdAt: Date;
}

export interface Alert {
  id: string;
  userId: string;
  symbol: string;
  timeframe: string;
  signalType: 'buy' | 'sell' | 'overbought' | 'oversold';
  channels: ('webpush' | 'telegram')[];
  enableAutoTrade: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface OHLCV {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeExecution {
  id: string;
  userId: string;
  signalId: string;
  exchangeOrderId?: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'failed';
  createdAt: Date;
}

export interface PositionCalc {
  recommendedSize: number;
  riskPercentage: number;
  maxLossAmount: number;
  entryPrice: number;
  stopPrice?: number;
  leverage?: number;
}

export interface BacktestReport {
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalReturn: number;
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  entryDate: Date;
  exitDate: Date;
  side: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  returnPct: number;
  durationHours: number;
}