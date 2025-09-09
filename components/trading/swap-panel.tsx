'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Settings, Info, Zap } from 'lucide-react';
import { TokenSelector } from './token-selector';
import { TokenInfo, QuoteResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SwapPanelProps {
  fromToken?: TokenInfo | null;
  toToken?: TokenInfo | null;
  onSwap?: (fromToken: TokenInfo, toToken: TokenInfo, amount: string) => void;
}

export function SwapPanel({ fromToken, toToken, onSwap }: SwapPanelProps) {
  const [sellToken, setSellToken] = useState<TokenInfo | null>(fromToken || null);
  const [buyToken, setBuyToken] = useState<TokenInfo | null>(toToken || null);
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [slippage, setSlippage] = useState(1.0); // 1%
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFlipTokens = useCallback(() => {
    try {
      setSellToken(buyToken);
      setBuyToken(sellToken);
      setSellAmount(buyAmount);
      setBuyAmount(sellAmount);
      setQuote(null);
      setError(null);
    } catch (err) {
      console.error('Error flipping tokens:', err);
      setError('Failed to flip tokens');
    }
  }, [buyToken, sellToken, buyAmount, sellAmount]);

  const handleGetQuote = useCallback(async () => {
    if (!sellToken || !buyToken || !sellAmount) return;

    setIsQuoting(true);
    setQuote(null);
    setError(null);
    
    try {
      const sellAmountNum = parseFloat(sellAmount);
      if (isNaN(sellAmountNum) || sellAmountNum <= 0) {
        throw new Error('Invalid sell amount');
      }

      if (!sellToken.address || !buyToken.address) {
        throw new Error('Invalid token addresses');
      }

      const params = new URLSearchParams({
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        sellAmount: sellAmount,
        slippageBps: Math.floor(slippage * 100).toString(),
      });

      const response = await fetch(`/api/quote/evm?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const quoteData = await response.json();
        if (!quoteData || !quoteData.buyAmount) {
          throw new Error('Invalid quote response');
        }
        setQuote(quoteData);
        setBuyAmount(quoteData.buyAmount);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to get quote:', error);
      setError(error instanceof Error ? error.message : 'Failed to get quote');
    } finally {
      setIsQuoting(false);
    }
  }, [sellToken, buyToken, sellAmount, slippage]);

  const handleSwap = useCallback(() => {
    try {
      if (!sellToken || !buyToken || !sellAmount || !quote) {
        throw new Error('Missing required swap parameters');
      }
      
      const sellAmountNum = parseFloat(sellAmount);
      if (isNaN(sellAmountNum) || sellAmountNum <= 0) {
        throw new Error('Invalid sell amount');
      }
      
      onSwap?.(sellToken, buyToken, sellAmount);
      setError(null);
    } catch (error) {
      console.error('Swap error:', error);
      setError(error instanceof Error ? error.message : 'Swap failed');
    }
  }, [sellToken, buyToken, sellAmount, quote, onSwap]);

  const handleSlippageChange = useCallback((value: number) => {
    try {
      if (typeof value !== 'number' || isNaN(value) || value < 0 || value > 50) {
        console.warn('Invalid slippage value:', value);
        return;
      }
      setSlippage(value);
      setQuote(null); // Reset quote when slippage changes
    } catch (err) {
      console.error('Error changing slippage:', err);
    }
  }, []);
  const canGetQuote = sellToken && buyToken && sellAmount && !isQuoting;
  const canSwap = quote && sellToken && buyToken && sellAmount;

  return (
    <div className="bg-[#0e1420] rounded-2xl border border-[#121826] p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Swap</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-slate-400 hover:text-white"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/30 rounded-xl p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Slippage Tolerance
            </label>
            <div className="flex space-x-2">
              {[0.5, 1.0, 3.0].map((value) => (
                <Button
                  key={value}
                  variant={slippage === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSlippageChange(value)}
                  className={
                    slippage === value
                      ? 'bg-cyan-600 text-white'
                      : 'border-slate-600 text-slate-300 hover:text-white'
                  }
                >
                  {value}%
                </Button>
              ))}
              <Input
                type="number"
                placeholder="Custom"
                value={slippage}
                onChange={(e) => handleSlippageChange(parseFloat(e.target.value) || 1.0)}
                className="w-20 bg-slate-800/50 border-slate-600 text-white"
                min="0"
                max="50"
                step="0.1"
              />
            </div>
          </div>
        </div>
      )}

      {/* From Token */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">From</label>
          <span className="text-xs text-slate-400">Balance: 0.00</span>
        </div>
        
        <div className="relative">
          <Input
            type="number"
            placeholder="0.0"
            value={sellAmount}
            onChange={(e) => {
              try {
                setSellAmount(e.target.value);
                setQuote(null); // Reset quote when amount changes
                setError(null);
              } catch (err) {
                console.error('Error updating sell amount:', err);
              }
            }}
            className="pr-32 bg-slate-800/50 border-slate-700 text-white text-lg h-14"
            min="0"
            step="any"
          />
          <div className="absolute right-2 top-1 bottom-1">
            <TokenSelector
              selectedToken={sellToken}
              onSelect={(token) => {
                try {
                  setSellToken(token);
                  setQuote(null);
                  setError(null);
                } catch (err) {
                  console.error('Error selecting sell token:', err);
                }
              }}
              label="Select"
            />
          </div>
        </div>
      </div>

      {/* Flip Button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFlipTokens}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* To Token */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">To</label>
          <span className="text-xs text-slate-400">Balance: 0.00</span>
        </div>
        
        <div className="relative">
          <Input
            type="number"
            placeholder="0.0"
            value={buyAmount}
            readOnly
            className="pr-32 bg-slate-800/50 border-slate-700 text-white text-lg h-14"
          />
          <div className="absolute right-2 top-1 bottom-1">
            <TokenSelector
              selectedToken={buyToken}
              onSelect={(token) => {
                try {
                  setBuyToken(token);
                  setQuote(null);
                  setError(null);
                } catch (err) {
                  console.error('Error selecting buy token:', err);
                }
              }}
              label="Select"
            />
          </div>
        </div>
      </div>

      {/* Quote Info */}
      {quote && (
        <div className="bg-slate-800/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Rate</span>
            <span className="text-white">
              1 {sellToken?.symbol || 'N/A'} = {quote.price || '0'} {buyToken?.symbol || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Min. Received</span>
            <span className="text-white">
              {(parseFloat(quote.buyAmount || '0') * (1 - slippage / 100)).toFixed(6)} {buyToken?.symbol || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Route</span>
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3 text-cyan-400" />
              <span className="text-white">0x Protocol</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!quote ? (
        <Button
          onClick={handleGetQuote}
          disabled={!canGetQuote}
          className={cn(
            "w-full h-14 text-lg font-semibold",
            canGetQuote
              ? "bg-cyan-600 hover:bg-cyan-500 text-white"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          )}
        >
          {isQuoting ? 'Getting Quote...' : 'Get Quote'}
        </Button>
      ) : (
        <Button
          onClick={handleSwap}
          disabled={!canSwap}
          className={cn(
            "w-full h-14 text-lg font-semibold",
            canSwap
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          )}
        >
          Swap
        </Button>
      )}

      {/* Help Text */}
      <div className="flex items-center justify-center space-x-1 text-xs text-slate-400">
        <Info className="h-3 w-3" />
        <span>Quotes powered by 0x (EVM) & Jupiter (Solana)</span>
      </div>
    </div>
  );
}