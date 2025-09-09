'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, Star, Zap } from 'lucide-react';
import { TokenInfo } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TokenSelectorProps {
  selectedToken: TokenInfo | null;
  onSelect: (token: TokenInfo) => void;
  label?: string;
  disabled?: boolean;
}

// Mock token data - replace with real token list
const POPULAR_TOKENS: TokenInfo[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8d0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    address: '0xA0b86a33E6417c4cCa7E392C38Ea4e4f0a8e9A99',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86a33E6417c4cCa7E392C38Ea4e4f0a8e9A99/logo.png',
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
];

export function TokenSelector({ selectedToken, onSelect, label = "Select token", disabled }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredTokens = POPULAR_TOKENS.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (address: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(address)) {
      newFavorites.delete(address);
    } else {
      newFavorites.add(address);
    }
    setFavorites(newFavorites);
  };

  const handleSelect = (token: TokenInfo) => {
    try {
      if (!token || !token.address || !token.symbol) {
        throw new Error('Invalid token selected');
      }
      onSelect(token);
      setIsOpen(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Token selection error:', error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "w-full justify-between h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-700",
          "text-white font-medium"
        )}
      >
        <div className="flex items-center space-x-3">
          {selectedToken ? (
            <>
              {selectedToken.logoURI && (
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div className="text-left">
                <div className="font-semibold">{selectedToken.symbol}</div>
                <div className="text-xs text-slate-400">{selectedToken.name}</div>
              </div>
            </>
          ) : (
            <span className="text-slate-400">{label}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#0e1420] border-[#121826] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Select Token</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
            />
          </div>

          {/* Popular Tokens */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-slate-300">Popular</span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredTokens.map((token) => (
                <div
                  key={token.address}
                  onClick={() => handleSelect(token)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer group"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(token.address);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        favorites.has(token.address)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-400 hover:text-yellow-400"
                      )}
                    />
                  </button>

                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{token.symbol}</span>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        ERC20
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-400">{token.name}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium">$0.00</div>
                    <div className="text-xs text-slate-400">Balance: 0</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}