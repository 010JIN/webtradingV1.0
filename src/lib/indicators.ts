import { OHLCV, Signal, BacktestReport, BacktestTrade } from '@/types';

export interface IndicatorParams {
  emaShort?: number;
  emaLong?: number;
  rsiPeriod?: number;
  atrPeriod?: number;
  rsiOverbought?: number;
  rsiOversold?: number;
}

const DEFAULT_PARAMS: IndicatorParams = {
  emaShort: 10,
  emaLong: 30,
  rsiPeriod: 14,
  atrPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
};

export class TechnicalIndicators {
  static calculateEMA(prices: number[], period: number): number[] {
    const k = 2 / (period + 1);
    const ema = [prices[0]];
    
    for (let i = 1; i < prices.length; i++) {
      ema[i] = prices[i] * k + ema[i - 1] * (1 - k);
    }
    
    return ema;
  }

  static calculateRSI(prices: number[], period: number): number[] {
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    const rsi = [];
    let gains = 0;
    let losses = 0;

    // Initial average
    for (let i = 0; i < period; i++) {
      if (changes[i] > 0) gains += changes[i];
      else losses -= changes[i];
    }

    gains /= period;
    losses /= period;

    rsi.push(100 - (100 / (1 + gains / losses)));

    // Smoothed averages
    for (let i = period; i < changes.length; i++) {
      const change = changes[i];
      
      if (change > 0) {
        gains = (gains * (period - 1) + change) / period;
        losses = (losses * (period - 1)) / period;
      } else {
        gains = (gains * (period - 1)) / period;
        losses = (losses * (period - 1) - change) / period;
      }

      rsi.push(100 - (100 / (1 + gains / losses)));
    }

    return rsi;
  }

  static calculateATR(ohlcv: OHLCV[], period: number): number[] {
    const trueRanges = [];
    
    for (let i = 1; i < ohlcv.length; i++) {
      const current = ohlcv[i];
      const previous = ohlcv[i - 1];
      
      const tr = Math.max(
        current.high - current.low,
        Math.abs(current.high - previous.close),
        Math.abs(current.low - previous.close)
      );
      
      trueRanges.push(tr);
    }

    const atr = [];
    let sum = trueRanges.slice(0, period).reduce((a, b) => a + b, 0);
    atr.push(sum / period);

    for (let i = period; i < trueRanges.length; i++) {
      sum = sum - trueRanges[i - period] + trueRanges[i];
      atr.push(sum / period);
    }

    return atr;
  }

  static calculateSignals(
    symbol: string,
    timeframe: string,
    ohlcv: OHLCV[],
    params: IndicatorParams = DEFAULT_PARAMS
  ): Signal[] {
    if (ohlcv.length < Math.max(params.emaLong || 30, params.rsiPeriod || 14)) {
      return [];
    }

    const closes = ohlcv.map(d => d.close);
    const emaShort = this.calculateEMA(closes, params.emaShort || 10);
    const emaLong = this.calculateEMA(closes, params.emaLong || 30);
    const rsi = this.calculateRSI(closes, params.rsiPeriod || 14);
    const atr = this.calculateATR(ohlcv, params.atrPeriod || 14);

    const signals: Signal[] = [];

    for (let i = 1; i < ohlcv.length; i++) {
      const current = ohlcv[i];
      const prevEmaShort = emaShort[i - 1];
      const currEmaShort = emaShort[i];
      const prevEmaLong = emaLong[i - 1];
      const currEmaLong = emaLong[i];
      const currentRSI = rsi[i - 1]; // RSI array is offset by 1
      const currentATR = atr[i - 1]; // ATR array is offset by 1

      // EMA crossover signals
      if (prevEmaShort <= prevEmaLong && currEmaShort > currEmaLong && currentRSI < 60) {
        signals.push({
          id: `${symbol}_${timeframe}_${current.timestamp.getTime()}`,
          symbol,
          timeframe,
          timestamp: current.timestamp,
          signalType: 'buy',
          price: current.close,
          payload: {
            emaShort: currEmaShort,
            emaLong: currEmaLong,
            rsi: currentRSI,
            atr: currentATR,
          },
          createdAt: new Date(),
        });
      }

      if (prevEmaShort >= prevEmaLong && currEmaShort < currEmaLong && currentRSI > 40) {
        signals.push({
          id: `${symbol}_${timeframe}_${current.timestamp.getTime()}`,
          symbol,
          timeframe,
          timestamp: current.timestamp,
          signalType: 'sell',
          price: current.close,
          payload: {
            emaShort: currEmaShort,
            emaLong: currEmaLong,
            rsi: currentRSI,
            atr: currentATR,
          },
          createdAt: new Date(),
        });
      }

      // RSI signals
      if (currentRSI >= (params.rsiOverbought || 70)) {
        signals.push({
          id: `${symbol}_${timeframe}_${current.timestamp.getTime()}_ob`,
          symbol,
          timeframe,
          timestamp: current.timestamp,
          signalType: 'overbought',
          price: current.close,
          payload: {
            emaShort: currEmaShort,
            emaLong: currEmaLong,
            rsi: currentRSI,
            atr: currentATR,
          },
          createdAt: new Date(),
        });
      }

      if (currentRSI <= (params.rsiOversold || 30)) {
        signals.push({
          id: `${symbol}_${timeframe}_${current.timestamp.getTime()}_os`,
          symbol,
          timeframe,
          timestamp: current.timestamp,
          signalType: 'oversold',
          price: current.close,
          payload: {
            emaShort: currEmaShort,
            emaLong: currEmaLong,
            rsi: currentRSI,
            atr: currentATR,
          },
          createdAt: new Date(),
        });
      }
    }

    return signals;
  }

