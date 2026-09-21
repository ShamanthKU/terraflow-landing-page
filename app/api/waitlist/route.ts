import { NextRequest, NextResponse } from 'next/server';
import { insertWaitlistUser, updateWaitlistEmailStatus } from '@/lib/supabase';
import { sendWaitlistConfirmationEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Simple in-memory sliding-window rate limiter
// Limits each client IP to 5 requests per 60 seconds
interface RateLimitBucket {
  count: number;
  resetTime: number;
}
const ipRateLimitMap = new Map<string, RateLimitBucket>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const bucket = ipRateLimitMap.get(ip);
  if (!bucket || now > bucket.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (bucket.count >= maxRequests) {
    return false;
  }

  bucket.count += 1;
  return true;
}

// Clean up old rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of ipRateLimitMap.entries()) {
      if (now > bucket.resetTime) {
        ipRateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

// RFC 5322 simplified email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(request: NextRequest) {
  try {
    // 1. Abuse protection: Client IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    // 2. Parse request payload
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    // 3. Honeypot check (hidden field to trap automated bots)
    if (body.hp_company && typeof body.hp_company === 'string' && body.hp_company.trim() !== '') {
      // Bot detected: return 200 silently without writing to database
      return NextResponse.json({
        success: true,
        message: "You're on the list. ✓",
      });
    }

    const rawEmail = body.email;
    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 4. Normalize & Validate email
    const email = rawEmail.trim().toLowerCase();

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const firstName = typeof body.firstName === 'string' ? body.firstName.trim().slice(0, 50) : null;
    const source = typeof body.source === 'string' ? body.source.slice(0, 50) : 'terraflow-website';

    // Capture optional marketing attribution metadata
    const metadata: Record<string, unknown> = {
      ip: clientIp,
      userAgent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || null,
      ...(typeof body.metadata === 'object' && body.metadata ? body.metadata : {}),
    };

    // 5. Store in Supabase
    const dbResult = await insertWaitlistUser({
      email,
      first_name: firstName,
      source,
      metadata,
    });

    if (!dbResult.success) {
      return NextResponse.json(
        { error: 'Unable to save your spot right now. Please try again shortly.' },
        { status: 500 }
      );
    }

    // 6. Duplicate handling: Inform user gracefully
    if (dbResult.isDuplicate) {
      return NextResponse.json({
        success: true,
        isDuplicate: true,
        message: "You're already on the Terraflow waitlist. We'll keep you posted.",
      });
    }

    // 7. Trigger confirmation email via Resend (Isolated: email failure never fails registration)
    // Non-blocking background attempt so user receives immediate UI feedback
    sendWaitlistConfirmationEmail({ email, firstName })
      .then(async (emailResult) => {
        if (emailResult.success) {
          await updateWaitlistEmailStatus(email, true);
        } else {
          console.warn(`[Terraflow Waitlist] Email delivery deferred for ${email}:`, emailResult.error);
        }
      })
      .catch((err) => {
        console.error('[Terraflow Waitlist] Unexpected email worker error:', err);
      });

    return NextResponse.json({
      success: true,
      isDuplicate: false,
      message: "You're on the list. ✓",
    });
  } catch (error) {
    console.error('[Terraflow Waitlist API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
