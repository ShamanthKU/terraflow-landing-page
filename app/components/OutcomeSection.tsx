'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Home,
  UserCheck,
  Trophy,
  ShieldCheck,
  Check,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Zap,
} from 'lucide-react';

// ============================================================================
// CANVAS: CALM OPPORTUNITY PATH & BREATHING MEADOW
// ============================================================================
function OpportunityCanvas({
  isSubmitted,
  mousePos,
}: {
  isSubmitted: boolean;
  mousePos: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 1200;
    let height = 900;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Drifting pollen motes & subtle fireflies
    const particleCount = 42;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.35,
      size: 1.2 + Math.random() * 2,
      baseAlpha: 0.2 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    let pulseProgress = 0;
    let t = 0;

    const render = () => {
      t += 0.012;
      ctx.clearRect(0, 0, width, height);

      // --- 1. Organic Opportunity Path (Winding gracefully from Act IV) ---
      const p0 = { x: width * 0.5, y: 0 };
      const p1 = { x: width * 0.53, y: height * 0.25 };
      const p2 = { x: width * 0.47, y: height * 0.6 };
      const p3 = { x: width * 0.5, y: height };

      // Soft luminous outer path glow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx.strokeStyle = isSubmitted
        ? 'rgba(0, 212, 134, 0.4)'
        : 'rgba(0, 179, 110, 0.16)';
      ctx.lineWidth = 22 + Math.sin(t * 1.5) * 4;
      ctx.lineCap = 'round';
      ctx.filter = 'blur(14px)';
      ctx.stroke();
      ctx.restore();

      // Sharp luminous core flow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0, 179, 110, 0.85)');
      grad.addColorStop(0.3, 'rgba(255, 215, 0, 0.65)');
      grad.addColorStop(0.65, 'rgba(0, 212, 134, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = isSubmitted ? 3.5 : 2;
      ctx.stroke();
      ctx.restore();

      // Moving luminous signals gliding down the opportunity path
      const packetCount = isSubmitted ? 5 : 3;
      for (let p = 0; p < packetCount; p++) {
        const offset = ((t * 0.16 + p / packetCount) % 1);
        const u = 1 - offset;
        const tt = offset;
        const px =
          u * u * u * p0.x +
          3 * u * u * tt * p1.x +
          3 * u * tt * tt * p2.x +
          tt * tt * tt * p3.x;
        const py =
          u * u * u * p0.y +
          3 * u * u * tt * p1.y +
          3 * u * tt * tt * p2.y +
          tt * tt * tt * p3.y;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 3.5 + Math.sin(t * 3 + p) * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00B36E';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      // --- 2. Ambient Drifting Pollen / Butterfly Motes ---
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.y += pt.vy;
        pt.x += pt.vx + Math.sin(t + pt.phase) * 0.25;

        if (pt.y < 0) {
          pt.y = height + 10;
          pt.x = Math.random() * width;
        }
        if (pt.x < 0) pt.x = width;
        if (pt.x > width) pt.x = 0;

        let alpha = pt.baseAlpha * (0.8 + Math.sin(t * 2 + pt.phase) * 0.2);
        let currentSize = pt.size;

        if (mousePos.x > 0 && mousePos.y > 0) {
          const dx = pt.x - mousePos.x;
          const dy = pt.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = 1 - dist / 150;
            pt.x += (dx / dist) * force * 1.2;
            pt.y += (dy / dist) * force * 1.2;
            alpha = Math.min(1, alpha + force * 0.6);
            currentSize = pt.size + force * 2;
          }
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = isSubmitted
          ? `rgba(0, 230, 140, ${alpha * 1.2})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(255, 235, 180, 0.5)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // --- 3. Submission Ripple Wave ---
      if (isSubmitted) {
        pulseProgress += 0.012;
        if (pulseProgress < 1.4) {
          const radius = pulseProgress * Math.max(width, height) * 0.6;
          ctx.save();
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.55, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 230, 140, ${Math.max(0, 0.35 - pulseProgress * 0.22)})`;
          ctx.lineWidth = 3.5;
          ctx.stroke();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isSubmitted, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

// ============================================================================
// MAIN COMPONENT: ACT V — THE OUTCOME
// ============================================================================
export default function OutcomeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -999, y: -999 });

  // Form states
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -999, y: -999 });
  };

  // Waitlist submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Please enter your work email.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid work email address.');
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
          source: 'terraflow-act-v-outcome',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const navOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

