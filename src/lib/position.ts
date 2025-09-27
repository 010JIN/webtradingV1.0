import { PositionCalc } from '@/types';

export class PositionCalculator {
  static calculatePosition(params: {
    entryPrice: number;
    stopPrice?: number;
    maxLossAmount: number;
    leverage?: number;
    accountBalance?: number;
  }): PositionCalc {
    const { entryPrice, stopPrice, maxLossAmount, leverage = 1 } = params;

    if (!stopPrice) {
      // If no stop price provided, use default 2% risk
      const defaultStopPrice = entryPrice * 0.98;
      return this.calculatePosition({
        ...params,
        stopPrice: defaultStopPrice,
      });
    }

    const lossPerUnit = Math.abs(entryPrice - stopPrice);
    
    if (lossPerUnit === 0) {
      throw new Error('Invalid stop price: no risk difference from entry price');
    }

    const recommendedSize = maxLossAmount / lossPerUnit;
    const notionalValue = recommendedSize * entryPrice;
    const riskPercentage = (maxLossAmount / (params.accountBalance || 10000)) * 100;

    return {
      recommendedSize,
      riskPercentage,
      maxLossAmount,
      entryPrice,
      stopPrice,
      leverage,
    };
  }

  static validatePosition(calc: PositionCalc): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (calc.recommendedSize <= 0) {
      errors.push('Recommended size must be positive');
    }

    if (calc.riskPercentage > 5) {
      errors.push('Risk percentage exceeds 5% - consider reducing position size');
    }

    if (calc.entryPrice <= 0) {
      errors.push('Entry price must be positive');
    }

    if (calc.stopPrice && calc.stopPrice === calc.entryPrice) {
      errors.push('Stop price cannot equal entry price');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}