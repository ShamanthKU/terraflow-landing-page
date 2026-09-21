'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Sliders,
  Play,
  Award,
} from 'lucide-react';

// ============================================================================
// COMPONENT 1: MASTER ROI CALCULATOR (CARD 1 - SPAN 8 ON DESKTOP)
// Supports Instant Switching Between INR (₹) and USD ($)
// ============================================================================
function MasterRoiCalculator({
  currency,
  setCurrency,
}: {
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
}) {
  const [monthlyLeads, setMonthlyLeads] = useState<number>(1000); // Default 1,000 leads for high-velocity teams
  const [teamSize, setTeamSize] = useState<number>(10);
  
  // Independent price state for INR and USD so toggling maintains sensible values
  const [avgHomePriceInr, setAvgHomePriceInr] = useState<number>(18000000); // Default ₹1.8 Cr (luxury metro benchmark)
  const [avgHomePriceUsd, setAvgHomePriceUsd] = useState<number>(950000); // Default $950K (US luxury benchmark)

  const isINR = currency === 'INR';
  const avgHomePrice = isINR ? avgHomePriceInr : avgHomePriceUsd;

  // Industry benchmark vs Terraflow autonomous flow (3.1% added conversion rate)
  const additionalDealsYearly = Math.max(1, Math.round(monthlyLeads * 12 * 0.031));
  const commissionRate = 0.025; // 2.5% gross commission
  const totalAddedGci = additionalDealsYearly * avgHomePrice * commissionRate;
  const hoursReclaimedYearly = teamSize * 15 * 48; // 15 hrs/week per agent, 48 work weeks
  const speedMultiplier = '3.8×';

  // Format currency based on active selection (INR Lakhs/Crores vs USD)
  const formatCurrency = (val: number) => {
    if (isINR) {
      if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(2)} Cr`;
      }
      return `₹${(val / 100000).toFixed(1)} Lakh`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const chartPoints = [
    { month: 'M1', val: Math.round(totalAddedGci * 0.08) },
    { month: 'M3', val: Math.round(totalAddedGci * 0.22) },
    { month: 'M6', val: Math.round(totalAddedGci * 0.48) },
    { month: 'M9', val: Math.round(totalAddedGci * 0.74) },
    { month: 'M12', val: Math.round(totalAddedGci) },
  ];

  const maxVal = chartPoints[chartPoints.length - 1].val;

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-7 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#00B36E]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,179,110,0.12)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      {/* Ambient background mint glow */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#00B36E]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00B36E]/10 transition-all duration-500" />

      {/* Header with Prominent INR / USD Currency Toggle */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00B36E]/10 border border-[#00B36E]/25 text-[#008751] text-[11px] font-bold tracking-wider uppercase">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive ROI Simulator</span>
          </div>

          {/* DUAL CURRENCY TOGGLE (INR vs USD) */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-bold text-slate-500 uppercase tracking-wider">
              Currency:
            </span>
            <div className="inline-flex items-center p-1 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-inner">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isINR
                    ? 'bg-[#00B36E] text-white shadow-[0_2px_8px_rgba(0,179,110,0.35)]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-xs">🇮🇳</span>
                <span>₹ INR</span>
                <span className="hidden md:inline text-[10px] opacity-85 font-normal">(India)</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  !isINR
                    ? 'bg-[#00B36E] text-white shadow-[0_2px_8px_rgba(0,179,110,0.35)]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-xs">🇺🇸</span>
                <span>$ USD</span>
              </button>
            </div>
          </div>
        </div>

        <h3 className="font-editorial text-2xl sm:text-3xl text-[#0F2216] font-normal tracking-tight">
          Quantify Your Brokerage&apos;s{' '}
          <span className="italic text-[#008751]">Autonomous Revenue Lift.</span>
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-[#3A5043] font-sans font-medium leading-relaxed max-w-xl">
          {isINR
            ? 'Calibrated for Indian real estate transactions across Bengaluru, Mumbai, Delhi-NCR, Hyderabad & Pune in Lakhs & Crores.'
            : 'Derived from live transaction data across 140,000+ real estate interactions in North American & global luxury markets.'}
        </p>
      </div>

      {/* Responsive Dual Column: Sliders (Left) & Real-Time Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 my-5 sm:my-6 w-full">
        {/* Sliders Area (Span 6 on desktop) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
          {/* Slider 1: Monthly Leads */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Monthly Inbound Leads</span>
              <span className="text-[#008751] font-bold text-sm tabular-nums">
                {monthlyLeads.toLocaleString()} leads
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={1500}
              step={25}
              value={monthlyLeads}
              onChange={(e) => setMonthlyLeads(Number(e.target.value))}
              aria-label="Monthly Inbound Leads"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B36E] focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>50</span>
              <span>750</span>
              <span>1,500 leads</span>
            </div>
          </div>

          {/* Slider 2: Average Property Price (Adaptive to INR or USD) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">
                Average Property Price {isINR ? '(INR)' : '(USD)'}
              </span>
              <span className="text-[#008751] font-bold text-sm tabular-nums">
                {formatCurrency(avgHomePrice)}
              </span>
            </div>
            {isINR ? (
              <input
                type="range"
                min={2500000} // ₹25 Lakhs
                max={250000000} // ₹25 Crores
                step={500000} // ₹5 Lakhs
                value={avgHomePriceInr}
                onChange={(e) => setAvgHomePriceInr(Number(e.target.value))}
                aria-label="Average Property Price in INR"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B36E] focus:outline-none"
              />
            ) : (
              <input
                type="range"
                min={350000}
                max={3000000}
                step={50000}
                value={avgHomePriceUsd}
                onChange={(e) => setAvgHomePriceUsd(Number(e.target.value))}
                aria-label="Average Property Price in USD"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B36E] focus:outline-none"
              />
            )}
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              {isINR ? (
                <>
                  <span>₹25 Lakh</span>
                  <span>₹10 Cr</span>
                  <span>₹25 Cr+</span>
                </>
              ) : (
                <>
                  <span>$350K</span>
                  <span>$1.5M</span>
                  <span>$3M+</span>
                </>
              )}
            </div>
          </div>

          {/* Slider 3: Agent Team Count */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Active Producing Agents</span>
              <span className="text-[#008751] font-bold text-sm tabular-nums">{teamSize} agents</span>
            </div>
            <input
              type="range"
              min={3}
              max={60}
              step={1}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              aria-label="Active Producing Agents"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B36E] focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>3</span>
              <span>30</span>
              <span>60 agents</span>
            </div>
          </div>
        </div>

        {/* Dynamic Output Cards (Span 6 on desktop) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-3">
          {/* Main Hero KPI Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#E8F8EE] border border-[#00B36E]/30 relative overflow-hidden shadow-sm">
            <div className="text-[11px] font-bold text-[#008751] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Projected Annual Net GCI Added</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2216] tracking-tight tabular-nums">
                +{formatCurrency(totalAddedGci)}
              </span>
              <span className="text-xs font-semibold text-[#008751] bg-white px-2 py-0.5 rounded-full border border-[#00B36E]/20 shadow-xs">
                /year
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 leading-snug">
              Derived from <strong className="text-[#0F2216] font-bold">+{additionalDealsYearly} extra closed deals</strong> via 3.2s automated contact velocity.
            </p>
          </div>

          {/* Secondary Mini-KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#008751]" />
                <span>Agent Hours Saved</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-bold text-[#0F2216] tabular-nums">
                {hoursReclaimedYearly.toLocaleString()} <span className="text-xs font-normal text-slate-500">hrs/yr</span>
              </div>
              <span className="text-[10px] text-[#008751] font-medium">~15h/week/agent</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600" />
                <span>Conversion Velocity</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-bold text-[#0F2216] tabular-nums">
                {speedMultiplier} <span className="text-xs font-normal text-slate-500">lift</span>
              </div>
              <span className="text-[10px] text-[#008751] font-medium">Zero lead leakage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Step Chart */}
      <div className="pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00B36E] shrink-0" />
          <span className="text-xs font-semibold text-slate-700">
            Payback Timeline: <span className="text-[#008751] font-bold">100% Breakeven within 18 days</span>
          </span>
        </div>

        {/* Step bars */}
        <div className="flex items-end gap-2 text-[10px] text-slate-500 font-mono">
          {chartPoints.map((pt, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-4 sm:w-5 rounded-t bg-gradient-to-t from-[#00B36E]/30 to-[#00B36E] transition-all duration-300"
                style={{ height: `${Math.max(6, Math.round((pt.val / maxVal) * 26))}px` }}
              />
              <span className="text-[9px]">{pt.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 2: 3.2s SPEED-TO-LEAD ENGINE (CARD 2 - SPAN 4 ON DESKTOP)
// ============================================================================
function SpeedToLeadSimulation() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [step, setStep] = useState<number>(0);

  const triggerSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTimer(0);
    setStep(1);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setTimer(parseFloat(elapsed.toFixed(1)));

      if (elapsed >= 1.0 && elapsed < 2.0) {
        setStep(2);
      } else if (elapsed >= 2.0 && elapsed < 3.2) {
        setStep(3);
      } else if (elapsed >= 3.2) {
        setTimer(3.2);
        setStep(4);
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#00B36E]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,179,110,0.12)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3 text-amber-600" />
            <span>Velocity SLA</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Industry: 42 hrs</span>
        </div>

        <h3 className="font-editorial text-xl sm:text-2xl text-[#0F2216] font-normal tracking-tight">
          First Touch in{' '}
          <span className="italic text-[#008751]">3.2 Seconds.</span>
        </h3>
        <p className="mt-1 text-xs text-[#3A5043] font-sans font-medium leading-relaxed">
          Leads contacted within 60 seconds are 391% more likely to schedule a VIP property tour.
        </p>
      </div>

      {/* Interactive Velocity Race Display */}
      <div className="my-4 sm:my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 sm:space-y-4">
        {/* Stopwatch & Action Button - Responsive Stack */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Autonomous Dispatch Time
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#0F2216] font-mono flex items-baseline gap-1 mt-0.5">
              <span className="text-[#008751]">{timer.toFixed(1)}</span>
              <span className="text-xs font-normal text-slate-500">seconds</span>
            </div>
          </div>

          <button
            onClick={triggerSimulation}
            disabled={isRunning}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#00B36E] hover:bg-[#009E60] active:scale-95 text-white text-xs font-bold tracking-wide shadow-[0_4px_14px_rgba(0,179,110,0.25)] flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Simulate Inflow</span>
              </>
            )}
          </button>
        </div>

        {/* Step Progression */}
        <div className="space-y-1.5 text-xs">
          <div
            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              step >= 1 ? 'bg-[#E8F8EE] text-[#0F2216] font-semibold border border-[#00B36E]/20' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                step >= 1 ? 'bg-[#00B36E] text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              ✓
            </div>
            <span className="text-[11px] leading-tight">0.4s — Signal captured from WhatsApp &amp; MLS</span>
          </div>

          <div
            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              step >= 2 ? 'bg-[#E8F8EE] text-[#0F2216] font-semibold border border-[#00B36E]/20' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                step >= 2 ? 'bg-[#00B36E] text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              ✓
            </div>
            <span className="text-[11px] leading-tight">1.8s — Tax equity &amp; pre-approval synthesized</span>
          </div>

          <div
            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              step >= 3 ? 'bg-[#E8F8EE] text-[#0F2216] font-semibold border border-[#00B36E]/20' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                step >= 3 ? 'bg-[#00B36E] text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              ✓
            </div>
            <span className="text-[11px] leading-tight">3.2s — Direct SMS briefing sent + Tour scheduled</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-3 border-t border-slate-200 font-medium">
        <span className="text-[#008751] font-bold">TerraFlow: 3.2s</span>
        <span className="text-slate-500">Legacy CRM: 42 Hours</span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 3: ZERO LEAKAGE FUNNEL (CARD 3 - SPAN 4 ON DESKTOP)
// ============================================================================
function ZeroLeadLeakage() {
  const [activeChannel, setActiveChannel] = useState<string>('all');

  const channels = [
    { id: 'all', label: 'All' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'mls', label: 'MLS/Portals' },
    { id: 'insta', label: 'Instagram' },
    { id: 'voice', label: 'Calls' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#00B36E]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,179,110,0.12)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#008751] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-[#008751]" />
            <span>Leakage Defense</span>
          </span>
          <span className="text-[11px] font-bold text-[#008751]">0.0% Dropped Leads</span>
        </div>

        <h3 className="font-editorial text-xl sm:text-2xl text-[#0F2216] font-normal tracking-tight">
          Absolute Zero{' '}
          <span className="italic text-[#008751]">Signal Leakage.</span>
        </h3>
        <p className="mt-1 text-xs text-[#3A5043] font-sans font-medium leading-relaxed">
          Traditional brokerages lose 38% of leads across disconnected silos. Terraflow unifies every stream.
        </p>
      </div>

      {/* Interactive Channel Filter Pills */}
      <div className="my-4">
        <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider">
          Filter Unified Inflow Stream:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                activeChannel === ch.id
                  ? 'bg-[#00B36E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graphic Stat Block */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
            Capture &amp; Enrichment Rate
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0F2216] mt-0.5 flex items-baseline gap-2">
            <span>100.0%</span>
            <span className="text-xs font-bold text-[#008751]">Zero dropped</span>
          </div>
        </div>

        {/* Concentric Circle Indicator */}
        <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-[#00B36E]/40 flex items-center justify-center text-[#008751] text-xs font-bold shadow-xs">
          100%
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
        <span>Auto-synced to MLS &amp; CRM</span>
        <span className="text-[#0F2216] font-bold">24/7/365 active</span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 4: AGENT HOURS RECLAIMED (CARD 4 - SPAN 4 ON DESKTOP)
// ============================================================================
function HoursReclaimedSimulator({ currency }: { currency: 'INR' | 'USD' }) {
  const [viewMode, setViewMode] = useState<'before' | 'after'>('after');
  const isINR = currency === 'INR';

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#00B36E]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,179,110,0.12)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3 text-teal-600" />
            <span>Time Optimization</span>
          </span>
          <span className="text-[11px] font-bold text-teal-700">15 hrs/week/agent</span>
        </div>

        <h3 className="font-editorial text-xl sm:text-2xl text-[#0F2216] font-normal tracking-tight">
          Eradicate{' '}
          <span className="italic text-teal-700">Manual Admin Work.</span>
        </h3>
        <p className="mt-1 text-xs text-[#3A5043] font-sans font-medium leading-relaxed">
          Redirect broker hours from database paperwork into high-value client tours and closing deals.
        </p>
      </div>

      {/* Interactive Toggle Button */}
      <div className="my-4">
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setViewMode('before')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'before'
                ? 'bg-white text-rose-700 shadow-xs border border-rose-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Legacy CRM (Before)
          </button>
          <button
            onClick={() => setViewMode('after')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'after'
                ? 'bg-white text-[#008751] shadow-xs border border-[#00B36E]/30'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            With TerraFlow (After)
          </button>
        </div>
      </div>

      {/* Visual Workweek Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        {viewMode === 'before' ? (
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Manual CRM Logging &amp; Admin</span>
                <span className="text-rose-600 font-bold">65% (26 hrs)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-rose-500 w-[65%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Client Interaction &amp; Showings</span>
                <span className="text-slate-500 font-bold">35% (14 hrs)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-slate-400 w-[35%]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>High-Leverage Tours &amp; Negotiating</span>
                <span className="text-[#008751] font-bold">88% (35 hrs)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[88%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Autonomous Supervision</span>
                <span className="text-teal-700 font-bold">12% (5 hrs)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-teal-400 w-[12%]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
        <span>Productivity dividend:</span>
        <span className="text-[#008751] font-bold">
          {isINR ? '+₹18.5 Lakh / agent' : '+$124,000 / agent'}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 5: HIGH INTENT BUYER SCORING (CARD 5 - SPAN 4 ON DESKTOP)
// ============================================================================
function IntentScoringCard({ currency }: { currency: 'INR' | 'USD' }) {
  const [selectedLead, setSelectedLead] = useState<number>(0);
  const isINR = currency === 'INR';

  const sampleLeadsInr = [
    {
      name: 'Rohan & Ananya M.',
      budget: '₹4.8 Cr Cash',
      intentScore: '98%',
      urgency: 'Immediate',
      tag: 'NRI Investment',
      details: 'Proof of funds verified via wire portal. Searching luxury villa in North Bengaluru.',
    },
    {
      name: 'Vikram Malhotra',
      budget: '₹2.4 Cr Pre-Approved',
      intentScore: '94%',
      urgency: 'Within 30 Days',
      tag: 'Tech Relocation',
      details: 'Dual tech executive relocation. Require 4+ BHK near Outer Ring Road / Whitefield.',
    },
    {
      name: 'Rajesh Singhania',
      budget: '₹8.5 Cr Portfolio',
      intentScore: '99%',
      urgency: 'Off-Market Only',
      tag: 'Ultra-HNW Investor',
      details: 'Acquiring luxury modern penthouse near UB City / Indiranagar. Zero home-loan contingency.',
    },
  ];

  const sampleLeadsUsd = [
    {
      name: 'Sarah M.',
      budget: '$2.8M Cash',
      intentScore: '98%',
      urgency: 'Immediate',
      tag: '1031 Exchange',
      details: 'Proof of funds verified via wire portal. Searching Pacific Palisades.',
    },
    {
      name: 'David & Lisa K.',
      budget: '$1.9M Pre-Approved',
      intentScore: '94%',
      urgency: 'Within 30 Days',
      tag: 'Relocation Buyer',
      details: 'Executive relocation. Require 4+ beds near top-rated school district.',
    },
    {
      name: 'Marcus Chen',
      budget: '$4.2M Portfolio',
      intentScore: '99%',
      urgency: 'Off-Market Only',
      tag: 'Repeat Investor',
      details: 'Acquiring luxury modern spec home. Zero mortgage contingency.',
    },
  ];

  const currentLeads = isINR ? sampleLeadsInr : sampleLeadsUsd;
  const lead = currentLeads[selectedLead] || currentLeads[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#00B36E]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,179,110,0.12)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#008751] text-[11px] font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 text-[#008751]" />
            <span>AI Intent Scoring</span>
          </span>
          <span className="text-[11px] font-bold text-slate-500">98.6% Accuracy</span>
        </div>

        <h3 className="font-editorial text-xl sm:text-2xl text-[#0F2216] font-normal tracking-tight">
          Filter Out Tire-Kickers.{' '}
          <span className="italic text-[#008751]">Close Serious Wealth.</span>
        </h3>
        <p className="mt-1 text-xs text-[#3A5043] font-sans font-medium leading-relaxed">
          AI pre-qualifies liquidity, purchase timeframe, and verified budget before agent outreach.
        </p>
      </div>

      {/* Selectable Lead Pills */}
      <div className="my-4 flex gap-1.5">
        {currentLeads.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedLead(idx)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-center truncate ${
              selectedLead === idx
                ? 'bg-[#00B36E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Dynamic Lead Card Detail */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#0F2216]">{lead.name}</div>
            <div className="text-xs text-[#008751] font-bold">{lead.budget}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Intent Score</div>
            <div className="text-lg font-black text-[#008751]">{lead.intentScore}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-semibold">
            {lead.tag}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold">
            {lead.urgency}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
          {lead.details}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
        <span>Instant Agent Briefing Dispatched</span>
        <span className="text-[#008751] font-bold">VIP Calendar Locked</span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 6: ENTERPRISE BENCHMARK STRIP (CARD 6 - SPAN 12)
// ============================================================================
function BenchmarkStrip({ currency }: { currency: 'INR' | 'USD' }) {
  const isINR = currency === 'INR';

  const stats = [
    {
      label: 'Pipeline Processed',
      value: isINR ? '₹1,500 Cr+' : '$184M+',
      desc: isINR ? 'Verified across top Indian luxury listings' : 'Verified across 12,000+ luxury listings',
    },
    { label: 'Avg Sales Velocity Lift', value: '3.4×', desc: 'Tour bookings within 48h' },
    { label: 'Full Payback Horizon', value: '< 18 Days', desc: 'First commission covers 1yr+' },
    { label: 'Platform Availability SLA', value: '99.98%', desc: 'Zero dropped inbound calls' },
  ];

  return (
    <div className="w-full p-5 sm:p-7 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#00B36E]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,179,110,0.12)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
        {stats.map((stat, i) => (
          <div key={i} className={`${i > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="mt-1 text-3xl sm:text-4xl font-black text-[#0F2216] tracking-tight tabular-nums font-editorial">
              <span className="text-[#008751]">{stat.value}</span>
            </div>
            <div className="mt-1 text-xs text-slate-600 font-medium">
              {stat.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT EXPORT: IMPACT & ROI BENTO SECTION (LIGHT THEME + MOBILE FIRST)
// ============================================================================
export default function ImpactROISection() {
  // Global section currency toggle (default: INR for Indian market focus)
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  return (
    <section
      id="impact-roi"
      aria-label="Impact & ROI Section"
      className="relative z-10 w-full py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#F4F7FA] text-[#14261C] font-sans overflow-hidden"
    >
      {/* Seamless transition gradients between sections */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Top blend from VideoBackgroundSection (#F4F6F2) */}
        <div
          className="absolute top-0 inset-x-0 h-24 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, #F4F6F2 0%, rgba(244, 246, 242, 0.6) 50%, transparent 100%)',
          }}
        />

        {/* Ambient subtle green radial gradient */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#00B36E]/4 rounded-full blur-[140px]" />

        {/* Bottom blend into OutcomeSection (#EBF3E8) */}
        <div
          className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top, #EBF3E8 0%, rgba(235, 243, 232, 0.6) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Container - constrained to max-7xl and centered */}
      <div className="max-w-7xl w-full mx-auto relative z-20 flex flex-col items-center">
        {/* Header: Editorial Typography & Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-2"
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#00B36E]/30 text-[#008751] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00B36E]" aria-hidden="true" />
            <span>MEASURABLE IMPACT &amp; ROI</span>
          </div>

          {/* Master Headline */}
          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#0F2216] leading-[1.12] tracking-tight">
            The Compounding Economics of{' '}
            <span className="italic text-[#008751]">
              Autonomous Flow.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#3A5043] font-sans font-medium leading-relaxed max-w-2xl mx-auto">
            Real estate brokerages running TerraFlow systematically multiply pipeline, compress sales cycles, and eliminate administrative overhead.
          </p>
        </motion.div>

        {/* Mobile-First Responsive Bento Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Bento Card 1: Master ROI Calculator (1 col mobile, 8 cols desktop) with INR / USD Toggle */}
          <div className="w-full lg:col-span-8">
            <MasterRoiCalculator currency={currency} setCurrency={setCurrency} />
          </div>

          {/* Bento Card 2: 3.2s Speed-to-Lead Simulation (1 col mobile, 4 cols desktop) */}
          <div className="w-full lg:col-span-4">
            <SpeedToLeadSimulation />
          </div>

          {/* Bento Card 3: Zero Lead Leakage Stream (1 col mobile, 4 cols desktop) */}
          <div className="w-full lg:col-span-4">
            <ZeroLeadLeakage />
          </div>

          {/* Bento Card 4: Hours Reclaimed Simulator (1 col mobile, 4 cols desktop) */}
          <div className="w-full lg:col-span-4">
            <HoursReclaimedSimulator currency={currency} />
          </div>

          {/* Bento Card 5: Intent Scoring & Buyer Qualification (1 col mobile, 4 cols desktop) */}
          <div className="w-full lg:col-span-4">
            <IntentScoringCard currency={currency} />
          </div>

          {/* Bento Card 6: Cumulative Proof Strip (1 col mobile, 12 cols desktop) */}
          <div className="w-full lg:col-span-12">
            <BenchmarkStrip currency={currency} />
          </div>
        </div>

        {/* Bottom CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 text-center w-full px-4"
        >
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#00B36E] hover:bg-[#009E60] active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide shadow-[0_4px_20px_rgba(0,179,110,0.32)] transition-all cursor-pointer group"
          >
            <span>Lock in Early Access &amp; Custom ROI Model</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
