import { NextRequest, NextResponse } from 'next/server';
import { QuoteRequestSchema, QuoteError } from '@/lib/types';
import { rateLimit } from '@/lib/rate-limit';

// Force dynamic so we can use request headers/url at runtime
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

const ZEROX_BASE_BY_CHAIN: Record<number, string> = {
	1: 'https://api.0x.org',
	137: 'https://polygon.api.0x.org',
	42161: 'https://arbitrum.api.0x.org',
	10: 'https://optimism.api.0x.org',
	8453: 'https://base.api.0x.org',
};

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
		const ok = rateLimit(`evm-quote:${ip}`, { requestsPerMinute: 60, burst: 120 });
		if (!ok) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

		const { searchParams } = new URL(request.url);
		
		if (!searchParams.get('sellToken') || !searchParams.get('buyToken')) {
			return NextResponse.json(
				{ error: 'Missing required parameters: sellToken and buyToken' },
				{ status: 400 }
			);
		}

		const params = {
			chainId: searchParams.get('chainId') ? parseInt(searchParams.get('chainId')!) : 1,
			sellToken: searchParams.get('sellToken') || '',
			buyToken: searchParams.get('buyToken') || '',
			sellAmount: searchParams.get('sellAmount') || undefined,
			buyAmount: searchParams.get('buyAmount') || undefined,
			slippageBps: searchParams.get('slippageBps') ? parseInt(searchParams.get('slippageBps')!) : 100,
		};

		let validated: any;
		try {
			validated = QuoteRequestSchema.parse(params);
		} catch (validationError) {
			return NextResponse.json(
				{ error: 'Invalid parameters', details: validationError },
				{ status: 400 }
			);
		}

		// Call 0x Swap API
		const allowedChains = Object.keys(ZEROX_BASE_BY_CHAIN).map((k) => parseInt(k, 10));
		const chosenChainId = allowedChains.includes(validated.chainId) ? validated.chainId : 1;
		const base = ZEROX_BASE_BY_CHAIN[chosenChainId];
		const url = new URL(`${base}/swap/v1/quote`);
		if (validated.sellAmount) url.searchParams.set('sellAmount', validated.sellAmount);
		if (validated.buyAmount) url.searchParams.set('buyAmount', validated.buyAmount);
		url.searchParams.set('sellToken', validated.sellToken);
		url.searchParams.set('buyToken', validated.buyToken);
		// Convert bps to percentage for 0x (e.g., 100 bps => 0.01)
		url.searchParams.set('slippagePercentage', (validated.slippageBps / 10000).toString());
		url.searchParams.set('skipValidation', 'false');

		const headers: HeadersInit = {};
		const apiKey = process.env.ZEROX_API_KEY || process.env.NEXT_PUBLIC_ZEROX_API_KEY;
		if (apiKey) headers['0x-api-key'] = apiKey;

		const res = await fetchWithRetry(url.toString(), { headers, cache: 'no-store' }, 2);
		const data = await res.json().catch(() => ({}));

		if (!res.ok) {
			return NextResponse.json(
				{ error: data?.validationErrors?.[0]?.reason || data?.reason || data?.message || '0x quote failed' },
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
		console.error('EVM quote failed:', error);
		
		if (error instanceof QuoteError) {
			return NextResponse.json(
				{ error: error.userMessage || error.message },
				{ status: error.statusCode }
			);
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}