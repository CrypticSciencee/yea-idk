import { useState, useEffect, useCallback } from 'react';
import { marketDataManager, MarketDataSubscription } from '@/lib/websocket/market-data';

export interface TradingPair {
  id: string;
  symbol: string;
  baseSymbol: string;
  quoteSymbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  exchange: string;
}

export interface Trade {
  id: string;
  time: number;
  side: 'BUY' | 'SELL';
  price: number;
  amount: number;
  notional: number;
  exchange: string;
}

export interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface OrderBook {
  bids: [number, number][];
  asks: [number, number][];
  lastUpdateId: number;
}
export function useMarketData() {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, string>>({});

  const loadMarketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketDataManager.getMarketData();
      setPairs(data);
      
      // Update connection status
      const status = marketDataManager.getConnectionStatus();
      setConnectionStatus(status);
    } catch (err) {
      console.error('Failed to load market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load market data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarketData();
    
    // Check connection status periodically
    const statusInterval = setInterval(() => {
      const status = marketDataManager.getConnectionStatus();
      setConnectionStatus(status);
    }, 5000);
    
    return () => clearInterval(statusInterval);
  }, [loadMarketData]);

  return {
    pairs,
    loading,
    error,
    connectionStatus,
    refresh: loadMarketData,
  };
}

export function usePairData(symbol: string) {
  const [price, setPrice] = useState<number>(0);
  const [change24h, setChange24h] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const subscription: MarketDataSubscription = {
      symbol,
      onPriceUpdate: (newPrice, newChange24h) => {
        setPrice(newPrice);
        setChange24h(newChange24h);
      },
      onVolumeUpdate: (newVolume) => {
        setVolume(newVolume);
      },
      onTradeUpdate: (trade) => {
        setTrades(prev => [trade, ...prev.slice(0, 49)]); // Keep last 50 trades
      },
      onOrderBookUpdate: (newOrderBook) => {
        setOrderBook(newOrderBook);
      },
    };

    const unsubscribe = marketDataManager.subscribe(subscription);
    return unsubscribe;
  }, [symbol]);

  return {
    price,
    change24h,
    volume,
    trades,
    orderBook,
  };
}

export function useChartData(symbol: string, interval: string = '1h') {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChartData = useCallback(async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await marketDataManager.getChartData(symbol, interval);
      setChartData(data);
    } catch (err) {
      console.error('Failed to load chart data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  // Subscribe to real-time chart updates
  useEffect(() => {
    if (!symbol) return;

    const subscription: MarketDataSubscription = {
      symbol,
      onChartUpdate: (candle) => {
        setChartData(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          
          if (lastIndex >= 0 && updated[lastIndex].time === candle.time) {
            // Update existing candle
            updated[lastIndex] = candle;
          } else {
            // Add new candle
            updated.push(candle);
          }
          
          return updated.slice(-500); // Keep last 500 candles
        });
      },
    };

    const unsubscribe = marketDataManager.subscribe(subscription);
    return unsubscribe;
  }, [symbol]);

  return {
    chartData,
    loading,
    error,
    refresh: loadChartData,
  };
}