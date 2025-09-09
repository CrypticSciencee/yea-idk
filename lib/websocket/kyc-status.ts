export interface KycStatusUpdate {
  userId: string;
  status: 'pending' | 'approved' | 'declined' | 'resubmit';
  updatedAt: string;
  reason?: string;
  referenceId?: string;
}

export interface KycWebSocketSubscription {
  userId: string;
  onStatusUpdate: (update: KycStatusUpdate) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export class KycWebSocketManager {
  private connection: WebSocket | null = null;
  private subscriptions: Map<string, KycWebSocketSubscription[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isClient = typeof window !== 'undefined';
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (this.isClient) {
      this.initializeConnection();
    }
  }

  private initializeConnection() {
    if (!this.isClient) return;

    try {
      // In production, this would be your KYC WebSocket endpoint
      // For now, we'll simulate with a mock WebSocket server
      const wsUrl = this.getWebSocketUrl();
      
      console.log('🔐 Connecting to KYC WebSocket...');
      this.connection = new WebSocket(wsUrl);

      this.connection.onopen = () => {
        console.log('✅ KYC WebSocket connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        
        // Notify all subscriptions of connection
        this.subscriptions.forEach(subs => {
          subs.forEach(sub => sub.onConnect?.());
        });
      };

      this.connection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing KYC WebSocket message:', error);
        }
      };

      this.connection.onerror = (error) => {
        console.error('KYC WebSocket error:', error);
        this.subscriptions.forEach(subs => {
          subs.forEach(sub => sub.onError?.(new Error('WebSocket connection error')));
        });
      };

      this.connection.onclose = () => {
        console.log('KYC WebSocket disconnected');
        this.stopHeartbeat();
        this.connection = null;
        
        // Notify all subscriptions of disconnection
        this.subscriptions.forEach(subs => {
          subs.forEach(sub => sub.onDisconnect?.());
        });
        
        this.reconnect();
      };

    } catch (error) {
      console.error('Failed to initialize KYC WebSocket:', error);
    }
  }

  private getWebSocketUrl(): string {
    // In production, this would be your actual KYC WebSocket endpoint
    // For demo purposes, we'll use a mock WebSocket that simulates KYC updates
    if (process.env.NODE_ENV === 'production') {
      return `wss://${window.location.host}/api/kyc/ws`;
    } else {
      // For development, we'll simulate with a mock WebSocket
      return 'wss://echo.websocket.org'; // Echo server for testing
    }
  }

  private handleMessage(data: any) {
    try {
      if (data.type === 'kyc_status_update') {
        const update: KycStatusUpdate = {
          userId: data.userId,
          status: data.status,
          updatedAt: data.updatedAt || new Date().toISOString(),
          reason: data.reason,
          referenceId: data.referenceId,
        };

        // Notify subscribers for this user
        const userSubs = this.subscriptions.get(update.userId) || [];
        userSubs.forEach(sub => {
          sub.onStatusUpdate(update);
        });

        console.log('📋 KYC Status Update:', update);
      } else if (data.type === 'heartbeat') {
        // Handle heartbeat response
        console.log('💓 KYC WebSocket heartbeat received');
      }
    } catch (error) {
      console.error('Error handling KYC message:', error);
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.connection?.readyState === WebSocket.OPEN) {
        this.connection.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
      
      setTimeout(() => {
        console.log(`🔄 Reconnecting to KYC WebSocket (attempt ${this.reconnectAttempts + 1})`);
        this.reconnectAttempts++;
        this.initializeConnection();
      }, delay);
    } else {
      console.error('❌ Max KYC WebSocket reconnection attempts reached');
    }
  }

  subscribe(subscription: KycWebSocketSubscription): () => void {
    const { userId } = subscription;
    
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, []);
    }
    
    this.subscriptions.get(userId)!.push(subscription);

    // Send subscription message to server
    if (this.connection?.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify({
        type: 'subscribe',
        userId: userId,
      }));
    }

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(userId);
      if (subs) {
        const index = subs.indexOf(subscription);
        if (index > -1) {
          subs.splice(index, 1);
        }
        if (subs.length === 0) {
          this.subscriptions.delete(userId);
          
          // Send unsubscribe message to server
          if (this.connection?.readyState === WebSocket.OPEN) {
            this.connection.send(JSON.stringify({
              type: 'unsubscribe',
              userId: userId,
            }));
          }
        }
      }
    };
  }

  // Simulate KYC status change for demo purposes
  simulateStatusChange(userId: string, status: KycStatusUpdate['status']) {
    if (!this.isClient) return;
    
    const update: KycStatusUpdate = {
      userId,
      status,
      updatedAt: new Date().toISOString(),
      referenceId: `ref_${Date.now()}`,
    };

    // Simulate receiving the update
    setTimeout(() => {
      this.handleMessage({
        type: 'kyc_status_update',
        ...update,
      });
    }, 1000);
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    this.subscriptions.clear();
  }

  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.connection) return 'disconnected';
    
    switch (this.connection.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }
}

// Singleton instance
export const kycWebSocketManager = new KycWebSocketManager();