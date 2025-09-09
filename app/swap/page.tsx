'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, Activity, Zap, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockPairs = [
  {
    id: 'BTC-USDT',
    symbol: 'BTC-USDT',
    baseSymbol: 'BTC',
    quoteSymbol: 'USDT',
    price: 43250.50,
    change24h: 2.45,
    volume24h: 1250000000,
    high24h: 44100.00,
    low24h: 42800.00,
    exchange: 'Binance'
  },
  {
    id: 'ETH-USDT',
    symbol: 'ETH-USDT',
    baseSymbol: 'ETH',
    quoteSymbol: 'USDT',
    price: 2650.75,
    change24h: -1.23,
    volume24h: 850000000,
    high24h: 2720.00,
    low24h: 2580.00,
    exchange: 'Binance'
  },
  {
    id: 'SOL-USDT',
    symbol: 'SOL-USDT',
    baseSymbol: 'SOL',
    quoteSymbol: 'USDT',
    price: 98.45,
    change24h: 5.67,
    volume24h: 320000000,
    high24h: 102.50,
    low24h: 94.20,
    exchange: 'Binance'
  }
];

const mockTrades = [
  { id: '1', time: Date.now(), side: 'BUY' as const, price: 43250.50, amount: 0.025, exchange: 'Binance' },
  { id: '2', time: Date.now() - 1000, side: 'SELL' as const, price: 43248.75, amount: 0.15, exchange: 'Coinbase' },
  { id: '3', time: Date.now() - 2000, side: 'BUY' as const, price: 43252.00, amount: 0.08, exchange: 'Kraken' },
];