// ============================================================================
// GOOGLE ANTIGRAVITY-STYLE MONUMENTAL INTERACTIVE WORDMARK
// Physics-based spring repulsion wave & human-crafted tactile response
// ============================================================================
function AntigravityWordmark() {
  const letters = ['T', 'e', 'r', 'r', 'a', 'f', 'l', 'o', 'w'];
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [rippleActive, setRippleActive] = useState<boolean>(false);

  const triggerRipple = () => {
    if (rippleActive) return;
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 800);
  };

  return (
    <div
      onMouseLeave={() => setHoveredIdx(null)}
      onClick={triggerRipple}
      className="w-full select-none cursor-pointer overflow-hidden pt-8 sm:pt-14 pb-2"
      title="Click or glide across to feel antigravity"
    >
      <div className="w-full flex justify-between items-end">
        {letters.map((letter, idx) => {
          // Calculate fluid physics lift based on cursor proximity
          let targetY = 0;
          if (hoveredIdx !== null) {
            const dist = Math.abs(hoveredIdx - idx);
            if (dist === 0) targetY = -36;
            else if (dist === 1) targetY = -18;
            else if (dist === 2) targetY = -7;
          }

          return (
            <motion.span
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              animate={
                rippleActive
                  ? { y: [0, -36, 0] }
                  : { y: targetY }
              }
              transition={
                rippleActive
                  ? {
                      duration: 0.55,
                      delay: idx * 0.045,
                      ease: [0.16, 1, 0.3, 1],
                    }
                  : {
                      type: 'spring',
                      stiffness: 420,
                      damping: 24,
                      mass: 0.8,
                    }
              }
              whileTap={{ scale: 0.92, y: -40 }}
              className="inline-block font-sans font-black text-[#14261C] hover:text-[#00B36E] text-[clamp(3.6rem,14.5vw,14rem)] tracking-[-0.045em] leading-[0.82] transform-gpu will-change-transform transition-colors duration-200"
            >
              {letter}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

  return (
    <section
      ref={sectionRef}
      id="outcome"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen bg-[#EBF3E8] overflow-hidden flex flex-col justify-between"
    >
      {/* ============================================================== */}
      {/* 1. TRANSITION FROM ACT IV: LUMINOUS ENTRY BEAM                 */}
      {/* ============================================================== */}
      <div className="absolute top-0 inset-x-0 h-28 pointer-events-none z-20 flex flex-col items-center">
        <div className="w-full h-full bg-gradient-to-b from-[#F4F6F2] via-[#EBF3E8]/70 to-transparent" />
        <div className="absolute top-0 w-1 h-16 bg-gradient-to-b from-[#00B36E] to-[#FFD700] shadow-[0_0_16px_#00B36E] rounded-full animate-pulse" />
      </div>

      {/* ============================================================== */}
      {/* 2. LAYER 0 & 1: LIVING BREEZE MEADOW BACKGROUND VIDEO & HILLS */}
      {/* ============================================================== */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 scale-105 transform"
          style={{
            backgroundImage: `url('/images/layers/base-landscape.jpg')`,
            filter: 'saturate(1.25) brightness(1.06) contrast(1.05)',
          }}
        />

        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-70"
          style={{
            filter: 'saturate(1.3) contrast(1.1) brightness(1.08)',
          }}
        >
          <source src="/videos/terraflow-breeze.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 50% 15%, rgba(255, 250, 230, 0.45) 0%, rgba(240, 255, 240, 0.25) 45%, rgba(230, 245, 230, 0.6) 100%)',
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* 3. LAYER 2: INTERACTIVE OPPORTUNITY PATH & PARTICLES           */}
      {/* ============================================================== */}
      <OpportunityCanvas
        isSubmitted={status === 'success'}
        mousePos={mousePos}
      />

      {/* ============================================================== */}
      {/* 4. MAIN EDITORIAL CONTENT: HEADLINE + 3D ICONS + WAITLIST CARD */}
      {/* ============================================================== */}
      <div className="relative z-10 pt-24 sm:pt-32 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        
        {/* Eyebrow Stage Pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#00B36E]/30 text-[#008751] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00B36E]" aria-hidden="true" />
          <span>FROM LEAD TO OPPORTUNITY</span>
        </motion.div>

        {/* Editorial Master Headline (72–96px desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[88px] leading-[1.05] tracking-tight font-normal text-[#0F2216]">
            Stop Chasing Leads.
            <span className="block mt-2 sm:mt-3 italic font-normal text-[#008751] drop-shadow-[0_2px_24px_rgba(255,255,255,0.95)]">
              Start Growing Opportunities.
            </span>
          </h2>
        </motion.div>

        {/* Supporting Narrative Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-[#233A2D] font-sans font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)]"
        >
          Terraflow gives your sales team the intelligence, automation and follow-through to keep every opportunity moving.
        </motion.p>

        {/* ============================================================== */}
        {/* 3D INTERACTIVE ICONS NEXT TO CAPTURE · UNDERSTAND · ACT · CONVERT */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4"
        >
          {/* Step 1: Capture */}
          <motion.div
            whileHover={{ y: -3, scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-[#00B36E]/20 shadow-[0_4px_12px_rgba(0,179,110,0.08)] cursor-pointer group transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs shadow-sm group-hover:rotate-6 transition-transform">
              🎯
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#14261C]">Capture</span>
          </motion.div>

          <span className="text-[#008751]/30 font-bold hidden sm:inline">→</span>

          {/* Step 2: Understand */}
          <motion.div
            whileHover={{ y: -3, scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-[#00B36E]/20 shadow-[0_4px_12px_rgba(0,179,110,0.08)] cursor-pointer group transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-green-300 text-white flex items-center justify-center text-xs shadow-sm group-hover:rotate-6 transition-transform">
              🧠
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#14261C]">Understand</span>
          </motion.div>

          <span className="text-[#008751]/30 font-bold hidden sm:inline">→</span>

          {/* Step 3: Act */}
          <motion.div
            whileHover={{ y: -3, scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-[#00B36E]/20 shadow-[0_4px_12px_rgba(0,179,110,0.08)] cursor-pointer group transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-400 to-emerald-500 text-white flex items-center justify-center text-xs shadow-sm group-hover:rotate-6 transition-transform">
              ⚡
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#14261C]">Act</span>
          </motion.div>

          <span className="text-[#008751]/30 font-bold hidden sm:inline">→</span>

          {/* Step 4: Convert */}
          <motion.div
            whileHover={{ y: -3, scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-[#00B36E]/20 shadow-[0_4px_12px_rgba(0,179,110,0.08)] cursor-pointer group transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-400 to-yellow-400 text-white flex items-center justify-center text-xs shadow-sm group-hover:rotate-6 transition-transform">
              🏆
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#008751]">Convert</span>
          </motion.div>
        </motion.div>

        {/* ============================================================== */}
        {/* 5. INTERACTIVE DASHBOARD UI CARDS FLOATING AROUND WAITLIST CARD */}
        {/* ============================================================== */}
        <div className="relative w-full max-w-6xl mt-14 sm:mt-18">

          {/* ------------------------------------------------------------ */}
          {/* FLOATING CARD 1 (TOP LEFT): PIPELINE VELOCITY (ANIMATED BARS)*/}
          {/* ------------------------------------------------------------ */}
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, y: -14 }}
            className="hidden xl:flex absolute -left-14 -top-6 w-64 flex-col gap-2.5 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_16px_36px_rgba(20,50,30,0.12)] text-left z-20 cursor-default"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#008751] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#14261C]">Pipeline Velocity</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#008751] border border-emerald-200">
                +42% Faster
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div>
                <span className="text-xl font-black text-[#14261C]">4.2 mins</span>
                <span className="text-[10px] block text-[#475569]">Lead to tour confirmed</span>
              </div>
              {/* Motion Graphics: 4 Animated Equalizer / Velocity Bars */}
              <div className="flex items-end gap-1 h-8">
                <motion.div
                  animate={{ height: ['40%', '95%', '55%', '85%', '40%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 rounded-full bg-[#00B36E]"
                />
                <motion.div
                  animate={{ height: ['70%', '40%', '90%', '60%', '70%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="w-1.5 rounded-full bg-[#2DD4BF]"
                />
                <motion.div
                  animate={{ height: ['50%', '85%', '40%', '100%', '50%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="w-1.5 rounded-full bg-[#10B981]"
                />
                <motion.div
                  animate={{ height: ['85%', '50%', '80%', '45%', '85%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
                  className="w-1.5 rounded-full bg-[#FFB800]"
                />
              </div>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* FLOATING CARD 2 (TOP RIGHT): HIGH-INTENT BUYER QUALIFIED     */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            animate={{ y: [0, -11, 0] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -16 }}
            className="hidden xl:flex absolute -right-14 -top-6 w-68 flex-col gap-2.5 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_16px_36px_rgba(20,50,30,0.12)] text-left z-20 cursor-default"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                    SJ
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#14261C]">Sarah Jenkins</div>
                  <div className="text-[10px] text-[#64748B]">Villa Paradiso · $2.8M</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#008751] border border-emerald-300">
                Score: 98%
              </span>
            </div>

            {/* Motion Graphic: Animated Progress Bar */}
            <div className="space-y-1 mt-1">
              <div className="flex justify-between text-[10px] font-semibold text-[#334155]">
                <span>Intent Strength</span>
                <span className="text-[#008751] font-bold">Ultra High</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                <motion.div
                  animate={{ width: ['70%', '98%', '95%', '98%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-[#00B36E] shadow-sm"
                />
              </div>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* FLOATING CARD 3 (MIDDLE LEFT): AUTOMATED VIP TOUR DISPATCH   */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            whileHover={{ scale: 1.05, y: -15 }}
            className="hidden lg:flex absolute -left-14 top-48 w-64 flex-col gap-2 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_16px_36px_rgba(20,50,30,0.12)] text-left z-20 cursor-default"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#008751] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#14261C] block">VIP Tour Scheduled</span>
                <span className="text-[10px] text-[#475569]">Tomorrow · 2:30 PM PST</span>
              </div>
            </div>

            <div className="mt-1 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-[#475569] font-medium">Assigned Agent</span>
              <span className="font-bold text-[#008751] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B36E] animate-ping" />
                Marcus Vance
              </span>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* FLOATING CARD 4 (MIDDLE RIGHT): DEAL CLOSED & ESCROW REALIZED*/}
          {/* ------------------------------------------------------------ */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -14 }}
            className="hidden lg:flex absolute -right-14 top-48 w-68 flex-col gap-2 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_16px_36px_rgba(20,50,30,0.12)] text-left z-20 cursor-default"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#B47800] flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#14261C] block">Deal Converted</span>
                  <span className="text-[10px] text-[#475569]">Escrow Synchronized</span>
                </div>
              </div>
              <span className="text-xs font-black text-[#008751]">$2.45M</span>
            </div>

            <div className="mt-1 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-[#475569]">Commission Realized</span>
              <span className="font-bold text-[#14261C] bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                $61,250 locked
              </span>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* FLOATING CARD 5 (CENTER BOTTOM): MULTI-CHANNEL INFLOW BADGE */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            whileHover={{ scale: 1.04, y: -10 }}
            className="hidden md:inline-flex absolute left-1/2 -translate-x-1/2 -bottom-7 items-center gap-3 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-white shadow-[0_14px_30px_rgba(20,50,30,0.12)] z-20 cursor-default"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#008751] flex items-center justify-center text-xs shadow-sm">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#14261C]">Live Inflow Active:</span>
            <div className="text-xs text-[#475569] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00B36E] animate-pulse" />
              <span>18 Leads Qualified Today · 0 dropped</span>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* THE WAITLIST PORTAL CARD (650–720px wide, frosted glass)     */}
          {/* ============================================================ */}
          <motion.div
            id="waitlist"
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[680px] mx-auto relative z-10 scroll-mt-24"
          >
            <div
              className="relative rounded-3xl p-6 sm:p-10 md:p-12 backdrop-blur-2xl bg-white/80 sm:bg-white/85 border border-white/90 shadow-[0_24px_70px_rgba(20,50,30,0.12)] text-center transition-all duration-300"
              style={{
                boxShadow:
                  '0 24px 60px -12px rgba(20, 50, 30, 0.14), 0 0 0 1px rgba(255, 255, 255, 0.85) inset',
              }}
            >
              <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  /* SUCCESS STATE: "You're on the path." */
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-6 space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#008751] flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14261C]">
                      You&apos;re on the path.
                    </h3>
                    <p className="text-sm sm:text-base text-[#2A4435] max-w-md mx-auto leading-relaxed">
                      We&apos;ll let you know when Terraflow is ready for you.
                    </p>
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#008751] hover:text-[#006638] underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        ← Back to explore
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ACTIVE WAITLIST CARD FORM */
                  <motion.div
                    key="form-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2.5">
                      <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#122419] tracking-tight">
                        Be There When{' '}
                        <span className="italic text-[#008751]">The Flow Begins.</span>
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-[#3A5043] max-w-lg mx-auto font-sans font-medium leading-relaxed">
                        Terraflow is being built for sales teams that want every opportunity to move forward. Join the early access list.
                      </p>
                    </div>

                    {/* Input + Action Button */}
                    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
                      <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-white/95 p-1.5 rounded-2xl border border-[#00B36E]/25 shadow-sm focus-within:border-[#00B36E] focus-within:ring-2 focus-within:ring-[#00B36E]/20 transition-all">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Work email"
                          disabled={status === 'loading'}
                          className="w-full px-4 py-3 bg-transparent text-sm text-[#14261C] placeholder:text-[#3A5043]/50 focus:outline-none disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="w-full sm:w-auto shrink-0 px-7 py-3 rounded-xl bg-[#00B36E] hover:bg-[#009E60] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_4px_14px_rgba(0,179,110,0.32)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                        >
                          {status === 'loading' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Joining...</span>
                            </>
                          ) : (
                            <>
                              <span>Join Waitlist</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      {errorMessage && (
                        <p className="mt-2.5 text-xs text-rose-600 font-medium animate-in fade-in">
                          {errorMessage}
                        </p>
                      )}
                    </form>

                    {/* Assurance microcopy */}
                    <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#3A5043]/80">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#008751]" />
                      <span>No spam. Just Terraflow updates.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 6. TERRAFLOW DESIGN SYSTEM FOOTER (GOOGLE ANTIGRAVITY STYLE)    */}
      {/* ============================================================== */}
      <footer className="relative z-30 w-full bg-white border-t border-[#E5EAF3] mt-20 sm:mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-8 sm:pb-12 flex flex-col items-center text-center">
          
          {/* 1. CENTERED BRAND LOCKUP & FOOTER CONTENT */}
          <div className="flex flex-col items-center text-center w-full max-w-5xl mx-auto space-y-4 sm:space-y-5">
            {/* Clean, Sharp TerraFlow Brand Lockup */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#14261C] border border-[#00B36E]/40 flex items-center justify-center shadow-[0_4px_16px_rgba(0,179,110,0.22)] shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#00B36E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6.5h16M12 6.5v12M7.5 13l4.5 5.5 4.5-5.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-sans font-black tracking-tight text-2xl sm:text-3xl text-[#14261C] select-none">
                <span className="text-[#00B36E]">Terra</span>Flow
              </span>
              <span className="text-xs font-bold text-[#008751] bg-[#00B36E]/12 border border-[#00B36E]/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                AI
              </span>
            </div>

            {/* Enterprise Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B36E]/10 border border-[#00B36E]/25 text-[#008751] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B36E] animate-pulse" />
              <span>Autonomous Brokerage Intelligence</span>
            </div>

            {/* Single-Line Master Heading on Desktop/Computer View */}
            <h3 className="font-editorial text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] font-normal text-[#14261C] tracking-tight leading-snug md:whitespace-nowrap w-full">
              Close More Deals.{' '}
              <span className="italic text-[#008751]">Without Chasing Every Lead.</span>
            </h3>

            {/* Single-Line Subheading on Desktop/Computer View */}
            <p className="text-xs sm:text-sm md:text-base lg:text-[17px] text-[#3A5043] leading-relaxed md:whitespace-nowrap w-full font-sans font-medium">
              Autonomous AI agents that qualify buyer intent, follow up across channels 24/7, and book verified site tours into your pipeline.
            </p>

            {/* High-Converting Polished CTA Button */}
            <div className="pt-2">
              <a
                href="#waitlist"
                onClick={(e) => scrollToSection(e, 'waitlist')}
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#00B36E] hover:bg-[#009E60] active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wide shadow-[0_4px_20px_rgba(0,179,110,0.3)] hover:shadow-[0_8px_28px_rgba(0,179,110,0.42)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Professional Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-[#5C666E] font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008751]" />
                <span>SOC-2 Certified</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline" />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00B36E]" />
                <span>3.2s Contact Velocity</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline" />
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#008751]" />
                <span>Zero Lead Leakage</span>
              </span>
            </div>
          </div>

          {/* 2. HORIZONTAL NAVIGATION BAR (BELOW FOOTER CONTENT, NO PRODUCT HEADING) */}
          <nav
            aria-label="Footer navigation"
            className="w-full pt-10 sm:pt-12 pb-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-[#3A5043]"
          >
            {[
              { label: 'Flow Engine', href: '#intelligent-flow' },
              { label: 'The Problem', href: '#lead-chaos' },
              { label: 'Architecture', href: '#automation-architecture' },
              { label: 'Impact & ROI', href: '#impact-roi' },
              { label: 'Early Access', href: '#waitlist' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href.replace('#', ''))}
                className="relative py-1 hover:text-[#00B36E] transition-colors cursor-pointer group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00B36E] transition-all duration-200 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* 3. MONUMENTAL WORDMARK: GOOGLE ANTIGRAVITY FLUID PHYSICS WAVE */}
          <div className="w-full pt-4 sm:pt-6 pb-6 sm:pb-8">
            <AntigravityWordmark />
          </div>

          {/* 4. COMPLETE BOTTOM OF THE PAGE: COPYRIGHT, SYSTEM STATUS & BENGALURU, INDIA */}
          <div className="w-full pt-6 sm:pt-8 border-t border-[#E5EAF3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5C666E] font-medium">
            <div>© 2026 TerraFlow AI, Inc. All rights reserved.</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00B36E] animate-pulse" />
              <span className="text-[#14261C] font-semibold">All Systems Operational · 99.98% SLA</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#14261C]">
              <span>Bengaluru, India</span>
              <span className="text-sm">🇮🇳</span>
            </div>
          </div>

        </div>
      </footer>
    </section>
  );
}
