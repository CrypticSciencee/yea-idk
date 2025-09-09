'use client';

import React, { memo, useCallback } from 'react';
import { Clock, TrendingUp, RotateCcw, Trophy, Zap, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  selectedFilter: string;
  selectedTimeframe: string;
  onFilterChange: (filter: string) => void;
  onTimeframeChange: (timeframe: string) => void;
}

const filterOptions = [
  { name: 'Last 24 hours', icon: Clock, type: 'filter' },
  { name: 'Trending', icon: TrendingUp, type: 'filter' },
  { name: '5M', icon: null, type: 'timeframe' },
  { name: '1H', icon: null, type: 'timeframe' },
  { name: '6H', icon: null, type: 'timeframe' },
  { name: '24H', icon: null, type: 'timeframe' },
  { name: 'Top', icon: Trophy, type: 'filter' },
  { name: '↑ Gainers', icon: TrendingUp, type: 'filter' },
  { name: 'New Pairs', icon: RotateCcw, type: 'filter' },
  { name: 'Profile', icon: null, type: 'filter' },
  { name: '⚡ Boosted', icon: Zap, type: 'filter' },
  { name: '✔ Ads', icon: CheckCircle, type: 'filter' }
];

const FilterBar = memo<FilterBarProps>(({
  selectedFilter,
  selectedTimeframe,
  onFilterChange,
  onTimeframeChange
}) => {
  const handleClick = useCallback((option: typeof filterOptions[0]) => {
    if (option.type === 'timeframe') {
      onTimeframeChange(option.name);
    } else {
      onFilterChange(option.name);
    }
  }, [onFilterChange, onTimeframeChange]);

  const isActive = useCallback((option: typeof filterOptions[0]) => {
    if (option.type === 'timeframe') {
      return selectedTimeframe === option.name;
    } else {
      return selectedFilter === option.name;
    }
  }, [selectedFilter, selectedTimeframe]);

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
        {filterOptions.map((option, index) => {
          const active = isActive(option);
          const Icon = option.icon;
          
          return (
            <Button
              key={index}
              variant={active ? "default" : "ghost"}
              size="sm"
              onClick={() => handleClick(option)}
              className={cn(
                "whitespace-nowrap transition-all duration-200",
                active 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              )}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {option.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;
