# ApexSwap - Non-Custodial Crypto Exchange

## Overview

ApexSwap is a US-only (excluding New York) non-custodial cryptocurrency exchange that provides DEX aggregation across Solana and EVM chains. The platform offers two distinct experiences:

- **TRADER**: Advanced interface with comprehensive market data, charts, and pro controls
- **INVESTOR**: Simplified interface focused on major cryptocurrencies with educational guidance

## Key Features

### Non-Custodial Architecture
- **Client-side key management**: All private keys remain on the user's device
- **No custody of crypto or fiat**: ApexSwap never holds user funds
- **Smart account support**: ERC-4337 with passkeys for EVM; native keypairs for Solana

### Compliance & Security
- **KYC Required**: Persona-powered identity verification before trading
- **Geofencing**: US-only access with New York exclusions and OFAC compliance
- **Wallet screening**: Risk assessment for connected addresses

### Trading Features
- **DEX Aggregation**: Jupiter (Solana) and 0x Protocol (EVM) for optimal routing
- **Multiple On-ramps**: Stripe Crypto, MoonPay, Ramp, and Sardine integration
- **Professional Charts**: TradingView-style candlestick charts with multiple timeframes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Radix UI
- **State Management**: React Query + local state
- **Charts**: lightweight-charts (TradingView style)
- **Blockchain**: wagmi/viem (EVM), @solana/web3.js (Solana)
- **Database**: Prisma + PostgreSQL (compliance data only)
- **Cache**: Redis (rate limiting, session management)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis

### Installation

1. Clone and install dependencies:
```bash
git clone <repo-url>
cd apexswap
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys and database URLs
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

### Environment Setup

#### Required API Keys
- **0x API**: Sign up at https://0x.org/docs/api
- **Jupiter**: No API key required, uses public endpoints
- **Persona KYC**: Register at https://withpersona.com/
- **On-ramp providers**: Register with each provider individually

#### Database Configuration
The application only stores compliance and audit data:
- User profiles and KYC status
- Wallet address references (no balances)
- Compliance screening results
- Audit logs for regulatory compliance

#### Production Considerations
- Set up proper RPC endpoints (Infura, Alchemy, etc.)
- Configure webhook endpoints for KYC status updates
- Implement proper error monitoring and logging
- Set up rate limiting and DDoS protection

## Architecture

### Pages Structure
- `/` - Marketing landing page
- `/app` - Main dashboard
- `/swap` - Advanced trader interface (3-column layout)
- `/invest` - Simplified investor interface
- `/kyc` - Identity verification flow
- `/settings` - User preferences and security
- `/legal/*` - Terms, privacy policy, risk disclosures

### API Routes
- **Health**: System status checks
- **KYC**: Persona integration and status management
- **Compliance**: Geofencing and wallet screening
- **Quotes**: DEX aggregation for price discovery
- **Transactions**: Transaction building and submission
- **On-ramp**: Provider session management

### Security Model
- **No server-side key storage**: All cryptographic operations on client
- **Minimal data collection**: Only compliance-required information
- **Audit trail**: All user actions logged for regulatory compliance
- **Risk assessment**: Automated screening for sanctioned addresses

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- KYC flow validation
- Geofencing restrictions
- Quote aggregation
- Transaction building
- Error handling scenarios

## Compliance Notes

### Legal Disclaimers
- Users must be US residents (excluding NY)
- KYC verification required before trading
- Risk disclosures presented before first trade
- Terms of service and privacy policy acceptance

### Regulatory Considerations
- No investment advice provided
- Decentralized exchange aggregation only
- No order book or market making
- Full audit trail maintained

## Contributing

This is a production trading platform. All changes require:
1. Security review
2. Compliance verification
3. Comprehensive testing
4. Regulatory approval where applicable

## Support

For technical issues or compliance questions, contact: support@apexswap.com

## License

Proprietary - All rights reserved