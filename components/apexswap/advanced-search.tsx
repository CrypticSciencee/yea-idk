'use client';

import React, { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, X, Filter, TrendingUp, TrendingDown, Star, Clock, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/performance';

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  pair: string;
  price: string;
  change24h: number;
  volume: string;
  marketCap: string;
  icon: string;
  category: 'token' | 'pair' | 'blockchain';
}

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

interface SearchFilters {
  category: string[];
  priceRange: [number, number];
  changeRange: [number, number];
  volumeRange: [number, number];
  blockchains: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    symbol: 'MOVEMENT',
    name: 'Movement Coin',
    pair: 'SOL',
    price: '$0.0004627',
    change24h: 12.68,
    volume: '$1.8M',
    marketCap: '$462K',
    icon: '🟢',
    category: 'token'
  },
  {
    id: '2',
    symbol: 'PEPE',
    name: 'Pepe Coin',
    pair: 'SOL',
    price: '$0.0001234',
    change24h: -12.68,
    volume: '$4.0M',
    marketCap: '$1.3M',
    icon: '🐸',
    category: 'token'
  },
  {
    id: '3',
    symbol: 'DOGE',
    name: 'Dogecoin',
    pair: 'SOL',
    price: '$0.0009876',
    change24h: 15.67,
    volume: '$2.5M',
    marketCap: '$890K',
    icon: '🐕',
    category: 'token'
  },
  {
    id: '4',
    symbol: 'SOL',
    name: 'Solana',
    pair: 'USDT',
    price: '$98.45',
    change24h: 5.23,
    volume: '$45.2M',
    marketCap: '$42.1B',
    icon: '🟣',
    category: 'pair'
  },
  {
    id: '5',
    symbol: 'ETH',
    name: 'Ethereum',
    pair: 'USDT',
    price: '$2,456.78',
    change24h: -2.34,
    volume: '$12.8M',
    marketCap: '$295.6B',
    icon: '💎',
    category: 'pair'
  }
];

const blockchainOptions = [
  'Solana', 'Ethereum', 'BSC', 'Base', 'Polygon', 'Arbitrum', 'Avalanche'
];

const categoryOptions = [
  { value: 'token', label: 'Tokens', icon: '🪙' },
  { value: 'pair', label: 'Pairs', icon: '🔗' },
  { value: 'blockchain', label: 'Blockchains', icon: '⛓️' }
];

const sortOptions = [
  { value: 'price', label: 'Price' },
  { value: 'change24h', label: '24h Change' },
  { value: 'volume', label: 'Volume' },
  { value: 'marketCap', label: 'Market Cap' },
  { value: 'name', label: 'Name' }
];

const AdvancedSearch = memo<AdvancedSearchProps>(({
  onSearch,
  onFilterChange,
  placeholder = "Search tokens, pairs, or blockchains...",
  className
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    priceRange: [0, 1000000],
    changeRange: [-100, 100],
    volumeRange: [0, 1000000000],
    blockchains: [],
    sortBy: 'volume',
    sortOrder: 'desc'
  });
  const [selectedResult, setSelectedResult] = useState<number>(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      // Filter results based on query and current filters
      const filtered = mockSearchResults.filter(result => {
        const matchesQuery = 
          result.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.pair.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = filters.category.length === 0 || 
          filters.category.includes(result.category);

        const matchesBlockchain = filters.blockchains.length === 0 ||
          filters.blockchains.some(chain => 
            result.pair.toLowerCase().includes(chain.toLowerCase())
          );

        return matchesQuery && matchesCategory && matchesBlockchain;
      });

      // Sort results
      const sorted = filtered.sort((a, b) => {
        const aValue = getSortValue(a, filters.sortBy);
        const bValue = getSortValue(b, filters.sortBy);
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setSearchResults(sorted);
      setShowResults(true);
    }, 300),
    [filters]
  );

  // Get sort value for a result
  const getSortValue = (result: SearchResult, sortBy: string): number | string => {
    switch (sortBy) {
      case 'price':
        return parseFloat(result.price.replace('$', '').replace(',', ''));
      case 'change24h':
        return result.change24h;
      case 'volume':
        return parseFloat(result.volume.replace('$', '').replace('M', '')) * 1000000;
      case 'marketCap':
        return parseFloat(result.marketCap.replace('$', '').replace('K', '')) * 1000;
      case 'name':
        return result.name;
      default:
        return result.symbol;
    }
  };

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Handle result selection
  const handleResultSelect = useCallback((result: SearchResult) => {
    setQuery(`${result.symbol}/${result.pair}`);
    setShowResults(false);
    onSearch(`${result.symbol}/${result.pair}`);
  }, [onSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResult(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResult(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResult >= 0 && selectedResult < searchResults.length) {
          handleResultSelect(searchResults[selectedResult]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedResult(-1);
        break;
    }
  }, [showResults, searchResults, selectedResult, handleResultSelect]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    
    // Re-run search with new filters
    if (query.length >= 2) {
      debouncedSearch(query);
    }
  }, [filters, onFilterChange, query, debouncedSearch]);

  // Handle category toggle
  const toggleCategory = useCallback((category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    
    handleFilterChange({ category: newCategories });
  }, [filters.category, handleFilterChange]);

  // Handle blockchain toggle
  const toggleBlockchain = useCallback((blockchain: string) => {
    const newBlockchains = filters.blockchains.includes(blockchain)
      ? filters.blockchains.filter(b => b !== blockchain)
      : [...filters.blockchains, blockchain];
    
    handleFilterChange({ blockchains: newBlockchains });
  }, [filters.blockchains, handleFilterChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      category: [],
      priceRange: [0, 1000000],
      changeRange: [-100, 100],
      volumeRange: [0, 1000000000],
      blockchains: [],
      sortBy: 'volume',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedResult(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder={placeholder}
          className="pl-10 pr-20 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-6 w-6 p-0"
          >
            <Filter className="h-3 w-3" />
          </Button>
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setShowResults(false);
                onSearch('');
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <Card 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border-gray-700 z-50 max-h-96"
        >
          <ScrollArea className="max-h-96">
            <div className="p-2">
              {searchResults.map((result, index) => (
                <div
                  key={result.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded cursor-pointer transition-colors",
                    selectedResult === index 
                      ? "bg-blue-600/20" 
                      : "hover:bg-gray-800"
                  )}
                  onClick={() => handleResultSelect(result)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{result.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">
                          {result.symbol}/{result.pair}
                        </span>
                        <Badge className="bg-gray-700 text-gray-300 text-xs">
                          {result.category}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">{result.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-white">{result.price}</div>
                    <div className={cn(
                      "text-xs",
                      result.change24h >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {result.change24h >= 0 ? '+' : ''}{result.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border-gray-700 z-50">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <Button
                      key={category.value}
                      variant={filters.category.includes(category.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(category.value)}
                      className="text-xs"
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Blockchains */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Blockchains</h4>
                <div className="flex flex-wrap gap-2">
                  {blockchainOptions.map((blockchain) => (
                    <Button
                      key={blockchain}
                      variant={filters.blockchains.includes(blockchain) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleBlockchain(blockchain)}
                      className="text-xs"
                    >
                      {blockchain}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Sort Options */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Sort By</h4>
                <div className="flex items-center space-x-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white text-sm rounded px-2 py-1"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange({ 
                      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })}
                    className="text-xs"
                  >
                    {filters.sortOrder === 'asc' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Clear Filters */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

AdvancedSearch.displayName = 'AdvancedSearch';

export default AdvancedSearch;
