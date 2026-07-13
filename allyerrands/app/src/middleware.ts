import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store: IP -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Clean up every 5 minutes
let lastCleanup = Date.now();

export async function middleware(request: NextRequest) {
  const start = Date.now();

  // --- Periodic cleanup of expired rate-limit entries ---
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    for (const [ip, entry] of rateLimitMap) {
      if (now >= entry.resetAt) {
        rateLimitMap.delete(ip);
      }
    }
    lastCleanup = now;
  }

  // --- Rate limiting ---
  // Use X-Forwarded-For if available (behind proxy), otherwise fall back to IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip ?? 'unknown';

  let entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    // New window for this IP
    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, entry);
  } else {
    entry.count++;
    rateLimitMap.set(ip, entry);
  }

  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests', retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-Response-Time': `${Date.now() - start}ms`,
        },
      },
    );
  }

  // --- Build response with security headers and timing ---
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );

  // Request timing
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};