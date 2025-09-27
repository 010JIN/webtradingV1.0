import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { OHLCV, Signal } from '@/types';
import { ExchangeService } from '@/lib/exchange';
import { TechnicalIndicators } from '@/lib/indicators';

interface ChartProps {
  symbol: string;
  timeframe: string;
  onSignalClick?: (signal: Signal) => void;
}

export const Chart: React.FC<ChartProps> = ({ symbol, timeframe, onSignalClick }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [ohlcvData, setOhlcvData] = useState<OHLCV[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 600,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Fetch data and update chart
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch OHLCV data
        const ohlcv = await ExchangeService.fetchOHLCV(symbol, timeframe);
        setOhlcvData(ohlcv);

        // Calculate signals
        const calculatedSignals = TechnicalIndicators.calculateSignals(symbol, timeframe, ohlcv);
        setSignals(calculatedSignals);

        // Convert to chart format
        const chartData: CandlestickData[] = ohlcv.map(candle => ({
          time: Math.floor(candle.timestamp.getTime() / 1000) as Time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));

        // Update chart
        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(chartData);
        }

        // Add signal markers
        if (chartRef.current && calculatedSignals.length > 0) {
          const markers = calculatedSignals.map(signal => ({
            time: Math.floor(signal.timestamp.getTime() / 1000) as Time,
            position: signal.signalType === 'buy' || signal.signalType === 'oversold' 
              ? 'belowBar' as const 
              : 'aboveBar' as const,
            color: getSignalColor(signal.signalType),
            shape: getSignalShape(signal.signalType) as any,
            text: signal.signalType.toUpperCase(),
            size: 1.5,
          }));

          candlestickSeriesRef.current.setMarkers(markers);
        }

      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (symbol && timeframe) {
      fetchData();
    }
  }, [symbol, timeframe]);

  const getSignalColor = (signalType: string) => {
    switch (signalType) {
      case 'buy':
      case 'oversold':
        return '#10b981';
      case 'sell':
      case 'overbought':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSignalShape = (signalType: string) => {
    switch (signalType) {
      case 'buy':
      case 'oversold':
        return 'arrowUp';
      case 'sell':
      case 'overbought':
        return 'arrowDown';
      default:
        return 'circle';
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-gray-600">Loading chart data...</div>
        </div>
      )}
      
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {symbol} - {timeframe}
        </h2>
        <div className="text-sm text-gray-600">
          Signals: {signals.length}
        </div>
      </div>

      <div
        ref={chartContainerRef}
        className="border border-gray-200 rounded-lg bg-white"
        style={{ height: '600px' }}
      />
    </div>
  );
};