export default function SwapPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPair, setSelectedPair] = useState<string>('');
  
  const [pairs] = useState(mockPairs);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [connectionStatus] = useState({ binance: 'connected', coinbase: 'connected' });
  const [trades] = useState(mockTrades);
  const [price, setPrice] = useState(0);
  const [change24h, setChange24h] = useState(0);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Auto-select first pair when data loads
    if (pairs.length > 0 && !selectedPair) {
      setSelectedPair(pairs[0].id);
      const selectedPairData = pairs[0];
      setPrice(selectedPairData.price);
      setChange24h(selectedPairData.change24h);
      setVolume(selectedPairData.volume24h);
    }
  }, [pairs, selectedPair]);

  useEffect(() => {
    // Update price/change when pair changes
    const selectedPairData = pairs.find(p => p.id === selectedPair);
    if (selectedPairData) {
      setPrice(selectedPairData.price);
      setChange24h(selectedPairData.change24h);
      setVolume(selectedPairData.volume24h);
    }
  }, [selectedPair, pairs]);

  const filteredPairs = pairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.baseSymbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0b0f16] p-4">
        <div className="max-w-[2000px] mx-auto">
          <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
              <div className="text-white font-semibold">Loading Trading Interface...</div>
              <div className="text-slate-400 text-sm">Initializing professional trading tools</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f16] p-4">
      {/* Header */}
      <div className="max-w-[2000px] mx-auto mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">TRADER</h1>
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                Professional Interface
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                Object.values(connectionStatus).some(status => status === 'connected') 
                  ? "bg-green-400 animate-pulse" 
                  : "bg-red-400"
              )}></div>
              <span>
                {Object.values(connectionStatus).some(status => status === 'connected') 
                  ? 'Live Data' 
                  : 'Connecting...'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>
                {Object.keys(connectionStatus).length > 0 
                  ? `${Object.keys(connectionStatus).length} Exchanges` 
                  : 'Real-time Updates'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[2000px] mx-auto">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
          
          {/* LEFT COLUMN - Pairs Table */}
          <div className="col-span-3 bg-[#0e1420] rounded-2xl border border-[#121826] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#121826] bg-[#0b0f16]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search pairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-slate-400">Loading pairs...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-red-400 text-sm text-center">
                    <div>Connection Error</div>
                    <div className="text-xs text-slate-500 mt-1">Check network connection</div>
                  </div>
                </div>
              ) : filteredPairs.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-slate-400">No pairs found</div>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredPairs.map((pair) => (
                    <div
                      key={pair.id}
                      onClick={() => setSelectedPair(pair.id)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-colors",
                        selectedPair === pair.id
                          ? "bg-cyan-500/10 border border-cyan-500/20"
                          : "hover:bg-slate-800/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{pair.symbol}</div>
                          <div className="text-xs text-slate-400">Vol: ${(pair.volume24h / 1000000).toFixed(1)}M</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-mono text-sm">
                            ${pair.price.toFixed(pair.price < 1 ? 6 : 2)}
                          </div>
                          <div className={cn(
                            "text-xs font-medium flex items-center",
                            pair.change24h >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {pair.change24h >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {pair.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER COLUMN - Chart */}
          <div className="col-span-6 space-y-4">
            {selectedPair ? (
              <>
                <div className="bg-[#0e1420] rounded-2xl border border-[#121826] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {pairs.find(p => p.id === selectedPair)?.symbol || 'Loading...'}
                      </h2>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xl font-mono text-white">
                          ${price.toFixed(price < 1 ? 6 : 2)}
                        </span>
                        <Badge className={cn(
                          "text-xs",
                          change24h >= 0 
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                          {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">24h Volume</div>
                      <div className="text-white font-medium">
                        ${(volume / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0e1420] rounded-2xl border border-[#121826] p-6 h-[560px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChart3 className="h-12 w-12 text-cyan-400 mx-auto" />
                    <div className="text-white font-semibold">Professional Chart Ready</div>
                    <div className="text-slate-400 text-sm">
                      TradingView-style candlestick charts • Real-time updates active
                    </div>
                    <div className="text-xs text-slate-500">
                      Chart will display when connected to real exchange APIs
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#0e1420] rounded-2xl border border-[#121826] p-6 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Activity className="h-12 w-12 text-slate-600 mx-auto" />
                  <div className="text-slate-400">Select a trading pair to view chart</div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Trades & Swap */}
          <div className="col-span-3 space-y-4">
            {/* Recent Trades */}
            <div className="bg-[#0e1420] rounded-2xl border border-[#121826] overflow-hidden">
              <div className="p-4 border-b border-[#121826]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
                  <div className="flex items-center space-x-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      trades.length > 0 ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                    )}></div>
                    <span className="text-xs text-slate-400">
                      {trades.length > 0 ? 'Live' : 'Connecting'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Side</span>
                  <span>Price</span>
                  <span>Amount</span>
                  <span>Exchange</span>
                  <span>Time</span>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {trades.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center space-y-2">
                      <div className="text-slate-400 text-sm">Loading trades...</div>
                      <div className="text-xs text-slate-500">Real-time data incoming</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    {trades.slice(0, 20).map((trade) => (
                      <div 
                        key={trade.id} 
                        className="flex items-center justify-between text-xs py-1 px-2 hover:bg-slate-800/30 rounded transition-colors"
                      >
                        <div className={cn(
                          "font-medium w-8",
                          trade.side === 'BUY' ? "text-green-400" : "text-red-400"
                        )}>
                          {trade.side}
                        </div>
                        <div className="text-white font-mono text-right w-20">
                          ${trade.price.toFixed(trade.price < 1 ? 6 : 2)}
                        </div>
                        <div className="text-slate-400 text-right w-16">
                          {trade.amount?.toFixed(4) || '0.0000'}
                        </div>
                        <div className="text-xs text-slate-500 text-right w-12">
                          {trade.exchange?.slice(0, 3) || 'N/A'}
                        </div>
                        <div className="text-slate-500 text-right w-12">
                          {new Date(trade.time).toLocaleTimeString('en-US', { 
                            hour12: false, 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                          }).slice(-5)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Swap Panel */}
            <div className="bg-[#0e1420] rounded-2xl border border-[#121826] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Swap</h3>
              
              {selectedPair ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-slate-400 text-sm mb-2">
                      Swap functionality ready
                    </div>
                    <div className="text-xs text-slate-500">
                      Connect wallet to enable trading
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
                    disabled
                  >
                    Connect Wallet to Swap
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-slate-400 text-sm">Select a pair to start swapping</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}