'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface TokenData {
  id: number;
  rank: number;
  token: {
    symbol: string;
    pair: string;
    name: string;
    icon: string;
    tag: string;
  };
  price: string;
  age: string;
  txns: string;
  volume: string;
  makers: string;
  change5m: number;
  change1h: number;
  change6h: number;
  change24h: number;
  liquidity: string;
  marketCap: string;
}

export interface GlobalStats {
  volume24h: string;
  txns24h: string;
  marketCap: string;
  activeTokens: number;
}

export interface MarketFilters {
  timeframe: string;
  sortBy: string;
  blockchain: string;
  searchQuery: string;
}

// Mock API functions - replace with real API calls
const fetchTokenData = async (filters: MarketFilters): Promise<TokenData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock data generation
  const mockTokens: TokenData[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    rank: i + 1,
    token: {
      symbol: ['MOVEMENT', 'PEPE', 'DOGE', 'SHIB', 'BONK', 'WIF', 'FLOKI', 'MEME'][i % 8],
      pair: ['SOL', 'ETH', 'BSC', 'BASE'][i % 4],
      name: `${['Movement', 'Pepe', 'Dogecoin', 'Shiba', 'Bonk', 'Wif', 'Floki', 'Meme'][i % 8]} Coin`,
      icon: ['🟢', '🐸', '🐕', '🐕', '🐕', '🐕', '🐕', '🐕'][i % 8],
      tag: `$${(Math.random() * 1000).toFixed(0)}`
    },
    price: `$${(Math.random() * 0.01).toFixed(7)}`,
    age: `${Math.floor(Math.random() * 24)}h`,
    txns: (Math.random() * 100000).toFixed(0),
    volume: `$${(Math.random() * 10).toFixed(1)}M`,
    makers: (Math.random() * 20000).toFixed(0),
    change5m: (Math.random() - 0.5) * 10,
    change1h: (Math.random() - 0.5) * 20,
    change6h: (Math.random() - 0.5) * 50,
    change24h: (Math.random() - 0.5) * 100,
    liquidity: `$${(Math.random() * 500).toFixed(0)}K`,
    marketCap: `$${(Math.random() * 2000).toFixed(0)}K`
  }));

  // Apply filters
  let filtered = mockTokens;
  
  if (filters.searchQuery) {
    filtered = filtered.filter(token => 
      token.token.symbol.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      token.token.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      token.token.pair.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
  }

  if (filters.blockchain && filters.blockchain !== 'all') {
    filtered = filtered.filter(token => 
      token.token.pair.toLowerCase() === filters.blockchain.toLowerCase()
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'volume':
      filtered.sort((a, b) => parseFloat(b.volume.replace('$', '').replace('M', '')) - parseFloat(a.volume.replace('$', '').replace('M', '')));
      break;
    case 'change24h':
      filtered.sort((a, b) => b.change24h - a.change24h);
      break;
    case 'txns':
      filtered.sort((a, b) => parseInt(b.txns.replace(',', '')) - parseInt(a.txns.replace(',', '')));
      break;
    default:
      // Default sort by rank
      break;
  }

  return filtered;
};

const fetchGlobalStats = async (): Promise<GlobalStats> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return {
    volume24h: `$${(Math.random() * 50 + 20).toFixed(2)}B`,
    txns24h: (Math.random() * 10000000 + 30000000).toFixed(0),
    marketCap: `$${(Math.random() * 2000 + 1000).toFixed(2)}B`,
    activeTokens: Math.floor(Math.random() * 10000 + 50000)
  };
};

// WebSocket hook for real-time updates
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, [url, socket]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setIsConnected(false);
  }, [socket]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket,
    isConnected,
    lastMessage,
    connect,
    disconnect
  };
};

// Main data hook with caching and real-time updates
export const useApexSwapData = (filters: MarketFilters) => {
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Query for token data with caching
  const {
    data: tokenData,
    isLoading: tokensLoading,
    error: tokensError,
    refetch: refetchTokens
  } = useQuery({
    queryKey: ['tokens', filters],
    queryFn: () => fetchTokenData(filters),
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Query for global stats
  const {
    data: globalStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['globalStats'],
    queryFn: fetchGlobalStats,
    staleTime: 60000, // 1 minute
    cacheTime: 600000, // 10 minutes
    refetchInterval: 60000, // Refetch every minute
  });

  // WebSocket for real-time updates
  const { isConnected, lastMessage } = useWebSocket('wss://api.apexswap.com/ws');

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'tokenUpdate') {
        // Update specific token data
        queryClient.setQueryData(['tokens', filters], (oldData: TokenData[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(token => 
            token.id === lastMessage.tokenId 
              ? { ...token, ...lastMessage.data }
              : token
          );
        });
      } else if (lastMessage.type === 'globalStats') {
        // Update global stats
        queryClient.setQueryData(['globalStats'], lastMessage.data);
      }
      setLastUpdate(Date.now());
    }
  }, [lastMessage, queryClient, filters]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await Promise.all([
      refetchTokens(),
      refetchStats()
    ]);
    setLastUpdate(Date.now());
  }, [refetchTokens, refetchStats]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected) {
        refresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [refresh, isConnected]);

  return {
    tokenData: tokenData || [],
    globalStats: globalStats || {
      volume24h: '$0.00B',
      txns24h: '0',
      marketCap: '$0.00B',
      activeTokens: 0
    },
    isLoading: tokensLoading || statsLoading,
    error: tokensError || statsError,
    isConnected,
    lastUpdate,
    refresh
  };
};

// Hook for search functionality with debouncing
export const useSearch = (initialQuery: string = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  return {
    query,
    setQuery,
    debouncedQuery
  };
};

// Hook for managing filters
export const useFilters = () => {
  const [filters, setFilters] = useState<MarketFilters>({
    timeframe: '24H',
    sortBy: 'rank',
    blockchain: 'all',
    searchQuery: ''
  });

  const updateFilter = useCallback((key: keyof MarketFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      timeframe: '24H',
      sortBy: 'rank',
      blockchain: 'all',
      searchQuery: ''
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters
  };
};
