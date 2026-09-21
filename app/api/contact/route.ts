import { NextRequest, NextResponse } from 'next/server';
import { insertContactInquiry } from '@/lib/supabase';
import {
  sendContactNotificationEmail,
  sendContactVisitorConfirmationEmail,
} from '@/lib/resend';

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
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(request: NextRequest) {
  try {
    // 1. Abuse protection: Client IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    // 2. Parse request payload
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request format.' },
        { status: 400 }
      );
    }

    // 3. Honeypot check (hidden field to trap automated bots)
    if (
      body.hp_website &&
      typeof body.hp_website === 'string' &&
      body.hp_website.trim() !== ''
    ) {
      // Bot detected: return 200 silently without writing to database
      return NextResponse.json({
        success: true,
        message: 'Message received.',
        secondary: "We'll be in touch soon.",
      });
    }

    const rawEmail = body.email;
    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid work email address.' },
        { status: 400 }
      );
    }

    // 4. Normalize & Validate email
    const email = rawEmail.trim().toLowerCase();

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid work email address.' },
        { status: 400 }
      );
    }

    const company =
      typeof body.company === 'string' && body.company.trim()
        ? body.company.trim().slice(0, 120)
        : null;

    const message =
      typeof body.message === 'string' && body.message.trim()
        ? body.message.trim().slice(0, 2000)
        : null;

    const source =
      typeof body.source === 'string' && body.source.trim()
        ? body.source.trim().slice(0, 60)
        : 'website-contact';

    // 5. Store in Supabase contact_inquiries table
    const dbResult = await insertContactInquiry({
      email,
      company,
      message,
      source,
    });

    if (!dbResult.success) {
      return NextResponse.json(
        { error: 'Unable to deliver message right now. Please try again shortly.' },
        { status: 500 }
      );
    }

    const timestamp = new Date().toISOString();

    // 6. Trigger Resend emails asynchronously in background
    // Notification to TerraFlow internal team
    sendContactNotificationEmail({
      email,
      company,
      message,
      source,
      timestamp,
    }).catch((err) => {
      console.error('[Terraflow Contact] Error sending team notification:', err);
    });

    // Confirmation note to the visitor
    sendContactVisitorConfirmationEmail({
      email,
      company,
    }).catch((err) => {
      console.error('[Terraflow Contact] Error sending visitor confirmation:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Message received.',
      secondary: "We'll be in touch soon.",
      data: dbResult.data,
    });
  } catch (error) {
    console.error('[Terraflow Contact API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
