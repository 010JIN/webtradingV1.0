import React from 'react';
import { Signal } from '@/types';
import { TrendingUp, TrendingDown, AlertTriangle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SignalsListProps {
  signals: Signal[];
  onSignalClick?: (signal: Signal) => void;
  timeframes?: string[];
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

export const SignalsList: React.FC<SignalsListProps> = ({
  signals,
  onSignalClick,
  timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'],
  selectedTimeframe,
  onTimeframeChange,
}) => {
  const getSignalIcon = (signalType: string) => {
    switch (signalType) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'overbought':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'oversold':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getSignalColor = (signalType: string) => {
    switch (signalType) {
      case 'buy':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'sell':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'overbought':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'oversold':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const groupedSignals = timeframes.reduce((acc, tf) => {
    acc[tf] = signals.filter(s => s.timeframe === tf).slice(0, 10); // Latest 10 per timeframe
    return acc;
  }, {} as Record<string, Signal[]>);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Multi-Timeframe Signals</h3>
        <div className="text-sm text-gray-500">
          Avoid FOMO - Check all timeframes
        </div>
      </div>

      {/* Timeframe tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange?.(tf)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTimeframe === tf
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tf}
              {groupedSignals[tf].length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-xs">
                  {groupedSignals[tf].length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Signals list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {selectedTimeframe ? (
          // Show signals for selected timeframe
          groupedSignals[selectedTimeframe].length > 0 ? (
            groupedSignals[selectedTimeframe].map((signal, index) => (
              <SignalItem
                key={signal.id}
                signal={signal}
                onClick={() => onSignalClick?.(signal)}
                getSignalIcon={getSignalIcon}
                getSignalColor={getSignalColor}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No signals for {selectedTimeframe}
            </div>
          )
        ) : (
          // Show all signals grouped by timeframe
          timeframes.map((tf) => (
            <div key={tf} className="space-y-2">
              <h4 className="font-medium text-gray-700 text-sm">{tf}</h4>
              {groupedSignals[tf].length > 0 ? (
                <div className="space-y-2">
                  {groupedSignals[tf].map((signal) => (
                    <SignalItem
                      key={signal.id}
                      signal={signal}
                      onClick={() => onSignalClick?.(signal)}
                      getSignalIcon={getSignalIcon}
                      getSignalColor={getSignalColor}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">No recent signals</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface SignalItemProps {
  signal: Signal;
  onClick?: () => void;
  getSignalIcon: (signalType: string) => React.ReactNode;
  getSignalColor: (signalType: string) => string;
}

const SignalItem: React.FC<SignalItemProps> = ({
  signal,
  onClick,
  getSignalIcon,
  getSignalColor,
}) => (
  <div
    onClick={onClick}
    className={`p-3 border rounded-lg cursor-pointer transition-colors ${getSignalColor(
      signal.signalType
    )}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {getSignalIcon(signal.signalType)}
        <div>
          <div className="font-medium text-gray-900 capitalize">
            {signal.signalType}
          </div>
          <div className="text-sm text-gray-600">
            ${signal.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          {signal.timeframe}
        </div>
        <div className="text-xs text-gray-500">
          {format(signal.timestamp, 'HH:mm')}
        </div>
      </div>
    </div>
    
    {signal.payload && (
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
        {signal.payload.rsi && (
          <div>RSI: {signal.payload.rsi.toFixed(1)}</div>
        )}
        {signal.payload.emaShort && (
          <div>EMA10: {signal.payload.emaShort.toFixed(0)}</div>
        )}
        {signal.payload.emaLong && (
          <div>EMA30: {signal.payload.emaLong.toFixed(0)}</div>
        )}
      </div>
    )}
  </div>
);