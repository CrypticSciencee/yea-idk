'use client';

import React, { memo, useCallback } from 'react';
import { Search, Star, Bell, Grid3X3, RotateCcw, TrendingUp, TrendingDown, Briefcase, Megaphone, ChevronDown, Settings, ArrowUpDown, X, Twitter, MessageCircle, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigationClick: (item: string) => void;
  onBlockchainClick: (blockchain: string) => void;
}

const blockchainNetworks = [
  { name: 'Moonit', icon: '🌙', color: 'text-green-400' },
  { name: 'Solana', icon: '🟣', color: 'text-purple-400' },
  { name: 'Ethereum', icon: '💎', color: 'text-purple-400' },
  { name: 'BSC', icon: '🟡', color: 'text-yellow-400' },
  { name: 'Base', icon: '🔵', color: 'text-blue-400' },
  { name: 'PulseChain', icon: '🩷', color: 'text-pink-400' },
  { name: 'Polygon', icon: '🟣', color: 'text-purple-400' },
  { name: 'TON', icon: '🔵', color: 'text-blue-400' },
  { name: 'Abstract', icon: '⬛', color: 'text-gray-400' },
  { name: 'Sui', icon: '🌊', color: 'text-blue-400' },
  { name: 'Hyperliquid', icon: '💧', color: 'text-blue-400' },
  { name: 'World Chain', icon: '🌍', color: 'text-gray-400' },
  { name: 'Avalanche', icon: '❄️', color: 'text-red-400' },
  { name: 'Story', icon: '📖', color: 'text-orange-400' },
  { name: 'XRPL', icon: '❌', color: 'text-blue-400' },
  { name: 'Arbitrum', icon: '🔵', color: 'text-blue-400' },
  { name: 'HyperEVM', icon: '🟣', color: 'text-purple-400' },
  { name: 'Cronos', icon: '🟢', color: 'text-green-400' },
  { name: 'Linea', icon: '🔵', color: 'text-blue-400' },
  { name: 'Hedera', icon: '🔵', color: 'text-blue-400' }
];

const navigationItems = [
  { name: 'Watchlist', icon: Star, count: null },
  { name: 'Alerts', icon: Bell, count: 4 },
  { name: 'Multicharts', icon: Grid3X3, count: null },
  { name: 'New Pairs', icon: RotateCcw, count: null },
  { name: '↑↓ Gainers & Losers', icon: ArrowUpDown, count: null },
  { name: 'Portfolio', icon: Briefcase, count: null },
  { name: 'Ad Advertise', icon: Megaphone, count: null },
  { name: 'more', icon: ChevronDown, count: null }
];

const Sidebar = memo<SidebarProps>(({
  collapsed,
  onToggle,
  searchQuery,
  onSearchChange,
  onNavigationClick,
  onBlockchainClick
}) => {
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleNavigationClick = useCallback((item: string) => {
    onNavigationClick(item);
  }, [onNavigationClick]);

  const handleBlockchainClick = useCallback((blockchain: string) => {
    onBlockchainClick(blockchain);
  }, [onBlockchainClick]);

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50",
      collapsed ? "w-16" : "w-80"
    )}>
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Logo and Search */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">ApexSwap</h1>
              {!collapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {!collapsed && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Q Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
                <Badge className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-gray-300">
                  7
                </Badge>
              </div>
            )}
          </div>

          {/* Get App Button */}
          {!collapsed && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
              Get the App!
              <div className="flex ml-2 space-x-1">
                <div className="w-4 h-4 bg-white rounded text-blue-600 text-xs flex items-center justify-center font-bold">A</div>
                <div className="w-4 h-4 bg-white rounded text-blue-600 text-xs flex items-center justify-center font-bold">G</div>
              </div>
            </Button>
          )}

          {/* Navigation */}
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleNavigationClick(item.name)}
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 h-10"
              >
                <item.icon className="h-4 w-4 mr-3" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.count && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </div>

          {/* Blockchain Networks */}
          {!collapsed && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Blockchains</h3>
              <div className="grid grid-cols-2 gap-2">
                {blockchainNetworks.map((network, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleBlockchainClick(network.name)}
                    className="justify-start text-gray-300 hover:text-white hover:bg-gray-800 h-8 text-xs"
                  >
                    <span className="mr-2">{network.icon}</span>
                    <span className={network.color}>{network.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Watchlist Section */}
          {!collapsed && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                <Star className="h-4 w-4 mr-2" />
                WATCHLIST
              </h3>
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <span className="text-sm text-gray-300">0xd1c6...517d</span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          {!collapsed && (
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
