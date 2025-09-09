'use client';

import React, { memo } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  globalStats: {
    volume24h: string;
    txns24h: string;
  };
  isConnected: boolean;
  lastUpdate?: number;
}

const Header = memo<HeaderProps>(({
  sidebarCollapsed,
  onToggleSidebar,
  globalStats,
  isConnected,
  lastUpdate
}) => {
  const formatLastUpdate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="text-gray-400 hover:text-white"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          )}
          <span className="text-sm text-gray-400"><< Collapse menu</span>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              24H VOLUME: {globalStats.volume24h}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {isConnected ? 'Live' : 'Offline'} • 
              {lastUpdate && ` Updated ${formatLastUpdate(lastUpdate)}`}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              24H TXNS: {globalStats.txns24h}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {isConnected ? 'Live' : 'Offline'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
