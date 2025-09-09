import { NextRequest, NextResponse } from 'next/server';
import { QuoteError } from '@/lib/types';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

async function fetchWithRetry(url: string, init: RequestInit, attempts = 2): Promise<Response> {
	let lastErr: any;
	for (let i = 0; i < attempts; i++) {
		try {
			const res = await fetch(url, init);
			if (res.status >= 500) throw new Error(`Upstream ${res.status}`);
			return res;
		} catch (err) {
			lastErr = err;
			await new Promise(r => setTimeout(r, 200 * (i + 1)));
		}
	}
	throw lastErr;
}

export async function GET(request: NextRequest) {
	try {
		// Rate limit per IP
		const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
		const ok = rateLimit(`sol-quote:${ip}`, { requestsPerMinute: 60, burst: 120 });
		if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

		const { searchParams } = new URL(request.url);
		const inputMint = searchParams.get('inputMint') || '';
		const outputMint = searchParams.get('outputMint') || '';
		const amount = searchParams.get('amount') || '';
		const slippageBps = parseInt(searchParams.get('slippageBps') || '100');

		if (!inputMint || !outputMint || !amount) {
			return NextResponse.json(
				{ error: 'Missing required parameters: inputMint, outputMint, amount' },
				{ status: 400 }
			);
		}

		const amountNum = parseFloat(amount);
		if (isNaN(amountNum) || amountNum <= 0) {
			return NextResponse.json(
				{ error: 'Invalid amount parameter' },
				{ status: 400 }
			);
		}

		// Forward to Jupiter Quote API (v6)
		const jupUrl = new URL('https://quote-api.jup.ag/v6/quote');
		jupUrl.searchParams.set('inputMint', inputMint);
		jupUrl.searchParams.set('outputMint', outputMint);
		jupUrl.searchParams.set('amount', amount);
		jupUrl.searchParams.set('slippageBps', String(slippageBps));
		jupUrl.searchParams.set('onlyDirectRoutes', 'false');
		jupUrl.searchParams.set('asLegacyTransaction', 'false');

		const res = await fetchWithRetry(jupUrl.toString(), { cache: 'no-store' }, 2);
		const data = await res.json().catch(() => ({}));

		if (!res.ok) {
			return NextResponse.json(
				{ error: data?.error || 'Jupiter quote failed' },
				{ status: res.status }
			);
		}

		return new NextResponse(JSON.stringify(data), {
			status: 200,
			headers: {
				'content-type': 'application/json',
				'cache-control': 'public, max-age=3, s-maxage=3, stale-while-revalidate=30'
			}
		});
	} catch (error) {
		console.error('Solana quote failed:', error);
		
		if (error instanceof QuoteError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.statusCode }
			);
		}

		return NextResponse.json(
			{ error: 'Quote request failed' },
			{ status: 500 }
		);
	}
}