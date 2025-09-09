'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  PieChart, 
  Settings, 
  FileText,
  Activity
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: Activity },
  { name: 'Trade', href: '/swap', icon: TrendingUp },
  { name: 'Markets', href: '/markets', icon: TrendingUp },
  { name: 'Invest', href: '/invest', icon: PieChart },
  { name: 'Admin', href: '/admin', icon: Settings },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Legal', href: '/legal/tos', icon: FileText },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#0b0f16] border-b border-[#121826]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ApexSwap</span>
            </Link>

            {/* Primary Navigation */}
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== '/app' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Secondary Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center p-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-cyan-400 bg-cyan-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>

            {/* Wallet Connection */}
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}