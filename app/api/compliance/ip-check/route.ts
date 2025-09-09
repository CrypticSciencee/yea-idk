import { NextRequest, NextResponse } from 'next/server';
import { BLOCKED_COUNTRIES, ALLOWED_US_STATES } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    // Get IP from request
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    // In a real implementation, this would:
    // 1. Use IP geolocation service (MaxMind, IPinfo, etc.)
    // 2. Check against OFAC sanctions list
    // 3. Verify US state is not New York
    
    // Mock geofence check
    const isBlocked = Math.random() < 0.1; // 10% chance of blocked for demo
    const isNY = Math.random() < 0.05; // 5% chance of NY for demo
    
    let reason: 'NY' | 'OFAC' | 'BLOCKED' | 'OK' = 'OK';
    let allowed = true;
    
    if (isNY) {
      reason = 'NY';
      allowed = false;
    } else if (isBlocked) {
      reason = 'BLOCKED';
      allowed = false;
    }

    return NextResponse.json({
      allowed,
      reason,
      ip: ip.slice(0, -2) + '**', // Partially mask IP for privacy
      country: allowed ? 'US' : 'BLOCKED',
      region: allowed ? (isNY ? 'NY' : 'CA') : null,
    });
  } catch (error) {
    console.error('IP check failed:', error);
    return NextResponse.json(
      { error: 'Geofence check failed' },
      { status: 500 }
    );
  }
}