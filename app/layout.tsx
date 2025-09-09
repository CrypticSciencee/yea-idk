import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/navigation';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ApexSwap - Non-Custodial Crypto Exchange',
  description: 'Trade crypto with confidence. US-only, non-custodial DEX aggregation across Solana and EVM chains.',
  keywords: 'crypto, trading, DEX, non-custodial, DeFi, Solana, Ethereum',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className={cn(inter.className, "bg-[#0b0f16] text-white min-h-screen")} suppressHydrationWarning>
        <ErrorBoundary>
          <div className="min-h-screen">
            <Navigation />
            <main>{children}</main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}