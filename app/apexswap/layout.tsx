import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ApexSwap - Advanced Cryptocurrency Analytics Platform',
  description: 'Professional-grade cryptocurrency trading and analytics platform with real-time data, advanced charting, and portfolio management.',
  keywords: 'cryptocurrency, trading, analytics, DeFi, blockchain, portfolio, real-time data',
  authors: [{ name: 'ApexSwap Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ApexSwap - Advanced Cryptocurrency Analytics Platform',
    description: 'Professional-grade cryptocurrency trading and analytics platform',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexSwap - Advanced Cryptocurrency Analytics Platform',
    description: 'Professional-grade cryptocurrency trading and analytics platform',
  },
};

export default function ApexSwapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
