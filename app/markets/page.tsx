'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useMarketData } from '@/hooks/use-market-data';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function MarketsPage() {
	const { pairs, loading, error, refresh, connectionStatus } = useMarketData();
	const [query, setQuery] = useState('');
	const [timeframe, setTimeframe] = useState<'5m' | '1h' | '6h' | '24h'>('24h');
	const [tab, setTab] = useState<'top' | 'gainers' | 'new'>('top');
	const [exFilters, setExFilters] = useState<Record<string, boolean>>({});
	const [compact, setCompact] = useState(false);

	const exchanges = useMemo(() => Array.from(new Set(pairs.map(p => p.exchange))).sort(), [pairs]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		let list = pairs;

		if (q) {
			list = list.filter(p =>
				p.symbol.toLowerCase().includes(q) ||
				p.baseSymbol.toLowerCase().includes(q)
			);
		}

		// Exchange filters
		const activeEx = Object.entries(exFilters).filter(([, v]) => v).map(([k]) => k);
		if (activeEx.length > 0) {
			list = list.filter(p => activeEx.includes(p.exchange));
		}

		// Tabs
		if (tab === 'top') {
			list = [...list].sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0));
		} else if (tab === 'gainers') {
			list = list.filter(p => (p.change24h || 0) > 0).sort((a, b) => (b.change24h || 0) - (a.change24h || 0));
		} else if (tab === 'new') {
			// Without listing timestamps, fallback to sorting by symbol to provide a stable view
			list = [...list].sort((a, b) => a.baseSymbol.localeCompare(b.baseSymbol));
		}

		return list;
	}, [pairs, query, exFilters, tab]);

	const rowHeight = compact ? 44 : 56;

	return (
		<div className="px-6 py-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-white">ApexSwap Markets</h1>
				<div className="flex items-center gap-3">
					<Input
						placeholder="Search tokens (e.g. BTC, ETH)"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-72 bg-slate-800/50 border-slate-700 text-white"
					/>
					<div className="hidden md:flex items-center gap-2 text-xs">
						{(['5m','1h','6h','24h'] as const).map(tf => (
							<button
								key={tf}
								onClick={() => setTimeframe(tf)}
								className={cn(
									'px-2 py-1 rounded-md border',
									timeframe === tf ? 'bg-cyan-600 text-white border-cyan-500' : 'text-slate-300 border-slate-700 hover:text-white'
								)}
							>
								{tf}
							</button>
						))}
					</div>
					<button
						onClick={() => setCompact(v => !v)}
						className={cn('text-xs px-2 py-1 rounded-md border', compact ? 'bg-slate-700 text-white border-slate-600' : 'text-slate-300 border-slate-700 hover:text-white')}
					>
						{compact ? 'Comfortable' : 'Compact'}
					</button>
				</div>
			</div>

			{/* Tabs & Exchange Filters */}
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2 text-sm">
					{(['top','gainers','new'] as const).map(t => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={cn('px-3 py-1.5 rounded-xl border', tab === t ? 'bg-cyan-600 text-white border-cyan-500' : 'text-slate-300 border-slate-700 hover:text-white')}
						>
							{t === 'top' ? 'Top' : t === 'gainers' ? 'Gainers' : 'New'}
						</button>
					))}
				</div>
				<div className="flex items-center gap-2 overflow-x-auto">
					{exchanges.map(ex => (
						<button
							key={ex}
							onClick={() => setExFilters(prev => ({ ...prev, [ex]: !prev[ex] }))}
							className={cn('text-xs px-2 py-1 rounded-md border whitespace-nowrap', exFilters[ex] ? 'bg-cyan-600 text-white border-cyan-500' : 'text-slate-300 border-slate-700 hover:text-white')}
						>
							{ex}
						</button>
					))}
					{exchanges.length === 0 && <span className="text-xs text-slate-500">No exchanges connected</span>}
				</div>
			</div>

			<div className="rounded-xl border border-[#121826] bg-[#0e1420] overflow-hidden">
				<div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-slate-400 border-b border-[#121826]">
					<div className="col-span-4">Token</div>
					<div className="col-span-2 text-right">Price</div>
					<div className="col-span-2 text-right">Volume 24h</div>
					<div className="col-span-2 text-right">Change 24h</div>
					<div className="col-span-2 text-right">Exchange</div>
				</div>

				<ListVirtualized rows={filtered} rowHeight={rowHeight}>
					{(row, index) => <MarketRow key={row.id + index} row={row} compact={compact} />}
				</ListVirtualized>
			</div>

			<div className="mt-4 flex items-center justify-between text-xs text-slate-400">
				<div className="flex items-center gap-3">
					<span>Connections:</span>
					{Object.entries(connectionStatus).map(([ex, s]) => (
						<Badge key={ex} className={cn('bg-slate-800 border-slate-700', s === 'connected' ? 'text-green-400' : s === 'connecting' ? 'text-yellow-400' : 'text-red-400')}>
							{ex}:{' '}{s}
						</Badge>
					))}
				</div>
				<div>
					{loading ? 'Loading live markets…' : error ? <span className="text-red-400">{error}</span> : `${filtered.length} pairs`}
				</div>
			</div>
		</div>
	);
}