  static backtest(
    ohlcv: OHLCV[],
    signals: Signal[],
    params: { stopLossPercent?: number; takeProfitPercent?: number } = {}
  ): BacktestReport {
    const trades: BacktestTrade[] = [];
    let position: { side: 'buy' | 'sell'; entryPrice: number; entryDate: Date; signal: Signal } | null = null;

    for (const signal of signals) {
      if (!position && (signal.signalType === 'buy' || signal.signalType === 'sell')) {
        // Enter position
        position = {
          side: signal.signalType,
          entryPrice: signal.price,
          entryDate: signal.timestamp,
          signal,
        };
      } else if (position) {
        // Check for exit conditions
        let shouldExit = false;
        let exitPrice = signal.price;

        // Opposite signal exit
        if (
          (position.side === 'buy' && signal.signalType === 'sell') ||
          (position.side === 'sell' && signal.signalType === 'buy')
        ) {
          shouldExit = true;
        }

        // Stop loss / take profit (simplified)
        if (params.stopLossPercent && position.side === 'buy') {
          if (signal.price <= position.entryPrice * (1 - params.stopLossPercent / 100)) {
            shouldExit = true;
          }
        }

        if (shouldExit) {
          const returnPct = position.side === 'buy'
            ? ((exitPrice - position.entryPrice) / position.entryPrice) * 100
            : ((position.entryPrice - exitPrice) / position.entryPrice) * 100;

          const durationHours = (signal.timestamp.getTime() - position.entryDate.getTime()) / (1000 * 60 * 60);

          trades.push({
            entryDate: position.entryDate,
            exitDate: signal.timestamp,
            side: position.side,
            entryPrice: position.entryPrice,
            exitPrice,
            returnPct,
            durationHours,
          });

          position = null;
        }
      }
    }

    // Calculate statistics
    const winningTrades = trades.filter(t => t.returnPct > 0);
    const totalReturn = trades.reduce((sum, t) => sum + t.returnPct, 0);
    const avgReturn = trades.length > 0 ? totalReturn / trades.length : 0;
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;

    // Simplified max drawdown calculation
    let runningReturn = 0;
    let peak = 0;
    let maxDrawdown = 0;

    for (const trade of trades) {
      runningReturn += trade.returnPct;
      if (runningReturn > peak) peak = runningReturn;
      const drawdown = peak - runningReturn;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    // Simplified Sharpe ratio (assumes daily returns)
    const returns = trades.map(t => t.returnPct);
    const avgDailyReturn = avgReturn;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const sharpeRatio = stdDev > 0 ? avgDailyReturn / stdDev : 0;

    return {
      totalTrades: trades.length,
      winRate,
      avgReturn,
      maxDrawdown,
      sharpeRatio,
      totalReturn,
      trades,
    };
  }
}