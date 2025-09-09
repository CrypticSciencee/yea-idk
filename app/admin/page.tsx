'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  BarChart3,
  DollarSign,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminUser {
  username: string;
  role: string;
  lastLogin: string;
}

interface KycRecord {
  id: string;
  userId: string;
  email: string;
  status: 'pending' | 'approved' | 'declined';
  submittedAt: string;
  reviewedAt?: string;
  documents: string[];
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  pendingKyc: number;
  totalVolume24h: number;
  totalTrades24h: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

const ADMIN_CREDENTIALS = [
  { username: 'TheCCAS', password: 'TheCCAS13#', role: 'Super Admin' },
  { username: 'TK', password: 'Automations', role: 'Operations Admin' }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);

  // Mock data
  const [systemMetrics] = useState<SystemMetrics>({
    totalUsers: 1247,
    activeUsers: 89,
    pendingKyc: 23,
    totalVolume24h: 2847392.45,
    totalTrades24h: 1834,
    systemHealth: 'healthy'
  });

  const [kycRecords] = useState<KycRecord[]>([
    {
      id: 'kyc_001',
      userId: 'user_123',
      email: 'john.doe@email.com',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
      documents: ['passport', 'selfie']
    },
    {
      id: 'kyc_002',
      userId: 'user_456',
      email: 'jane.smith@email.com',
      status: 'pending',
      submittedAt: '2024-01-15T09:15:00Z',
      documents: ['drivers_license', 'selfie', 'utility_bill']
    },
    {
      id: 'kyc_003',
      userId: 'user_789',
      email: 'bob.wilson@email.com',
      status: 'approved',
      submittedAt: '2024-01-14T16:45:00Z',
      reviewedAt: '2024-01-14T17:30:00Z',
      documents: ['passport', 'selfie']
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const admin = ADMIN_CREDENTIALS.find(
      cred => cred.username === loginForm.username && cred.password === loginForm.password
    );

    if (admin) {
      setCurrentUser({
        username: admin.username,
        role: admin.role,
        lastLogin: new Date().toISOString()
      });
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
    setActiveTab('overview');
  };

  const handleKycAction = (kycId: string, action: 'approve' | 'decline') => {
    console.log(`KYC ${action} for ID: ${kycId}`);
    // In real implementation, this would call API to update KYC status
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0b0f16] flex items-center justify-center">
        <div className="text-white">Loading Admin Dashboard...</div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f16] flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-[#0e1420] border-[#121826]">
          <CardHeader className="text-center">
            <div className="h-12 w-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
            <p className="text-slate-400">ApexSwap Administrative Dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <div className="text-red-400 text-sm text-center">{loginError}</div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Username</label>
                <Input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700 text-white pr-10"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Access Dashboard
              </Button>
            </form>

            <div className="mt-6 p-4 bg-slate-800/30 rounded-xl">
              <div className="text-xs text-slate-400 text-center">
                <p className="font-medium mb-2">Authorized Personnel Only</p>
                <p>This system is monitored. Unauthorized access is prohibited.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0b0f16]">
      {/* Header */}
      <div className="bg-[#0e1420] border-b border-[#121826] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ApexSwap Admin</h1>
              <p className="text-sm text-slate-400">Administrative Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white font-medium">{currentUser?.username}</div>
              <div className="text-xs text-slate-400">{currentUser?.role}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-slate-700 text-white hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-[#0e1420] rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'kyc', label: 'KYC Review', icon: UserCheck },
            { id: 'trading', label: 'Trading', icon: TrendingUp },
            { id: 'system', label: 'System', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-red-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#0e1420] border-[#121826]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">{systemMetrics.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0e1420] border-[#121826]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Active Users</p>
                      <p className="text-2xl font-bold text-white">{systemMetrics.activeUsers}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0e1420] border-[#121826]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">24h Volume</p>
                      <p className="text-2xl font-bold text-white">${(systemMetrics.totalVolume24h / 1000000).toFixed(1)}M</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0e1420] border-[#121826]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Pending KYC</p>
                      <p className="text-2xl font-bold text-white">{systemMetrics.pendingKyc}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card className="bg-[#0e1420] border-[#121826]">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "h-4 w-4 rounded-full",
                    systemMetrics.systemHealth === 'healthy' ? 'bg-green-400' :
                    systemMetrics.systemHealth === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  )}></div>
                  <span className="text-white font-medium">
                    {systemMetrics.systemHealth === 'healthy' ? 'All Systems Operational' :
                     systemMetrics.systemHealth === 'warning' ? 'Minor Issues Detected' : 'Critical Issues'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* KYC Review Tab */}
        {activeTab === 'kyc' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">KYC Review Queue</h2>
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                {kycRecords.filter(r => r.status === 'pending').length} Pending
              </Badge>
            </div>

            <div className="space-y-4">
              {kycRecords.map((record) => (
                <Card key={record.id} className="bg-[#0e1420] border-[#121826]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-medium">{record.email}</span>
                          <Badge className={cn(
                            record.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            record.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          )}>
                            {record.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {record.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {record.status === 'declined' && <XCircle className="h-3 w-3 mr-1" />}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400">
                          <p>Submitted: {new Date(record.submittedAt).toLocaleString()}</p>
                          <p>Documents: {record.documents.join(', ')}</p>
                          {record.reviewedAt && (
                            <p>Reviewed: {new Date(record.reviewedAt).toLocaleString()}</p>
                          )}
                        </div>
                      </div>

                      {record.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleKycAction(record.id, 'approve')}
                            className="bg-green-600 hover:bg-green-500 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleKycAction(record.id, 'decline')}
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== 'overview' && activeTab !== 'kyc' && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}