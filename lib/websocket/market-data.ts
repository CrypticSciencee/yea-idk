export interface MarketDataSubscription {
  symbol: string;
  onPriceUpdate?: (price: number, change24h: number) => void;
  onTradeUpdate?: (trade: Trade) => void;
  onChartUpdate?: (candle: ChartData) => void;
  onVolumeUpdate?: (volume: number) => void;
  onOrderBookUpdate?: (orderbook: OrderBook) => void;
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
  bids: [number, number][]; // [price, quantity]
  asks: [number, number][]; // [price, quantity]
  lastUpdateId: number;
}

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

// Real exchange API configurations
const EXCHANGE_CONFIGS = {
  binance: {
    wsUrl: 'wss://stream.binance.com:9443/ws',
    restUrl: 'https://api.binance.com/api/v3',
    name: 'Binance',
  },
  coinbase: {
    wsUrl: 'wss://ws-feed.pro.coinbase.com',
    restUrl: 'https://api.pro.coinbase.com',
    name: 'Coinbase Pro',
  },
  kraken: {
    wsUrl: 'wss://ws.kraken.com',
    restUrl: 'https://api.kraken.com/0/public',
    name: 'Kraken',
  },
};

export class RealMarketDataManager {
  private subscriptions: Map<string, MarketDataSubscription[]> = new Map();
  private connections: Map<string, WebSocket> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isClient = typeof window !== 'undefined';
  private heartbeatIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    if (this.isClient) {
      console.log('🚀 Initializing Real Market Data Manager');
      this.initializeExchangeConnections();
    }
  }

  private initializeExchangeConnections() {
    // Initialize connections to multiple exchanges
    Object.entries(EXCHANGE_CONFIGS).forEach(([exchange, config]) => {
      this.connectToExchange(exchange, config);
    });
  }

  private connectToExchange(exchange: string, config: any) {
    try {
      console.log(`🔗 Connecting to ${config.name}...`);
      
      const ws = new WebSocket(config.wsUrl);
      this.connections.set(exchange, ws);

      ws.onopen = () => {
        console.log(`✅ Connected to ${config.name}`);
        this.reconnectAttempts.set(exchange, 0);
        this.startHeartbeat(exchange);
        this.subscribeToStreams(exchange, ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleExchangeMessage(exchange, data);
        } catch (error) {
          console.error(`Error parsing ${config.name} message:`, error);
        }
      };

      ws.onerror = (error) => {
        console.error(`${config.name} WebSocket error:`, error);
      };

      ws.onclose = () => {
        console.log(`${config.name} WebSocket disconnected`);
        this.stopHeartbeat(exchange);
        this.reconnectToExchange(exchange, config);
      };

    } catch (error) {
      console.error(`Failed to connect to ${config.name}:`, error);
    }
  }

  private subscribeToStreams(exchange: string, ws: WebSocket) {
    if (exchange === 'binance') {
      // Subscribe to Binance streams
      const subscribeMessage = {
        method: 'SUBSCRIBE',
        params: [
          'btcusdt@trade',
          'ethusdt@trade', 
          'solusdt@trade',
          'adausdt@trade',
          'dotusdt@trade',
          'btcusdt@ticker',
          'ethusdt@ticker',
          'solusdt@ticker',
          'btcusdt@depth20@100ms',
          'ethusdt@depth20@100ms',
          'solusdt@depth20@100ms'
        ],
        id: 1
      };
      ws.send(JSON.stringify(subscribeMessage));
    } else if (exchange === 'coinbase') {
      // Subscribe to Coinbase Pro feeds
      const subscribeMessage = {
        type: 'subscribe',
        product_ids: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD'],
        channels: ['matches', 'ticker', 'level2']
      };
      ws.send(JSON.stringify(subscribeMessage));
    } else if (exchange === 'kraken') {
      // Subscribe to Kraken feeds
      const subscribeMessage = {
        event: 'subscribe',
        pair: ['XBT/USD', 'ETH/USD', 'SOL/USD', 'ADA/USD'],
        subscription: { name: 'trade' }
      };
      ws.send(JSON.stringify(subscribeMessage));
    }
  }

  private handleExchangeMessage(exchange: string, data: any) {
    try {
      if (exchange === 'binance') {
        this.handleBinanceMessage(data);
      } else if (exchange === 'coinbase') {
        this.handleCoinbaseMessage(data);
      } else if (exchange === 'kraken') {
        this.handleKrakenMessage(data);
      }
    } catch (error) {
      console.error(`Error handling ${exchange} message:`, error);
    }
  }

  private handleBinanceMessage(data: any) {
    if (data.e === 'trade') {
      // Real trade data from Binance
      const trade: Trade = {
        id: `binance-${data.t}`,
        time: data.T,
        side: data.m ? 'SELL' : 'BUY', // m = true means market maker (sell)
        price: parseFloat(data.p),
        amount: parseFloat(data.q),
        notional: parseFloat(data.p) * parseFloat(data.q),
        exchange: 'Binance'
      };

      const symbol = this.normalizeBinanceSymbol(data.s);
      this.notifyTradeSubscribers(symbol, trade);

    } else if (data.e === '24hrTicker') {
      // 24hr ticker data
      const symbol = this.normalizeBinanceSymbol(data.s);
      const price = parseFloat(data.c);
      const change24h = parseFloat(data.P);
      const volume = parseFloat(data.v);

      this.notifyPriceSubscribers(symbol, price, change24h);
      this.notifyVolumeSubscribers(symbol, volume);

    } else if (data.e === 'depthUpdate') {
      // Order book updates
      const symbol = this.normalizeBinanceSymbol(data.s);
      const orderbook: OrderBook = {
        bids: data.b.map((bid: string[]) => [parseFloat(bid[0]), parseFloat(bid[1])]),
        asks: data.a.map((ask: string[]) => [parseFloat(ask[0]), parseFloat(ask[1])]),
        lastUpdateId: data.u
      };

      this.notifyOrderBookSubscribers(symbol, orderbook);
    }
  }

  private handleCoinbaseMessage(data: any) {
    if (data.type === 'match') {
      // Real trade from Coinbase Pro
      const trade: Trade = {
        id: `coinbase-${data.trade_id}`,
        time: new Date(data.time).getTime(),
        side: data.side.toUpperCase() as 'BUY' | 'SELL',
        price: parseFloat(data.price),
        amount: parseFloat(data.size),
        notional: parseFloat(data.price) * parseFloat(data.size),
        exchange: 'Coinbase Pro'
      };

      const symbol = this.normalizeCoinbaseSymbol(data.product_id);
      this.notifyTradeSubscribers(symbol, trade);

    } else if (data.type === 'ticker') {
      // Ticker updates
      const symbol = this.normalizeCoinbaseSymbol(data.product_id);
      const price = parseFloat(data.price);
      const change24h = parseFloat(data.open_24h) ? 
        ((price - parseFloat(data.open_24h)) / parseFloat(data.open_24h)) * 100 : 0;
      const volume = parseFloat(data.volume_24h);

      this.notifyPriceSubscribers(symbol, price, change24h);
      this.notifyVolumeSubscribers(symbol, volume);

    } else if (data.type === 'l2update') {
      // Level 2 order book updates
      const symbol = this.normalizeCoinbaseSymbol(data.product_id);
      const orderbook: OrderBook = {
        bids: data.changes.filter((c: any) => c[0] === 'buy').map((c: any) => [parseFloat(c[1]), parseFloat(c[2])]),
        asks: data.changes.filter((c: any) => c[0] === 'sell').map((c: any) => [parseFloat(c[1]), parseFloat(c[2])]),
        lastUpdateId: Date.now()
      };

      this.notifyOrderBookSubscribers(symbol, orderbook);
    }
  }

  private handleKrakenMessage(data: any) {
    if (Array.isArray(data) && data[1] && data[2] === 'trade') {
      // Real trade from Kraken
      const trades = data[1];
      const pair = data[3];
      
      trades.forEach((tradeData: any) => {
        const trade: Trade = {
          id: `kraken-${Date.now()}-${Math.random()}`,
          time: Math.floor(parseFloat(tradeData[2]) * 1000),
          side: tradeData[3] === 'b' ? 'BUY' : 'SELL',
          price: parseFloat(tradeData[0]),
          amount: parseFloat(tradeData[1]),
          notional: parseFloat(tradeData[0]) * parseFloat(tradeData[1]),
          exchange: 'Kraken'
        };

        const symbol = this.normalizeKrakenSymbol(pair);
        this.notifyTradeSubscribers(symbol, trade);
      });
    }
  }

  // Symbol normalization methods
  private normalizeBinanceSymbol(symbol: string): string {
    const normalized = symbol.replace('USDT', '-USDT').replace('USDC', '-USDC');
    return normalized.toUpperCase();
  }

  private normalizeCoinbaseSymbol(symbol: string): string {
    return symbol.replace('-USD', '-USDT').toUpperCase();
  }

  private normalizeKrakenSymbol(symbol: string): string {
    return symbol.replace('XBT', 'BTC').replace('/USD', '-USDT').toUpperCase();
  }

  // Notification methods
  private notifyTradeSubscribers(symbol: string, trade: Trade) {
    const subs = this.subscriptions.get(symbol) || [];
    subs.forEach(sub => sub.onTradeUpdate?.(trade));
  }

  private notifyPriceSubscribers(symbol: string, price: number, change24h: number) {
    const subs = this.subscriptions.get(symbol) || [];
    subs.forEach(sub => sub.onPriceUpdate?.(price, change24h));
  }

  private notifyVolumeSubscribers(symbol: string, volume: number) {
    const subs = this.subscriptions.get(symbol) || [];
    subs.forEach(sub => sub.onVolumeUpdate?.(volume));
  }

  private notifyOrderBookSubscribers(symbol: string, orderbook: OrderBook) {
    const subs = this.subscriptions.get(symbol) || [];
    subs.forEach(sub => sub.onOrderBookUpdate?.(orderbook));
  }

  private startHeartbeat(exchange: string) {
    const interval = setInterval(() => {
      const ws = this.connections.get(exchange);
      if (ws?.readyState === WebSocket.OPEN) {
        if (exchange === 'binance') {
          ws.send(JSON.stringify({ method: 'LIST_SUBSCRIPTIONS', id: 2 }));
        } else if (exchange === 'coinbase') {
          ws.send(JSON.stringify({ type: 'heartbeat', on: true }));
        }
      }
    }, 30000);

    this.heartbeatIntervals.set(exchange, interval);
  }

  private stopHeartbeat(exchange: string) {
    const interval = this.heartbeatIntervals.get(exchange);
    if (interval) {
      clearInterval(interval);
      this.heartbeatIntervals.delete(exchange);
    }
  }

  private reconnectToExchange(exchange: string, config: any) {
    const attempts = this.reconnectAttempts.get(exchange) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, attempts);
      
      setTimeout(() => {
        console.log(`🔄 Reconnecting to ${config.name} (attempt ${attempts + 1})`);
        this.reconnectAttempts.set(exchange, attempts + 1);
        this.connectToExchange(exchange, config);
      }, delay);
    } else {
      console.error(`❌ Max reconnection attempts reached for ${config.name}`);
    }
  }

  subscribe(subscription: MarketDataSubscription): () => void {
    const { symbol } = subscription;
    
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, []);
    }
    
    this.subscriptions.get(symbol)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(symbol);
      if (subs) {
        const index = subs.indexOf(subscription);
        if (index > -1) {
          subs.splice(index, 1);
        }
        if (subs.length === 0) {
          this.subscriptions.delete(symbol);
        }
      }
    };
  }

  // Get real market data from REST APIs
  async getMarketData(): Promise<TradingPair[]> {
    try {
      console.log('📈 Fetching real market data from exchanges');
      
      const pairs: TradingPair[] = [];
      
      // Fetch from Binance REST API
      try {
        const response = await fetch(`${EXCHANGE_CONFIGS.binance.restUrl}/ticker/24hr`);
        const binanceData = await response.json();
        
        const majorPairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT'];
        
        binanceData
          .filter((ticker: any) => majorPairs.includes(ticker.symbol))
          .forEach((ticker: any) => {
            pairs.push({
              id: this.normalizeBinanceSymbol(ticker.symbol),
              symbol: this.normalizeBinanceSymbol(ticker.symbol),
              baseSymbol: ticker.symbol.replace('USDT', ''),
              quoteSymbol: 'USDT',
              price: parseFloat(ticker.lastPrice),
              change24h: parseFloat(ticker.priceChangePercent),
              volume24h: parseFloat(ticker.quoteVolume),
              high24h: parseFloat(ticker.highPrice),
              low24h: parseFloat(ticker.lowPrice),
              exchange: 'Binance'
            });
          });
      } catch (error) {
        console.error('Error fetching Binance data:', error);
      }

      // Fetch from Coinbase Pro REST API
      try {
        const products = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD'];
        
        for (const product of products) {
          const [tickerResponse, statsResponse] = await Promise.all([
            fetch(`${EXCHANGE_CONFIGS.coinbase.restUrl}/products/${product}/ticker`),
            fetch(`${EXCHANGE_CONFIGS.coinbase.restUrl}/products/${product}/stats`)
          ]);
          
          const ticker = await tickerResponse.json();
          const stats = await statsResponse.json();
          
          pairs.push({
            id: this.normalizeCoinbaseSymbol(product),
            symbol: this.normalizeCoinbaseSymbol(product),
            baseSymbol: product.split('-')[0],
            quoteSymbol: 'USDT',
            price: parseFloat(ticker.price),
            change24h: stats.open ? ((parseFloat(ticker.price) - parseFloat(stats.open)) / parseFloat(stats.open)) * 100 : 0,
            volume24h: parseFloat(stats.volume),
            high24h: parseFloat(stats.high),
            low24h: parseFloat(stats.low),
            exchange: 'Coinbase Pro'
          });
        }
      } catch (error) {
        console.error('Error fetching Coinbase data:', error);
      }

      return pairs;
    } catch (error) {
      console.error('Error loading real market data:', error);
      throw error;
    }
  }

  // Get real chart data
  async getChartData(symbol: string, interval: string = '1h', limit: number = 100): Promise<ChartData[]> {
    try {
      console.log(`📊 Fetching real chart data for ${symbol}`);
      
      // Convert symbol back to exchange format
      const binanceSymbol = symbol.replace('-USDT', 'USDT');
      
      const response = await fetch(
        `${EXCHANGE_CONFIGS.binance.restUrl}/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`
      );
      
      const klines = await response.json();
      
      return klines.map((kline: any) => ({
        time: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5])
      }));
    } catch (error) {
      console.error('Error fetching real chart data:', error);
      throw error;
    }
  }

  disconnect() {
    console.log('🔌 Disconnecting from all exchanges');
    
    this.heartbeatIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.heartbeatIntervals.clear();
    
    this.connections.forEach((ws) => {
      ws.close();
    });
    this.connections.clear();
    
    this.subscriptions.clear();
  }

  getConnectionStatus(): Record<string, 'connecting' | 'connected' | 'disconnected' | 'error'> {
    const status: Record<string, 'connecting' | 'connected' | 'disconnected' | 'error'> = {};
    
    this.connections.forEach((ws, exchange) => {
      switch (ws.readyState) {
        case WebSocket.CONNECTING:
          status[exchange] = 'connecting';
          break;
        case WebSocket.OPEN:
          status[exchange] = 'connected';
          break;
        case WebSocket.CLOSING:
        case WebSocket.CLOSED:
          status[exchange] = 'disconnected';
          break;
        default:
          status[exchange] = 'error';
      }
    });
    
    return status;
  }
}

// Export singleton instance
export const marketDataManager = new RealMarketDataManager();