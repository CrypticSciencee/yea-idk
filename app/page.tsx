import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  ChartBar,
  Wallet,
  Lock
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0f16]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
              Non-Custodial • US-Only • KYC Verified
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
              Trade Crypto with
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}Confidence
              </span>
            </h1>
            
            <p className="mt-8 text-xl text-slate-300 max-w-3xl mx-auto">
              ApexSwap is a professional-grade, non-custodial cryptocurrency exchange 
              offering DEX aggregation across Solana and EVM chains. Your keys, your crypto.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/app">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white text-lg px-8 py-4 h-14">
                  Start Trading
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/invest">
                <Button variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800 text-lg px-8 py-4 h-14">
                  <ChartBar className="mr-2 h-5 w-5" />
                  Invest Simple
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0e1420]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Built for Serious Traders
            </h2>
            <p className="mt-4 text-xl text-slate-400">
              Professional tools, institutional-grade security, retail-friendly experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Non-Custodial */}
            <div className="bg-[#0b0f16] border border-[#121826] rounded-2xl p-8 hover:border-cyan-500/20 transition-colors">
              <div className="h-12 w-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Non-Custodial</h3>
              <p className="text-slate-400 mb-6">
                Your private keys never leave your device. ApexSwap never has access to your funds or can freeze your assets.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  Client-side key management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  No fund custody ever
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  Passkey support (WebAuthn)
                </li>
              </ul>
            </div>

            {/* DEX Aggregation */}
            <div className="bg-[#0b0f16] border border-[#121826] rounded-2xl p-8 hover:border-cyan-500/20 transition-colors">
              <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Best Execution</h3>
              <p className="text-slate-400 mb-6">
                Advanced DEX aggregation across multiple chains ensures you get the best prices for every trade.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  Jupiter (Solana) integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  0x Protocol (EVM) routing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  Optimal price discovery
                </li>
              </ul>
            </div>

            {/* Compliance */}
            <div className="bg-[#0b0f16] border border-[#121826] rounded-2xl p-8 hover:border-cyan-500/20 transition-colors">
              <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Compliant & Secure</h3>
              <p className="text-slate-400 mb-6">
                US-only access with comprehensive KYC verification and regulatory compliance built-in.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  Persona KYC integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  OFAC compliance screening
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  US-only (excluding NY)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Experiences */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Two Ways to Trade
            </h2>
            <p className="mt-4 text-xl text-slate-400">
              Choose the experience that matches your trading style and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* TRADER Experience */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">TRADER</h3>
                  <p className="text-cyan-400 font-medium">Professional Interface</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Advanced interface designed for experienced traders who need comprehensive market data, 
                professional charts, and granular control over their trades.
              </p>
              
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-center">
                  <ChartBar className="h-5 w-5 text-cyan-400 mr-3" />
                  TradingView-style candlestick charts
                </li>
                <li className="flex items-center">
                  <Globe className="h-5 w-5 text-cyan-400 mr-3" />
                  Multi-chain DEX aggregation
                </li>
                <li className="flex items-center">
                  <Zap className="h-5 w-5 text-cyan-400 mr-3" />
                  Real-time market data & orderbook
                </li>
              </ul>
              
              <Link href="/swap">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
                  Launch Pro Trading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* INVESTOR Experience */}
            <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mr-4">
                  <Wallet className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">INVESTOR</h3>
                  <p className="text-green-400 font-medium">Simplified Experience</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Clean, educational interface focused on major cryptocurrencies with sensible defaults 
                and built-in guidance for new and casual investors.
              </p>
              
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-center">
                  <Shield className="h-5 w-5 text-green-400 mr-3" />
                  Curated major cryptocurrencies only
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Conservative defaults & risk management
                </li>
                <li className="flex items-center">
                  <Globe className="h-5 w-5 text-green-400 mr-3" />
                  Educational tooltips & guidance
                </li>
              </ul>
              
              <Link href="/invest">
                <Button className="w-full bg-green-600 hover:bg-green-500 text-white">
                  Start Simple Investing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-16 bg-[#0e1420] border-t border-[#121826]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Important Disclaimers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400">
              <div>
                <p className="mb-2">
                  <strong className="text-slate-300">Geographic Restrictions:</strong> ApexSwap is available 
                  to US residents only, excluding New York State residents. Access is restricted in OFAC-sanctioned countries.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-slate-300">KYC Required:</strong> Identity verification through 
                  our partner Persona is mandatory before trading. This helps us maintain regulatory compliance.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-slate-300">Non-Custodial:</strong> ApexSwap never holds your private 
                  keys or funds. We provide DEX aggregation services only.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-slate-300">Risk Warning:</strong> Cryptocurrency trading involves 
                  substantial risk. Past performance does not guarantee future results.
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
              <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
                <Link href="/legal/tos" className="hover:text-slate-400">Terms of Service</Link>
                <Link href="/legal/privacy" className="hover:text-slate-400">Privacy Policy</Link>
                <Link href="/legal/risk" className="hover:text-slate-400">Risk Disclosure</Link>
                <span>© 2025 ApexSwap. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}