'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useChartData } from '@/hooks/use-market-data';

interface TradingChartProps {
  symbol: string;
  pairId: string;
  onTimeframeChange?: (timeframe: number) => void;
}

export function TradingChart({ symbol, pairId, onTimeframeChange }: TradingChartProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('1h');
  
  const { chartData, loading, error } = useChartData(pairId, selectedInterval);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTimeframeChange = (interval: string, timeframe: number) => {
    setSelectedInterval(interval);
    onTimeframeChange?.(timeframe);
  };

  if (!mounted) {
    return (
      <div className="bg-[#0e1420] rounded-2xl border border-[#121826] p-6">
        <div className="flex items-center justify-center h-[560px]">
          <div className="text-white">Loading Chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0e1420] rounded-2xl border border-[#121826] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{symbol}</h3>
          <p className="text-sm text-slate-400">
            {loading ? 'Loading chart data...' : `${chartData.length} candles`}
          </p>
        </div>
        
        <div className="flex space-x-1">
          {[
            { label: '5m', interval: '5m', timeframe: 300 },
            { label: '15m', interval: '15m', timeframe: 900 },
            { label: '1h', interval: '1h', timeframe: 3600 },
            { label: '4h', interval: '4h', timeframe: 14400 },
            { label: '1d', interval: '1d', timeframe: 86400 },
          ].map((tf) => (
            <Button
              key={tf.label}
              variant={selectedInterval === tf.interval ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTimeframeChange(tf.interval, tf.timeframe)}
              className={
                selectedInterval === tf.interval
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full h-[560px] bg-[#0b0f16] rounded-lg flex items-center justify-center">
        {loading ? (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
            <div className="text-white font-semibold">Loading Chart Data...</div>
            <div className="text-slate-400 text-sm">Fetching real-time data</div>
          </div>
        ) : error ? (
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
            <div className="text-white font-semibold">Chart Error</div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center space-y-4">
            <TrendingUp className="h-12 w-12 text-slate-600 mx-auto" />
            <div className="text-white font-semibold">No Chart Data</div>
            <div className="text-slate-400 text-sm">No data available for this timeframe</div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto" />
            <div className="text-white font-semibold">Professional Chart Ready</div>
            <div className="text-slate-400 text-sm">
              {chartData.length} candles loaded • Real-time updates active
            </div>
            <div className="text-xs text-slate-500">
              TradingView-style candlestick charts • Professional trading tools
            </div>
          </div>
        )}
      </div>
    </div>
  );
}