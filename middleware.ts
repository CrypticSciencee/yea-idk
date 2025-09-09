import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Skip static assets
	const { pathname } = request.nextUrl;
	if (pathname.startsWith('/_next') || pathname.startsWith('/assets') || pathname.includes('.')) {
		return response;
	}

	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
	response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

	return response;
}

export const config = {
	matcher: '/:path*',
}; 