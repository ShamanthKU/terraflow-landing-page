'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface WaitlistCardProps {
  onSuccess?: () => void;
  className?: string;
}

export default function WaitlistCard({ onSuccess, className = '' }: WaitlistCardProps) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmed,
          hp_company: honeypot, // Honeypot field
          source: 'terraflow-website',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      if (data.isDuplicate) {
        setStatus('duplicate');
      } else {
        setStatus('success');
      }

      if (onSuccess) onSuccess();
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div
      className={`w-full max-w-md backdrop-blur-xl bg-white/90 sm:bg-white/92 border border-[#1A3828]/15 shadow-[0_20px_60px_rgba(20,45,28,0.16)] rounded-2xl p-6 sm:p-8 text-left transition-all ${className}`}
      style={{
        boxShadow: '0 24px 60px -12px rgba(20, 48, 28, 0.16), 0 0 0 1px rgba(26, 56, 40, 0.08)',
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1A3828]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1A3828] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            TF
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-[#14261C] block leading-none">
              Terraflow
            </span>
            <span className="text-[10px] font-medium text-[#253D30]/75 tracking-wider uppercase">
              Early Access
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/60">
          <Sparkles className="w-3 h-3 text-emerald-700" aria-hidden="true" />
          <span>Pre-Launch</span>
        </span>
      </div>

      {status === 'success' ? (
        /* SUCCESS CONFIRMATION STATE */
        <div className="py-3 text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full bg-emerald-100/80 border border-emerald-300/50 flex items-center justify-center mx-auto text-emerald-800">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#14261C]">
              You&apos;re on the list. ✓
            </h3>
            <p className="mt-2 text-sm text-[#253D30]/90 leading-relaxed max-w-sm mx-auto">
              Thanks for joining Terraflow. We&apos;ll send you an email when early access opens.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#2C4E36] font-medium bg-[#1A3828]/5 px-3.5 py-1.5 rounded-full border border-[#1A3828]/10">
              <span>🌱</span> Keep an eye on your inbox.
            </span>
          </div>
        </div>
      ) : status === 'duplicate' ? (
        /* DUPLICATE FRIENDLY NOTICE STATE */
        <div className="py-3 text-center space-y-3 animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mx-auto text-emerald-800">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#14261C]">
              Already Registered
            </h3>
            <p className="mt-1.5 text-sm text-[#253D30]/85 leading-relaxed">
              You&apos;re already on the Terraflow waitlist. We&apos;ll keep you posted.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setEmail('');
            }}
            className="mt-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 cursor-pointer"
          >
            Register with a different email
          </button>
        </div>
      ) : (
        /* INTERACTIVE WAITLIST FORM */
        <div>
          <div className="mb-5">
            <p className="text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-1">
              The future of real estate sales is coming.
            </p>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#14261C] leading-snug">
              Join the Terraflow early-access waitlist.
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {/* Honeypot field: hidden from real users */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="hp_company"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="waitlist-email-input" className="sr-only">
                Your email address
              </label>
              <input
                id="waitlist-email-input"
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setErrorMessage('');
                  }
                }}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white border border-[#1A3828]/20 focus:border-emerald-800 text-[#14261C] placeholder:text-[#253D30]/50 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-60"
              />
            </div>

            {/* Inline Validation Message */}
            {status === 'error' && errorMessage && (
              <p className="text-xs font-semibold text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-lg border border-amber-200/60 animate-in fade-in">
                {errorMessage}
              </p>
            )}

            <button
              id="waitlist-submit-btn"
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide bg-[#1A3828] text-white shadow-[0_4px_16px_rgba(26,56,40,0.25)] hover:bg-[#12271C] hover:shadow-[0_6px_22px_rgba(26,56,40,0.32)] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                  <span>Reserving your spot...</span>
                </>
              ) : (
                <>
                  <span>Join the Waitlist</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Micro-copy */}
          <div className="mt-4 pt-3 border-t border-[#1A3828]/8 flex items-center justify-center gap-2 text-[11px] text-[#253D30]/70 font-medium">
            <span>Early access</span>
            <span>•</span>
            <span>Product updates</span>
            <span>•</span>
            <span>No spam</span>
          </div>
        </div>
      )}
    </div>
  );
}
