import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  PieChart, 
  Wallet, 
  ShieldCheck, 
  Clock, 
  XCircle,
  ArrowRight,
  Plus,
  Activity
} from 'lucide-react';

export default function AppDashboard() {
  // Mock user data - replace with real data
  const kycStatus: 'pending' | 'approved' | 'declined' | 'resubmit' = 'pending';
  const hasWallet = false;
  
  const getKycStatusInfo = () => {
    switch (kycStatus) {
      case 'approved':
        return {
          icon: ShieldCheck,
          text: 'Verified',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Verification Pending',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        };
      case 'declined':
      case 'resubmit':
        return {
          icon: XCircle,
          text: 'Verification Failed',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20'
        };
      default:
        return {
          icon: Clock,
          text: 'Not Started',
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/20'
        };
    }
  };

  const kycStatusInfo = getKycStatusInfo();
  const StatusIcon = kycStatusInfo.icon;

  return (
    <div className="min-h-screen bg-[#0b0f16] p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome to ApexSwap</h1>
            <p className="text-slate-400 mt-1">Your non-custodial crypto trading dashboard</p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/swap">
              <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trade
              </Button>
            </Link>
            <Link href="/invest">
              <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                <PieChart className="h-4 w-4 mr-2" />
                Invest
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Status */}
          <Card className="bg-[#0e1420] border-[#121826]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Wallet className="h-5 w-5 mr-2" />
                Wallet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasWallet ? (
                <div className="space-y-3">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <div className="text-sm text-slate-400">
                    <p className="mb-1">EVM: 0x1234...5678</p>
                    <p>Solana: Not connected</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Solana Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-400">
                    Connect your wallet to start trading. Your keys remain secure on your device.
                  </p>
                  <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                  <div className="text-xs text-slate-500">
                    Non-custodial • Your keys, your crypto
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* KYC Status */}
          <Card className={`bg-[#0e1420] border ${kycStatusInfo.borderColor}`}>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <ShieldCheck className="h-5 w-5 mr-2" />
                Identity Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Badge className={`${kycStatusInfo.bgColor} ${kycStatusInfo.color} border ${kycStatusInfo.borderColor}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {kycStatusInfo.text}
                </Badge>
                
                {kycStatus === 'pending' && (
                  <p className="text-sm text-slate-400">
                    Your identity verification is being reviewed. This usually takes 5-10 minutes.
                  </p>
                )}
                
                {kycStatus === 'declined' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400">
                      Identity verification was unsuccessful. Please review your information and try again.
                    </p>
                    <Link href="/kyc">
                      <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                        Retry Verification
                      </Button>
                    </Link>
                  </div>
                )}
                
                {kycStatus === 'approved' && (
                  <p className="text-sm text-slate-400">
                    ✅ You're all set! Trading and on-ramp features are now available.
                  </p>
                )}

                {!kycStatus || kycStatus === 'pending' ? (
                  <Link href="/kyc">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                      {kycStatus === 'pending' ? 'Check Status' : 'Start Verification'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Experiences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TRADER Experience */}
          <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="h-6 w-6 mr-3 text-cyan-400" />
                <div>
                  <div className="text-xl">TRADER</div>
                  <div className="text-sm text-cyan-400 font-normal">Professional Interface</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300">
                Advanced trading interface with comprehensive charts, market data, and granular controls. 
                Built for experienced traders who need professional-grade tools.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-300">
                  <Activity className="h-4 w-4 mr-3 text-cyan-400" />
                  TradingView-style candlestick charts
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Activity className="h-4 w-4 mr-3 text-cyan-400" />
                  Real-time orderbook and trade history
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Activity className="h-4 w-4 mr-3 text-cyan-400" />
                  Advanced order types and slippage controls
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Activity className="h-4 w-4 mr-3 text-cyan-400" />
                  Multi-chain DEX aggregation (Solana + EVM)
                </div>
              </div>

              <Link href="/swap">
                <Button 
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
                  disabled={false}
                >
                  Launch Pro Trading
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <p className="text-xs text-slate-400 text-center">
                Professional trading interface with real-time data
              </p>
            </CardContent>
          </Card>

          {/* INVESTOR Experience */}
          <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <PieChart className="h-6 w-6 mr-3 text-green-400" />
                <div>
                  <div className="text-xl">INVESTOR</div>
                  <div className="text-sm text-green-400 font-normal">Simplified Experience</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300">
                Clean, educational interface focused on major cryptocurrencies with sensible defaults. 
                Perfect for new investors and long-term holders.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-300">
                  <Activity className="h-4 w-4 mr-3 text-green-400" />
                  Curated selection of major cryptocurrencies
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Activity className="h-4 w-4 mr-3 text-green-400" />
                  Conservative defaults and risk management
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Activity className="h-4 w-4 mr-3 text-green-400" />
                  Educational tooltips and market insights
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Activity className="h-4 w-4 mr-3 text-green-400" />
                  One-click swaps with optimal routing
                </div>
              </div>

              <Link href="/invest">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-500 text-white"
                  disabled={!hasWallet || kycStatus !== 'approved'}
                >
                  Start Simple Investing
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              {(!hasWallet || kycStatus !== 'approved') && (
                <p className="text-xs text-slate-500 text-center">
                  {!hasWallet ? 'Connect wallet required' : 'KYC verification required'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-[#0e1420] border-[#121826]">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-6">No trading activity yet</p>
              <p className="text-sm text-slate-500">
                Connect your wallet and complete KYC to start trading
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}