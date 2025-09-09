'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Shield, 
  ArrowUpDown,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock major tokens data
const MAJOR_TOKENS = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    description: 'The original cryptocurrency, digital gold and store of value',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    description: 'Leading smart contract platform and digital currency',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    description: 'Fully backed US dollar stablecoin for stable value',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    description: 'High-performance blockchain for decentralized applications',
  },
];
export default function InvestPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [investAmount, setInvestAmount] = useState('');
  const [showAllTokens, setShowAllTokens] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0b0f16] p-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="text-white">Loading Investment Interface...</div>
          </div>
        </div>
      </div>
    );
  }

  const displayTokens = showAllTokens ? MAJOR_TOKENS : MAJOR_TOKENS.slice(0, 4);

  const handleQuickInvest = (symbol: string, amount: string) => {
    setSelectedToken(symbol);
    setInvestAmount(amount);
    console.log('Quick invest:', { symbol, amount });
  };

  return (
    <div className="min-h-screen bg-[#0b0f16] p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Simple Crypto Investing</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Invest in major cryptocurrencies with conservative defaults and built-in guidance. 
            Perfect for building a long-term crypto portfolio.
          </p>
        </div>

        {/* Educational Banner */}
        <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Conservative Investing Approach</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We use conservative slippage settings (0.5%), focus on major cryptocurrencies with deep liquidity, 
                and provide educational guidance to help you make informed decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Major Cryptocurrencies Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Major Cryptocurrencies</h2>
            <Button
              variant="ghost"
              onClick={() => setShowAllTokens(!showAllTokens)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {showAllTokens ? 'Show Less' : 'Show More'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTokens.map((token) => (
              <Card key={token.symbol} className="bg-[#0e1420] border-[#121826] hover:border-cyan-500/30 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{token.symbol}</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{token.symbol}</div>
                        <div className="text-xs text-slate-400">{token.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-white font-mono">
                        <div className="text-slate-400">No Price Data</div>
                      </div>
                      <div className="text-slate-400 text-sm">
                        Connect blockchain
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {token.description}
                  </p>
                  
                  {/* Quick Investment Amounts */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-slate-300 mb-2">Quick Invest</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['$50', '$200', '$500'].map((amount) => (
                        <Button
                          key={amount}
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickInvest(token.symbol, amount)}
                          disabled={true}
                          className="border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50 disabled:opacity-50"
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount Input */}
                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        className="pl-7 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
                        disabled={true}
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
                      onClick={() => handleQuickInvest(token.symbol, 'custom')}
                      disabled={true}
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Connect Data Source
                    </Button>
                  </div>

                  {/* Educational Tooltip */}
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <HelpCircle className="h-3 w-3" />
                    <span>Awaiting blockchain connection</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Investment Settings */}
        <Card className="bg-[#0e1420] border-[#121826]">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Shield className="h-5 w-5 mr-2 text-green-400" />
              Investment Settings & Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">What is Slippage?</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Slippage is the difference between expected and actual trade price. 
                  We use 0.5% slippage for conservative trading with minimal price impact.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Smart Routing</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our DEX aggregation finds the best prices across multiple exchanges, 
                  ensuring you get optimal execution for every trade.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Non-Custodial</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your keys remain on your device. ApexSwap never has access to your funds 
                  or can freeze your assets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}