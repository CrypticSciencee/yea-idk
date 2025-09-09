import { z } from 'zod';

// Chain types
export type ChainType = 'EVM' | 'SOL';

// KYC Status
export type KycStatus = 'pending' | 'approved' | 'declined' | 'resubmit';

// Risk levels
export type RiskLevel = 'low' | 'med' | 'high';

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
});

export const KycRecordSchema = z.object({
  userId: z.string(),
  status: z.enum(['pending', 'approved', 'declined', 'resubmit']),
  referenceId: z.string().optional(),
  updatedAt: z.date(),
});

export const WalletRefSchema = z.object({
  userId: z.string(),
  chainType: z.enum(['EVM', 'SOL']),
  address: z.string(),
  label: z.string().optional(),
  createdAt: z.date(),
});

// API Request/Response schemas
export const QuoteRequestSchema = z.object({
  chainId: z.number().optional(),
  sellToken: z.string(),
  buyToken: z.string(),
  sellAmount: z.string().optional(),
  buyAmount: z.string().optional(),
  slippageBps: z.number().min(1).max(5000).default(100),
});

export const ComplianceCheckSchema = z.object({
  address: z.string(),
  chainType: z.enum(['EVM', 'SOL']),
});

export const GeofenceCheckSchema = z.object({
  ip: z.string().optional(),
  userAttestation: z.boolean().optional(),
});

// Market data types
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId?: number;
}

export interface TradingPair {
  id: string;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  price: number;
  change24h: number;
  volume24h: number;
  liquidity?: number;
  fdv?: number;
  chain: string;
}

export interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface Trade {
  id: string;
  time: number;
  side: 'BUY' | 'SELL';
  price: number;
  amount: number;
  notional: number;
}

export interface QuoteResponse {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  price: string;
  guaranteedPrice: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyTokenToEthRate: string;
  sellTokenToEthRate: string;
  allowanceTarget?: string;
  decodedUniqueId: string;
  expectedSlippage?: string;
  sources: Array<{
    name: string;
    proportion: string;
  }>;
}

export interface SwapTransaction {
  to: string;
  data: string;
  value: string;
  gas: string;
  gasPrice: string;
}

// User preferences
export interface UserPreferences {
  slippage: number;
  theme: 'dark' | 'light';
  defaultChain: ChainType;
  showTestnets: boolean;
  expertMode: boolean;
}

// Compliance types
export interface ComplianceResult {
  allowed: boolean;
  reason?: 'NY' | 'OFAC' | 'BLOCKED' | 'OK';
  riskLevel?: RiskLevel;
  flags?: string[];
}

export interface OnRampSession {
  provider: 'stripe' | 'moonpay' | 'ramp' | 'sardine';
  sessionId: string;
  url?: string;
  clientSecret?: string;
  expiresAt: number;
}

// Error types
export class ApexSwapError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'ApexSwapError';
  }
}

export class ComplianceError extends ApexSwapError {
  constructor(message: string, userMessage?: string) {
    super(message, 'COMPLIANCE_ERROR', 403, userMessage);
  }
}

export class KYCError extends ApexSwapError {
  constructor(message: string, userMessage?: string) {
    super(message, 'KYC_ERROR', 403, userMessage);
  }
}

export class QuoteError extends ApexSwapError {
  constructor(message: string, userMessage?: string) {
    super(message, 'QUOTE_ERROR', 400, userMessage);
  }
}