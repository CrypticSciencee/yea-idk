type Bucket = { tokens: number; lastRefill: number };

const buckets: Map<string, Bucket> = new Map();

interface RateLimitOptions {
	requestsPerMinute: number;
	burst?: number;
}

export function rateLimit(key: string, opts: RateLimitOptions): boolean {
	const now = Date.now();
	const capacity = opts.burst ?? opts.requestsPerMinute;
	const refillPerMs = opts.requestsPerMinute / 60000; // tokens per ms

	let bucket = buckets.get(key);
	if (!bucket) {
		bucket = { tokens: capacity, lastRefill: now };
		buckets.set(key, bucket);
	}

	// Refill based on time passed
	const elapsed = now - bucket.lastRefill;
	bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillPerMs);
	bucket.lastRefill = now;

	if (bucket.tokens >= 1) {
		bucket.tokens -= 1;
		return true; // allowed
	}
	return false; // limited
} 