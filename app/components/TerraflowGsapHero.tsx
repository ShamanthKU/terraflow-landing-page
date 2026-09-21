'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Bot,
  Compass,
  Cpu,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Building2,
  PhoneCall,
  Activity,
  Layers,
} from 'lucide-react';
import AtmosphericFog from './AtmosphericFog';
import WaitlistCard from './WaitlistCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TerraflowGsapHero() {
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Layer Refs
  const skyRef = useRef<HTMLDivElement>(null);
  const midgroundRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const waitlistLayerRef = useRef<HTMLDivElement>(null);
  const waitlistCardRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);

  // Headline parts for staged emergence
  const headlinePart1Ref = useRef<HTMLSpanElement>(null);
  const headlinePart2Ref = useRef<HTMLSpanElement>(null);
  const supportingCopyRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to Waitlist Card inside the hero
  const scrollToWaitlist = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const trigger = ScrollTrigger.getById('hero-trigger');
    if (trigger) {
      const targetY = trigger.start + (trigger.end - trigger.start) * 0.62;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  // Smooth scroll to Next Section
  const scrollToNextSection = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const nextSec = document.getElementById('lead-chaos');
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Ensure video autoplays smoothly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handled silently for modern browsers
      });
    }
  }, []);

  useEffect(() => {
    if (!heroRef.current || !sceneRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Subtle desktop mouse parallax (transforms only, no layout thrashing)
    let ctxMouse: ((e: MouseEvent) => void) | null = null;
    if (!isMobile && !prefersReducedMotion) {
      const mouseXToVideo = gsap.quickTo(midgroundRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
      const mouseXToTypography = gsap.quickTo(typographyRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
      const mouseXToWaitlist = gsap.quickTo(waitlistCardRef.current, 'x', { duration: 0.5, ease: 'power2.out' });

      ctxMouse = (e: MouseEvent) => {
        const xOffset = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        mouseXToVideo(xOffset * 8);       // subtle landscape camera drift
        mouseXToTypography(xOffset * 14); // mid-layer text
        mouseXToWaitlist(xOffset * 18);   // foreground waitlist card
      };

      window.addEventListener('mousemove', ctxMouse);
    }

    // GSAP Context to ensure clean scoping and cleanup on unmount
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Master ScrollTrigger Timeline: 10-second normalized duration
      // Buttery smooth scrub (0.25s for instant responsive feedback)
      const baseDistance = isMobile ? 80 : 160;
      const scrollDistance = isMobile ? '+=130%' : '+=180%';

      const masterTl = gsap.timeline({
        scrollTrigger: {
          id: 'hero-trigger',
          trigger: heroRef.current,
          start: 'top top',
          end: scrollDistance,
          pin: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Living Landscape Video - Subtle camera forward glide (GPU accelerated transforms only)
      if (midgroundRef.current) {
        masterTl.to(
          midgroundRef.current,
          {
            scale: 1.05,
            yPercent: -4,
            duration: 10,
            ease: 'none',
          },
          0
        );
      }

      // Atmospheric Sky Soft Mist Drift
      if (skyRef.current) {
        masterTl.to(
          skyRef.current,
          {
            yPercent: -3,
            duration: 10,
            ease: 'none',
          },
          0
        );
      }

      // Hero Typography Layer (Heading + Subtitle + CTA as one unified unit)
      // Glides upward and dissolves smoothly from 0% to 42% scroll
      masterTl.to(
        typographyRef.current,
        {
          y: -baseDistance * 0.75,
          opacity: 0,
          duration: 4.2,
          ease: 'power2.inOut',
        },
        0
      );

      // Floating Dashboard KPI Cards Layer
      // Glides upward and dissolves with the typography
      if (floatingCardsRef.current) {
        masterTl.to(
          floatingCardsRef.current,
          {
            y: -baseDistance * 0.7,
            opacity: 0,
            duration: 4.0,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // Atmosphere Motes drift gently
      if (atmosphereRef.current) {
        masterTl.to(
          atmosphereRef.current,
          {
            y: -30,
            opacity: 0.5,
            duration: 10,
            ease: 'none',
          },
          0
        );
      }

      // WAITLIST CARD REVEAL:
      // Emerges smoothly from landscape as typography exits (35% to 62% scroll)
      // Stays centered and interactive, then transitions smoothly near 85%
      masterTl.set(
        waitlistCardRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
          pointerEvents: 'none',
        },
        0
      );

      masterTl.to(
        waitlistCardRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          duration: 2.2,
          ease: 'power2.out',
        },
        3.5
      );

      // Card remains perfectly centered and visible, then gently dissolves into fog at exit
      masterTl.to(
        waitlistCardRef.current,
        {
          opacity: 0,
          y: -25,
          scale: 0.97,
          pointerEvents: 'none',
          duration: 1.4,
          ease: 'power1.in',
        },
        8.2
      );

      // Layer 7: Atmospheric Fog Soft Increase near Hero Exit
      // Natural morning mist rolls in smoothly as user scrolls towards Section 02
      // On initial load, it remains 0 opacity so the full 3D video meadow is 100% visible!
      if (fogRef.current) {
        masterTl.fromTo(
          fogRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 2.2,
            ease: 'power1.inOut',
          },
          7.4
        );
      }

    }, heroRef);

    return () => {
      if (ctxMouse) window.removeEventListener('mousemove', ctxMouse);
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      id="hero"
      aria-label="Terraflow Cinematic 3D Hero"
      className="relative z-20 w-full h-screen overflow-clip bg-[#F4F7FA] selection:bg-emerald-200 selection:text-emerald-950 font-sans"
    >
      {/* ==================================================== */}
      {/* HERO SCENE (3D Camera Viewport with Genuine Depth)    */}
      {/* ==================================================== */}
      <div 
        ref={sceneRef} 
        className="hero-scene relative w-full h-full overflow-x-clip overflow-y-visible flex flex-col justify-between"
      >

        {/* ---------------------------------------------------- */}
        {/* LIVING LANDSCAPE VIDEO LAYER (Primary Visual Source)  */}
        {/* Continuous natural breeze, swaying meadow landscape  */}
        {/* ---------------------------------------------------- */}
        <div 
          ref={midgroundRef}
          className="living-video-layer absolute -top-[5%] -left-[4%] -right-[4%] bottom-0 w-[108%] h-[105%] pointer-events-none z-0 will-change-transform"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 40px), rgba(0,0,0,0.7) calc(100% - 15px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 40px), rgba(0,0,0,0.7) calc(100% - 15px), transparent 100%)',
          }}
        >
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            poster="/images/layers/video_frame_0.jpg"
            className="w-full h-full object-cover object-[center_55%]"
          >
            <source src="/videos/terraflow-breeze.mp4" type="video/mp4" />
          </video>
          {/* Subtle natural atmospheric light filter */}
          <div 
            ref={skyRef}
            className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none" 
          />
        </div>

        {/* ---------------------------------------------------- */}
        {/* LAYER 6: ATMOSPHERE-LAYER (Particles & Pollen Motes) */}
        {/* Floating natural pollen with independent depth       */}
        {/* ---------------------------------------------------- */}
        <div 
          ref={atmosphereRef}
          className="atmosphere-layer absolute inset-0 pointer-events-none z-4 overflow-clip"
        >
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/45 pointer-events-none animate-pulse"
              style={{
                top: `${(i * 19) % 85}%`,
                left: `${(i * 23) % 92}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                filter: 'blur(0.6px)',
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* ---------------------------------------------------- */}
        {/* LAYER 5: TYPOGRAPHY-LAYER (Editorial Headline)       */}
        {/* ---------------------------------------------------- */}
        <div 
          ref={typographyRef}
          className="typography-layer relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 max-w-5xl mx-auto w-full pt-4 sm:pt-14 pb-6 sm:pb-28 will-change-transform"
        >
          {/* Eyebrow Stage Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#00B36E]/20 text-[#00B36E] text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-sm mb-3 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00B36E]" aria-hidden="true" />
            <span>AI Real Estate Automation</span>
          </div>

          {/* Semantic H1 Headline in Newsreader Editorial Serif */}
          <h1 className="w-full text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.08] tracking-tight select-none font-editorial">
            <span 
              ref={headlinePart1Ref}
              className="headline-part-1 block text-[#15271D] drop-shadow-[0_2px_16px_rgba(255,255,255,0.92)] font-normal"
            >
              Turn Every Lead.
            </span>
            <span 
              ref={headlinePart2Ref}
              className="headline-part-2 block text-[#00B36E] italic font-normal tracking-normal mt-1 sm:mt-2 drop-shadow-[0_2px_18px_rgba(255,255,255,0.95)]"
            >
              Into a Site Visit.
            </span>
          </h1>

          {/* Supporting Copy - High Contrast Frosted Container */}
          <div 
            ref={supportingCopyRef}
            className="mt-3 sm:mt-7 max-w-2xl px-4 sm:px-7 py-2.5 sm:py-4 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgba(20,40,25,0.06)]"
          >
            <p 
              className="font-sans text-xs sm:text-sm md:text-base text-[#2D3748] font-medium leading-relaxed"
              style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
            >
              Autonomous AI agents that qualify buyer intent, follow up across channels 24/7, and book verified site tours into your pipeline.
            </p>
          </div>

          {/* Primary Hero CTA: Join the Waitlist */}
          <div 
            ref={ctaGroupRef}
            className="mt-4 sm:mt-8 flex items-center justify-center w-full sm:w-auto px-4 pointer-events-auto"
          >
            <button 
              type="button"
              onClick={scrollToWaitlist}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-sans font-semibold text-sm tracking-wide bg-[#00B36E] text-white shadow-[0_6px_20px_rgba(0,179,110,0.32)] hover:bg-[#009E60] hover:shadow-[0_10px_26px_rgba(0,179,110,0.42)] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B36E]"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          </div>

          {/* Scroll Prompt Indicator */}
          <div 
            ref={scrollIndicatorRef}
            className="mt-6 sm:mt-8 flex flex-col items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#1A3828]/70 tracking-widest uppercase select-none cursor-pointer"
            onClick={scrollToWaitlist}
          >
            <span>Scroll to join waitlist</span>
            <div className="w-4 h-6 rounded-full border-2 border-[#1A3828]/35 flex justify-center p-1" aria-hidden="true">
              <div className="w-1 h-1.5 rounded-full bg-[#1A3828] animate-bounce" />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* LAYER 5.5: FLOATING DASHBOARD KPI CARDS (HERO)       */}
        {/* Interactive motion graphics inside each card         */}
        {/* ---------------------------------------------------- */}
        <div
          ref={floatingCardsRef}
          className="floating-cards-layer absolute inset-0 pointer-events-none z-15 overflow-hidden will-change-transform flex justify-center"
        >
          <div className="relative w-full max-w-[1560px] 2xl:max-w-[1680px] h-full pointer-events-none px-3 sm:px-6">
            {/* CARD 1 (TOP LEFT): AI VOICE CONCIERGE & DYNAMIC WAVEFORM */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 0.4, 0] }}
              transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.04, y: -16 }}
              className="hidden lg:flex absolute left-2 xl:left-4 2xl:left-10 top-18 sm:top-20 xl:top-24 w-[295px] lg:w-[310px] xl:w-[325px] 2xl:w-[355px] flex-col gap-2.5 p-4 sm:p-4.5 xl:p-5 rounded-2xl bg-white/92 backdrop-blur-xl border border-white/95 shadow-[0_20px_48px_rgba(15,40,25,0.12)] text-left pointer-events-auto cursor-default transition-shadow group"
            >
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/90 text-[#008751] flex items-center justify-center shadow-inner group-hover:bg-[#008751] group-hover:text-white transition-colors">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#14261C] block">AI Voice Concierge</span>
                    <span className="text-[10px] text-[#64748B]">Autonomous Inbound Agent</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[#008751] border border-emerald-200/80 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B36E] animate-ping" />
                  <span className="text-[10px] font-bold font-mono">Live Call</span>
                </div>
              </div>

              {/* Dynamic Sound Waveform Graphic */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50/90 border border-slate-100">
                <div className="flex items-center gap-1.5 h-5">
                  {[0.35, 0.95, 0.5, 1.0, 0.7, 0.4, 0.85, 0.6].map((bar, idx) => (
                    <motion.span
                      key={idx}
                      animate={{ height: ['20%', `${Math.round(bar * 100)}%`, '30%'] }}
                      transition={{
                        duration: 1.2 + idx * 0.12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: idx * 0.08,
                      }}
                      className="w-1 rounded-full bg-gradient-to-t from-[#008751] to-[#2DD4BF]"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-[#008751] bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  180ms Latency
                </span>
              </div>

              {/* Real-Time Dialogue Bubble Simulation */}
              <div className="space-y-1.5 text-[10px]">
                <div className="p-2 rounded-xl bg-slate-100/80 text-[#334155] border border-slate-200/60 leading-tight">
                  <span className="font-bold text-[#0F172A] block text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Caller (HNW Buyer):</span>
                  &ldquo;Is the Marina Penthouse available for Sunday 11am walkthrough?&rdquo;
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/90 text-[#14261C] border border-emerald-200/60 leading-tight">
                  <span className="font-bold text-[#008751] block text-[9px] uppercase tracking-wider mb-0.5">TerraFlow AI:</span>
                  &ldquo;Tour confirmed for Sunday 11:00 AM. Biometric access sent.&rdquo;
                </div>
              </div>

              {/* Card Footer Status */}
              <div className="pt-2 border-t border-slate-100/90 flex items-center justify-between text-[10px] font-medium text-[#475569]">
                <span className="flex items-center gap-1 text-[#008751] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Speech Accuracy: 99.8%</span>
                </span>
                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                  Synced
                </span>
              </div>
            </motion.div>

            {/* CARD 2 (TOP RIGHT): NEURAL BUYER-PROPERTY MATCH MATRIX */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, -0.4, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              whileHover={{ scale: 1.04, y: -18 }}
              className="hidden lg:flex absolute right-2 xl:right-4 2xl:right-10 top-16 sm:top-18 xl:top-22 w-[300px] lg:w-[315px] xl:w-[330px] 2xl:w-[360px] flex-col gap-2.5 p-4 sm:p-4.5 xl:p-5 rounded-2xl bg-white/92 backdrop-blur-xl border border-white/95 shadow-[0_20px_48px_rgba(15,40,25,0.12)] text-left pointer-events-auto cursor-default transition-shadow group"
            >
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100/90 text-teal-800 flex items-center justify-center shadow-inner group-hover:bg-[#008751] group-hover:text-white transition-colors">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#14261C] block">Neural Match Engine</span>
                    <span className="text-[10px] text-[#64748B]">Listing Affinity Matrix</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-[#008751] border border-emerald-200 shadow-xs">
                  99.4% Match
                </span>
              </div>

              {/* Subject Listing Details */}
              <div className="p-2 rounded-xl bg-slate-50/90 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#14261C] block">Sky Villa 18 · Harbor Point</span>
                  <span className="text-[10px] text-[#64748B]">Target: Sovereign Capital Exec</span>
                </div>
                <span className="text-xs font-black text-[#008751] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  $6.40M
                </span>
              </div>

              {/* Vector Affinity Progress Bars */}
              <div className="space-y-1 text-[10px]">
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[#334155] font-semibold">
                    <span>Budget Calibration ($6M–$8M)</span>
                    <span className="text-[#008751] font-bold">100%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      animate={{ width: ['80%', '100%', '95%', '100%'] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="h-full rounded-full bg-[#00B36E]"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[#334155] font-semibold">
                    <span>Panoramic Ocean View</span>
                    <span className="text-teal-700 font-bold">98%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      animate={{ width: ['75%', '98%', '92%', '98%'] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                      className="h-full rounded-full bg-[#2DD4BF]"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[#334155] font-semibold">
                    <span>30-Day Escrow Readiness</span>
                    <span className="text-amber-700 font-bold">96%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      animate={{ width: ['70%', '96%', '90%', '96%'] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                      className="h-full rounded-full bg-[#FFB800]"
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold">
                <span className="text-[#008751] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>POF Verified</span>
                </span>
                <span className="text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Deal Room Active →
                </span>
              </div>
            </motion.div>

            {/* CARD 3 (MID LEFT): OMNICHANNEL AUTONOMOUS DISPATCH HUB */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -0.4, 0] }}
              transition={{ duration: 5.0, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              whileHover={{ scale: 1.04, y: -15 }}
              className="hidden xl:flex absolute left-2 xl:left-4 2xl:left-10 top-[51%] xl:top-[53%] w-[295px] lg:w-[305px] xl:w-[320px] 2xl:w-[350px] flex-col gap-2 p-3.5 sm:p-4 rounded-2xl bg-white/92 backdrop-blur-xl border border-white/95 shadow-[0_20px_48px_rgba(15,40,25,0.12)] text-left pointer-events-auto cursor-default transition-shadow group"
            >
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-inner group-hover:bg-[#008751] group-hover:text-white transition-colors">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#14261C] block">Omnichannel Inflow</span>
                    <span className="text-[10px] text-[#64748B]">Multi-Stream Routing</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#008751] border border-emerald-200">
                  Zero Leakage
                </span>
              </div>

              {/* Protocol Dispatch Streams */}
              <div className="space-y-1 text-[10px]">
                <div className="p-1.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00B36E] animate-pulse" />
                    <span className="font-bold text-[#14261C]">WhatsApp VIP API</span>
                  </div>
                  <span className="font-mono font-bold text-[#008751]">Replied in 12s</span>
                </div>

                <div className="p-1.5 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span className="font-bold text-[#14261C]">MLS & Zillow Premier</span>
                  </div>
                  <span className="font-mono font-bold text-teal-800">Enriched</span>
                </div>

                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="font-bold text-[#14261C]">Instagram DM Portal</span>
                  </div>
                  <span className="font-mono font-bold text-amber-800">HNW Lead</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-[#475569]">
                <span>Today: <strong className="text-[#14261C]">148 Inquiries</strong></span>
                <span className="font-bold text-[#008751]">100% SLA Active</span>
              </div>
            </motion.div>

            {/* CARD 4 (MID RIGHT): PIPELINE VELOCITY & ESCROW HEALTH */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 0.4, 0] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              whileHover={{ scale: 1.04, y: -16 }}
              className="hidden xl:flex absolute right-2 xl:right-4 2xl:right-10 top-[49%] xl:top-[51%] w-[300px] lg:w-[315px] xl:w-[330px] 2xl:w-[360px] flex-col gap-2 p-3.5 sm:p-4 xl:p-4.5 rounded-2xl bg-white/92 backdrop-blur-xl border border-white/95 shadow-[0_20px_48px_rgba(15,40,25,0.12)] text-left pointer-events-auto cursor-default transition-shadow group"
            >
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/90 text-amber-800 flex items-center justify-center shadow-inner group-hover:bg-[#008751] group-hover:text-white transition-colors">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#14261C] block">Pipeline Velocity Index</span>
                    <span className="text-[10px] text-[#64748B]">Autonomous Escrow Engine</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#008751] border border-emerald-300">
                  Health: 98.6 / 100
                </span>
              </div>

              {/* Volume Financial Highlight */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] block font-medium">Active Pipeline Under Contract</span>
                  <span className="text-base font-black text-[#14261C]">$34,850,000</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block font-medium">Commissions Locked</span>
                  <span className="text-xs font-bold text-[#008751] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +$871,250
                  </span>
                </div>
              </div>

              {/* 4-Stage Transaction Progression Ring / Stepper */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-bold">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-[#008751] border border-emerald-200">
                  <span>Deposit</span>
                  <span className="block text-[10px] mt-0.5">✓</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-50 text-[#008751] border border-emerald-200">
                  <span>Title</span>
                  <span className="block text-[10px] mt-0.5">✓</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-100/80 text-[#008751] border border-emerald-300 ring-2 ring-emerald-400/30 animate-pulse">
                  <span>Signoff</span>
                  <span className="block text-[10px] mt-0.5">● Active</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                  <span>Close</span>
                  <span className="block text-[10px] mt-0.5">🔒</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold">
                <span className="text-[#008751] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>14 Closings On Schedule</span>
                </span>
                <span className="text-[#64748B]">Zero Delay Risk</span>
              </div>
            </motion.div>

            {/* CARD 5: AMBIENT FLOATING CORE INTELLIGENCE PILL */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 6.0, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              whileHover={{ scale: 1.03, y: -10 }}
              className="hidden 2xl:inline-flex absolute left-1/2 -translate-x-1/2 bottom-8 items-center gap-2.5 px-4 py-2 rounded-full bg-white/92 backdrop-blur-xl border border-white/95 shadow-[0_12px_28px_rgba(20,50,30,0.1)] pointer-events-auto cursor-default z-20 text-left"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#008751] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#008751]" />
              </div>
              <span className="text-[11px] font-bold text-[#14261C]">TerraFlow Intelligence:</span>
              <span className="text-[11px] text-[#475569] flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B36E] animate-pulse" />
                240+ Brokerages Active · 100% Autonomous Site Tour Routing
              </span>
            </motion.div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* LAYER 7: WAITLIST CARD (Replaces Old Dashboard UI)   */}
        {/* Embedded seamlessly inside the landscape             */}
        {/* ---------------------------------------------------- */}
        <div 
          ref={waitlistLayerRef}
          className="waitlist-card-layer absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4"
        >
          <div
            ref={waitlistCardRef}
            className="w-full max-w-md pointer-events-auto opacity-0 will-change-transform flex justify-center"
          >
            <WaitlistCard />
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* DYNAMIC ATMOSPHERIC FOG HORIZON                      */}
        {/* Transparent on load so the full video is crystal     */}
        {/* clear and visible; rolls in dynamically on scroll!   */}
        {/* ---------------------------------------------------- */}
        <div 
          ref={fogRef} 
          className="atmospheric-fog-layer absolute inset-x-0 bottom-0 z-25 pointer-events-none will-change-transform opacity-0"
        >
          <AtmosphericFog />
          <div 
            className="absolute inset-x-0 -bottom-1 pointer-events-none z-30"
            style={{
              height: '160px',
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(244, 247, 250, 0.25) 35%, rgba(244, 247, 250, 0.7) 65%, rgba(244, 247, 250, 0.95) 88%, #F4F7FA 100%)',
            }}
          />
        </div>

      </div>
    </section>
  );
}