function MarketRow({ row, compact }: { row: { id: string; symbol: string; baseSymbol: string; price: number; change24h: number; volume24h: number; exchange: string; }; compact: boolean; }) {
	const isUp = row.change24h >= 0;
	return (
		<Link href={`/swap?symbol=${encodeURIComponent(row.symbol)}`} className={cn('grid grid-cols-12 px-4 items-center border-b border-[#121826] hover:bg-slate-800/20', compact ? 'h-11' : 'h-14')}>
			<div className="col-span-4 flex items-center gap-3">
				<div className={cn('rounded-full bg-slate-700', compact ? 'w-5 h-5' : 'w-6 h-6')} />
				<div>
					<div className={cn('text-white font-medium', compact ? 'text-[13px]' : 'text-sm')}>{row.baseSymbol}<span className="text-slate-400">/USDT</span></div>
					<div className="text-[11px] text-slate-400">{row.symbol}</div>
				</div>
			</div>
			<div className={cn('col-span-2 text-right text-white', compact ? 'text-[13px]' : 'text-sm')}>{formatNumber(row.price)}</div>
			<div className={cn('col-span-2 text-right text-slate-300', compact ? 'text-[13px]' : 'text-sm')}>{formatNumber(row.volume24h)}</div>
			<div className={cn('col-span-2 text-right', compact ? 'text-[13px]' : 'text-sm', isUp ? 'text-green-400' : 'text-red-400')}>{row.change24h.toFixed(2)}%</div>
			<div className="col-span-2 text-right text-slate-300 text-xs">{row.exchange}</div>
		</Link>
	);
}

function ListVirtualized<T>({ rows, rowHeight, children }: { rows: T[]; rowHeight: number; children: (row: T, index: number) => React.ReactNode; }) {
	const [scrollTop, setScrollTop] = useState(0);
	const viewportHeight = 640;
	const total = rows.length;
	const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5);
	const endIndex = Math.min(total, Math.ceil((scrollTop + viewportHeight) / rowHeight) + 5);
	const visible = rows.slice(startIndex, endIndex);

	return (
		<div
			style={{ height: viewportHeight }}
			className="overflow-auto"
			onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
		>
			<div style={{ height: total * rowHeight, position: 'relative' }}>
				<div style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
					{visible.map((row, i) => children(row, startIndex + i))}
				</div>
			</div>
		</div>
	);
}

function formatNumber(n: number) {
	if (!isFinite(n)) return '-';
	if (n === 0) return '0';
	const abs = Math.abs(n);
	if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
	if (abs >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
	if (abs >= 1_000) return (n / 1_000).toFixed(2) + 'K';
	return n.toFixed(6);
} 