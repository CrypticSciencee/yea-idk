import { useState, useEffect, useCallback } from 'react';
import { kycWebSocketManager, KycStatusUpdate } from '@/lib/websocket/kyc-status';
import { KycStatus } from '@/lib/types';

export interface KycStatusData {
  status: KycStatus;
  updatedAt: string;
  reason?: string;
  referenceId?: string;
}

export function useKycStatus(userId?: string) {
  const [kycData, setKycData] = useState<KycStatusData>({
    status: 'pending',
    updatedAt: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  // Check initial KYC status
  const checkKycStatus = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/kyc/status');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data && data.status) {
        setKycData({
          status: data.status,
          updatedAt: data.updatedAt || new Date().toISOString(),
          reason: data.reason,
          referenceId: data.referenceId,
        });
      }
    } catch (err) {
      console.error('Failed to check KYC status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check KYC status');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const subscription = {
      userId,
      onStatusUpdate: (update: KycStatusUpdate) => {
        console.log('📋 Received KYC status update:', update);
        setKycData({
          status: update.status,
          updatedAt: update.updatedAt,
          reason: update.reason,
          referenceId: update.referenceId,
        });
        setError(null);
      },
      onError: (error: Error) => {
        console.error('KYC WebSocket error:', error);
        setError(error.message);
      },
      onConnect: () => {
        console.log('✅ KYC WebSocket connected');
        setConnectionStatus('connected');
        setError(null);
      },
      onDisconnect: () => {
        console.log('❌ KYC WebSocket disconnected');
        setConnectionStatus('disconnected');
      },
    };

    const unsubscribe = kycWebSocketManager.subscribe(subscription);

    // Update connection status periodically
    const statusInterval = setInterval(() => {
      setConnectionStatus(kycWebSocketManager.getConnectionStatus());
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, [userId]);

  // Initial status check
  useEffect(() => {
    checkKycStatus();
  }, [checkKycStatus]);

  // Start KYC process
  const startKycProcess = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/kyc/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to start KYC process:', err);
      setError(err instanceof Error ? err.message : 'Failed to start KYC process');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate status change for demo
  const simulateStatusChange = useCallback((newStatus: KycStatus) => {
    if (userId) {
      kycWebSocketManager.simulateStatusChange(userId, newStatus);
    }
  }, [userId]);

  return {
    kycData,
    isLoading,
    error,
    connectionStatus,
    checkKycStatus,
    startKycProcess,
    simulateStatusChange, // For demo purposes
  };
}