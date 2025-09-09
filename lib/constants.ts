// Supported chains
export const SUPPORTED_CHAINS = {
  // Ethereum Mainnet
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: (() => {
      try {
        return process.env.EVM_RPC_URLS ? JSON.parse(process.env.EVM_RPC_URLS)['1'] : '';
      } catch {
        return '';
      }
    })(),
    blockExplorer: 'https://etherscan.io',
  },
  // Polygon
  137: {
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: (() => {
      try {
        return process.env.EVM_RPC_URLS ? JSON.parse(process.env.EVM_RPC_URLS)['137'] : '';
      } catch {
        return '';
      }
    })(),
    blockExplorer: 'https://polygonscan.com',
  },
  // Arbitrum One
  42161: {
    name: 'Arbitrum One',
    symbol: 'ARB',
    rpcUrl: (() => {
      try {
        return process.env.EVM_RPC_URLS ? JSON.parse(process.env.EVM_RPC_URLS)['42161'] : '';
      } catch {
        return '';
      }
    })(),
    blockExplorer: 'https://arbiscan.io',
  },
  // Optimism
  10: {
    name: 'Optimism',
    symbol: 'OP',
    rpcUrl: (() => {
      try {
        return process.env.EVM_RPC_URLS ? JSON.parse(process.env.EVM_RPC_URLS)['10'] : '';
      } catch {
        return '';
      }
    })(),
    blockExplorer: 'https://optimistic.etherscan.io',
  },
} as const;

// Solana network
export const SOLANA_NETWORK = {
  name: 'Solana',
  symbol: 'SOL',
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  blockExplorer: 'https://explorer.solana.com',
};

// Major tokens for INVESTOR experience
export const MAJOR_TOKENS = [
  {
    symbol: 'BTC',
    name: 'Bitcoin (Wrapped)',
    description: 'The original cryptocurrency, wrapped for use on other blockchains',
    addresses: {
      1: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC on Ethereum
      137: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', // WBTC on Polygon
    }
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    description: 'Leading smart contract platform and digital currency',
    addresses: {
      1: '0x0000000000000000000000000000000000000000', // Native ETH
      137: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH on Polygon
    }
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    description: 'Fully backed US dollar stablecoin',
    addresses: {
      1: '0xA0b86a33E6417c4cCa7E392C38Ea4e4f0a8e9A99', // USDC on Ethereum
      137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
      sol: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
    }
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    description: 'High-performance blockchain for decentralized applications',
    addresses: {
      sol: 'So11111111111111111111111111111111111111112', // Native SOL
    }
  },
];

// Default slippage values (in basis points)
export const DEFAULT_SLIPPAGE = {
  CONSERVATIVE: 50, // 0.5%
  NORMAL: 100,      // 1.0%
  AGGRESSIVE: 300,  // 3.0%
};

// Rate limiting
export const RATE_LIMITS = {
  QUOTE: { requests: 60, windowMs: 60000 }, // 60 requests per minute
  SWAP: { requests: 10, windowMs: 60000 },  // 10 swaps per minute
  KYC: { requests: 5, windowMs: 300000 },   // 5 KYC attempts per 5 minutes
};

// Compliance
export const BLOCKED_COUNTRIES = [
  'US-NY', // New York State
  'CU',    // Cuba
  'IR',    // Iran
  'KP',    // North Korea
  'SY',    // Syria
  'RU',    // Russia (OFAC)
];

export const ALLOWED_US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD',
  'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

// On-ramp providers
export const ONRAMP_PROVIDERS = {
  stripe: {
    name: 'Stripe',
    description: 'Bank transfer and card payments',
    minAmount: 1,
    maxAmount: 50000,
    supportedCurrencies: ['USD'],
    fees: 'Bank: 0.8% + $5, Card: 2.9% + $0.30'
  },
  moonpay: {
    name: 'MoonPay',
    description: 'Global card and bank payments',
    minAmount: 20,
    maxAmount: 50000,
    supportedCurrencies: ['USD'],
    fees: 'Card: ~4.5%, Bank: ~1%'
  },
  ramp: {
    name: 'Ramp',
    description: 'Fast card and bank transfers',
    minAmount: 50,
    maxAmount: 20000,
    supportedCurrencies: ['USD'],
    fees: '0.49% - 2.9% depending on method'
  },
  sardine: {
    name: 'Sardine',
    description: 'ACH and instant payments',
    minAmount: 1,
    maxAmount: 10000,
    supportedCurrencies: ['USD'],
    fees: 'ACH: 1%, Instant: 3.5%'
  }
};

// Chart timeframes
export const CHART_TIMEFRAMES = [
  { label: '5m', value: 300, display: '5m' },
  { label: '15m', value: 900, display: '15m' },
  { label: '1h', value: 3600, display: '1h' },
  { label: '4h', value: 14400, display: '4h' },
  { label: '1d', value: 86400, display: '1d' },
];

// UI Constants
export const UI_CONFIG = {
  CHART_HEIGHT: 560,
  SIDEBAR_WIDTH: 320,
  HEADER_HEIGHT: 64,
  ANIMATION_DURATION: 200,
};

// Error messages
export const ERROR_MESSAGES = {
  GEOFENCE_BLOCKED: 'Access from your location is not permitted. ApexSwap is available to US residents only, excluding New York.',
  KYC_REQUIRED: 'Identity verification is required before you can trade. Please complete KYC verification.',
  KYC_PENDING: 'Your identity verification is being reviewed. This usually takes 5-10 minutes.',
  KYC_DECLINED: 'Identity verification was unsuccessful. Please check your information and try again.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  SLIPPAGE_TOO_HIGH: 'Price moved beyond your slippage tolerance. Try increasing slippage or reducing trade size.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  QUOTE_EXPIRED: 'Quote has expired. Please request a new quote.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again or contact support.',
};