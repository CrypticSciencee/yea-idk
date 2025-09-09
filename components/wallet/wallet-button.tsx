'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wallet, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { KycStatus } from '@/lib/types';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [kycStatus, setKycStatus] = useState<KycStatus>('pending');

  // Check KYC status when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      checkKycStatus();
    }
  }, [isConnected, address]);

  const checkKycStatus = async () => {
    try {
      const response = await fetch('/api/kyc/status');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data && data.status) {
        setKycStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to check KYC status:', error);
      // Don't update status on error, keep existing state
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getKycBadge = () => {
    switch (kycStatus) {
      case 'approved':
        return (
          <Badge variant="outline" className="border-green-500/20 text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-yellow-500/20 text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'declined':
      case 'resubmit':
        return (
          <Badge variant="outline" className="border-red-500/20 text-red-400">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        {getKycBadge()}
        <Button
          variant="outline"
          onClick={() => disconnect()}
          className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-white"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {truncateAddress(address)}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowConnectModal(true)}
        className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>

      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="bg-[#0e1420] border-[#121826] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Connect Your Wallet
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setShowConnectModal(false);
                }}
                variant="outline"
                className="w-full h-14 border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-white justify-start"
              >
                <Wallet className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{connector.name}</div>
                  <div className="text-sm text-slate-400">
                    Connect using {connector.name}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
            <div className="text-sm text-slate-400 text-center">
              <p className="font-medium mb-2">Non-Custodial Security</p>
              <p>Your keys remain on your device. ApexSwap never has access to your funds.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}