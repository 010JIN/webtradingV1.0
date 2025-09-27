import React, { useState } from 'react';
import { Chart } from '@/components/Chart';
import { SignalsList } from '@/components/SignalsList';
import { Signal } from '@/types';
import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function DemoPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const symbols = ['BTC', 'ETH', 'BNB'];
  const timeframes = ['5m', '15m', '1h', '4h', '1d'];

  const handleSignalClick = (signal: Signal) => {
    setSelectedSignal(signal);
    // In a real implementation, this would scroll the chart to the signal's timestamp
    console.log('Signal clicked:', signal);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 border-l border-gray-300" />
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">SignalPro Demo</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </div>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Full Access
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center space-x-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbol
              </label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe
              </label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {timeframes.map((tf) => (
                  <option key={tf} value={tf}>
                    {tf}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <div className="text-sm text-gray-600">
                This demo uses simulated data to demonstrate SignalPro's features. 
                <Link href="/auth/register" className="text-blue-600 hover:underline ml-1">
                  Sign up for live market data.
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2">
            <Chart
              symbol={selectedSymbol}
              timeframe={selectedTimeframe}
              onSignalClick={handleSignalClick}
            />
          </div>

          {/* Signals Panel */}
          <div>
            <SignalsList
              signals={[]} // Will be populated by the Chart component
              onSignalClick={handleSignalClick}
              timeframes={timeframes}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
          </div>
        </div>

        {/* Signal Details Modal */}
        {selectedSignal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Signal Details</h3>
                <button
                  onClick={() => setSelectedSignal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{selectedSignal.signalType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Symbol:</span>
                  <span className="font-medium">{selectedSignal.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeframe:</span>
                  <span className="font-medium">{selectedSignal.timeframe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${selectedSignal.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {selectedSignal.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  🔒 In the full version, you can set up alerts for signals like this 
                  and even enable semi-automated trading with position sizing.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}