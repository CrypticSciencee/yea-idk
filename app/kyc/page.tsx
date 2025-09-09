'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Camera,
  User,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KYCPage() {
  const [showPersonaIframe, setShowPersonaIframe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'declined' | 'resubmit'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  
  // Mock user ID - in real app, get from auth context
  const userId = 'user_123';
  
  const kycData = {
    status: kycStatus,
    updatedAt: new Date().toISOString(),
  };
  
  const connectionStatus = 'connected';
  
  const checkKycStatus = async () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const startKycProcess = async () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return { clientToken: 'mock_token' };
  };
  
  const simulateStatusChange = (newStatus: typeof kycStatus) => {
    setKycStatus(newStatus);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartKyc = async () => {
    try {
      const data = await startKycProcess();
      if (data.clientToken) {
        setShowPersonaIframe(true);
      }
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0b0f16] p-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="text-white">Loading KYC Interface...</div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = useMemo(() => {
    switch (kycData.status) {
      case 'approved':
        return {
          icon: CheckCircle,
          title: 'Identity Verified',
          subtitle: 'Welcome to ApexSwap',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'Verification in Progress',
          subtitle: 'We\'re reviewing your submission',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
        };
      case 'declined':
        return {
          icon: XCircle,
          title: 'Verification Unsuccessful',
          subtitle: 'Please review and try again',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
        };
      case 'resubmit':
        return {
          icon: AlertTriangle,
          title: 'Additional Information Required',
          subtitle: 'Please complete your verification',
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/20',
        };
      default:
        return {
          icon: Shield,
          title: 'Identity Verification Required',
          subtitle: 'Get started with ApexSwap',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
        };
    }
  }, [kycData.status]);

  const statusConfig = getStatusConfig;
  const StatusIcon = statusConfig.icon;

  if (showPersonaIframe) {
    return (
      <div className="min-h-screen bg-[#0b0f16] p-6">
        <div className="mx-auto max-w-4xl">
          <div className="bg-[#0e1420] rounded-2xl border border-[#121826] overflow-hidden">
            <div className="p-6 border-b border-[#121826] bg-[#0b0f16]">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Identity Verification</h1>
                <Button
                  variant="outline"
                  onClick={() => setShowPersonaIframe(false)}
                  className="border-slate-700 text-white hover:bg-slate-800"
                >
                  Close
                </Button>
              </div>
            </div>
            
            {/* Persona iFrame would go here */}
            <div className="h-[600px] flex items-center justify-center bg-slate-800/20">
              <div className="text-center space-y-4">
                <Shield className="h-16 w-16 text-blue-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white">Persona KYC Integration</h3>
                <p className="text-slate-400 max-w-md">
                  In a real implementation, this would be the Persona hosted KYC flow iframe.
                  The integration would handle document upload, identity verification, and webhook callbacks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f16] p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Identity Verification</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            ApexSwap is required by law to verify the identity of our users. 
            This helps us maintain a secure, compliant trading environment.
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              connectionStatus === 'connected' ? 'bg-green-400' : 
              connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
            )} />
            <span className="text-xs text-slate-500">
              Real-time updates {connectionStatus}
            </span>
          </div>
        </div>

        {/* Main Status Card */}
        <Card className={`${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`h-12 w-12 ${statusConfig.bgColor} rounded-xl flex items-center justify-center`}>
                  <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{statusConfig.title}</h2>
                  <p className={`${statusConfig.color} font-medium`}>{statusConfig.subtitle}</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={checkKycStatus}
                disabled={isLoading}
                className="text-slate-400 hover:text-white"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Display */}
            {kycError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <div className="text-red-400 text-sm">{kycError}</div>
              </div>
            )}
            
            {/* Status-specific content */}
            {kycData.status === 'approved' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Identity verification complete</span>
                </div>
                <p className="text-slate-300">
                  You can now access all ApexSwap features including trading and on-ramp services.
                </p>
                <div className="flex space-x-4">
                  <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    Start Trading
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                    View Dashboard
                  </Button>
                </div>
              </div>
            )}

            {kycData.status === 'pending' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-medium">Verification in progress</span>
                </div>
                <p className="text-slate-300">
                  We're reviewing your submitted documents. This process typically takes 5-10 minutes 
                  but can take up to 24 hours during high volume periods.
                </p>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">What happens next?</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Our verification partner reviews your documents</li>
                    <li>• You'll receive an email when verification is complete</li>
                    <li>• Trading features will be automatically enabled</li>
                    <li>• Status updates in real-time via WebSocket</li>
                  </ul>
                </div>
                
                {/* Demo Status Change Buttons */}
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-xs font-medium text-slate-300 mb-2">Demo: Simulate Status Changes</div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => simulateStatusChange('approved')}
                      className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => simulateStatusChange('declined')}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => simulateStatusChange('pending')}
                      className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {(kycData.status === 'declined' || kycData.status === 'resubmit') && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-white font-medium">Verification needs attention</span>
                </div>
                <p className="text-slate-300">
                  We were unable to verify your identity with the submitted information. 
                  This can happen for various reasons including unclear document photos or mismatched information.
                </p>
                <Button 
                  onClick={handleStartKyc}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {isLoading ? 'Starting...' : 'Retry Verification'}
                </Button>
              </div>
            )}

            {!kycData.status && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-3">
                    <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <h4 className="text-white font-medium">Documents</h4>
                    <p className="text-sm text-slate-400">
                      Government-issued ID (passport, driver's license, or state ID)
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto">
                      <Camera className="h-6 w-6 text-green-400" />
                    </div>
                    <h4 className="text-white font-medium">Photos</h4>
                    <p className="text-sm text-slate-400">
                      Clear photos of your ID and a selfie for identity confirmation
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto">
                      <User className="h-6 w-6 text-purple-400" />
                    </div>
                    <h4 className="text-white font-medium">Information</h4>
                    <p className="text-sm text-slate-400">
                      Basic personal information matching your ID documents
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleStartKyc}
                  disabled={isLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-lg h-14"
                >
                  {isLoading ? 'Starting Verification...' : 'Start Identity Verification'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Why KYC Required */}
          <Card className="bg-[#0e1420] border-[#121826]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="h-5 w-5 mr-2" />
                Why is this required?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-400">
              <p>
                As a US-based cryptocurrency platform, ApexSwap is required to comply 
                with federal anti-money laundering (AML) and know-your-customer (KYC) regulations.
              </p>
              <ul className="space-y-1">
                <li>• Prevents fraud and protects all users</li>
                <li>• Complies with US financial regulations</li>
                <li>• Enables access to on-ramp services</li>
                <li>• Maintains platform security and trust</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Privacy */}
          <Card className="bg-[#0e1420] border-[#121826]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="h-5 w-5 mr-2" />
                Your privacy is protected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-400">
              <p>
                We partner with Persona, a leading identity verification service, 
                to ensure your personal information is handled securely.
              </p>
              <ul className="space-y-1">
                <li>• Bank-level encryption for all data</li>
                <li>• Information used only for verification</li>
                <li>• Compliant with privacy regulations</li>
                <li>• No data sold to third parties</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Help */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-white">Need Help?</h3>
              <p className="text-sm text-slate-400">
                If you're experiencing issues with verification or have questions about the process, 
                our support team is here to help.
              </p>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}