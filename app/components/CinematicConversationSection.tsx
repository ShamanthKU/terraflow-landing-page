'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Send } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// LIGHTWEIGHT CANVAS: DRIFTING DAWN MIST PARTICLES
// ============================================================================
function DriftingMistParticles({
  mouseRatio,
  isFormHovered,
}: {
  mouseRatio: { x: number; y: number };
  isFormHovered: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 1200;
    let height = 800;

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

    // Generate soft, luminous morning mist motes
    const count = 38;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      baseAlpha: Math.random() * 0.28 + 0.08,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.1), // gently drift upwards like morning haze
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Mouse influence on air drift
      const targetDriftX = (mouseRatio.x - 0.5) * 0.4;
      const alphaMultiplier = isFormHovered ? 1.25 : 1.0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + targetDriftX;
        p.y += p.vy;

        // Wrap around seamlessly
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const pulse = Math.sin(frame * p.pulseSpeed + p.pulsePhase);
        const alpha = Math.max(0.04, Math.min(0.55, (p.baseAlpha + pulse * 0.06) * alphaMultiplier));

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        gradient.addColorStop(0, `rgba(45, 212, 191, ${alpha * 1.3})`); // Cyan core
        gradient.addColorStop(0.6, `rgba(59, 130, 246, ${alpha * 0.6})`); // Soft blue fringe
        gradient.addColorStop(1, 'rgba(11, 14, 20, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mouseRatio.x, isFormHovered]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
      aria-hidden="true"
    />
  );
}

// ============================================================================
// MAIN COMPONENT: ACT VI — THE CONVERSATION
// ============================================================================
export default function CinematicConversationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const fgLayerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const ambientLightRef = useRef<HTMLDivElement>(null);

  // Mouse tracking state with lerp for silky 60fps movement
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseRatio, setMouseRatio] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [isFormHovered, setIsFormHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [hpWebsite, setHpWebsite] = useState(''); // Honeypot trap
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // GSAP ScrollTrigger camera zoom & scroll transitions
  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !cameraContainerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Camera push forward on scroll entry (1.0 -> 1.06) and slow pull away on scroll past
      gsap.fromTo(
        cameraContainerRef.current,
        {
          scale: 1.0,
          opacity: 0.85,
        },
        {
          scale: 1.06,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.2,
          },
        }
      );

      // Scroll Exit: Camera gently pulls away, form becomes slightly transparent
      gsap.to([formPanelRef.current, ambientLightRef.current], {
        opacity: 0.65,
        y: 20,
        ease: 'power1.in',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Smooth mouse movement interpolation
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reducedMotion || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = Math.max(0, Math.min(1, x / rect.width));
      const ry = Math.max(0, Math.min(1, y / rect.height));

      // Centered offset from -1 to 1
      const offsetX = (rx - 0.5) * 2;
      const offsetY = (ry - 0.5) * 2;

      setMousePos({ x: offsetX, y: offsetY });
      setMouseRatio({ x: rx, y: ry });
    },
    [reducedMotion]
  );

  // Parallax physics applied to DOM nodes
  useEffect(() => {
    if (reducedMotion) return;

    // Background mountains: very subtle parallax (±4px)
    if (bgLayerRef.current) {
      bgLayerRef.current.style.transform = `translate3d(${mousePos.x * -5}px, ${mousePos.y * -4}px, 0)`;
    }

    // Midground terrain: moderate parallax (±9px)
    if (midLayerRef.current) {
      midLayerRef.current.style.transform = `translate3d(${mousePos.x * -9}px, ${mousePos.y * -7}px, 0)`;
    }

    // Foreground grass / mist: stronger parallax (±14px)
    if (fgLayerRef.current) {
      fgLayerRef.current.style.transform = `translate3d(${mousePos.x * -15}px, ${mousePos.y * -11}px, 0)`;
    }

    // Headline: subtle 1px maximum movement
    if (headlineRef.current) {
      headlineRef.current.style.transform = `translate3d(${mousePos.x * 1.2}px, ${mousePos.y * 1}px, 0)`;
    }

    // Form: 1-3px maximum movement
    if (formPanelRef.current) {
      formPanelRef.current.style.transform = `translate3d(${mousePos.x * 2.8}px, ${mousePos.y * 2.2}px, 0)`;
    }

    // Ambient cyan light: moves slightly towards cursor
    if (ambientLightRef.current) {
      ambientLightRef.current.style.transform = `translate3d(${mousePos.x * 25}px, ${mousePos.y * 18}px, 0)`;
    }
  }, [mousePos, reducedMotion]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          company: company.trim() || undefined,
          message: message.trim() || undefined,
          hp_website: hpWebsite, // honeypot
          source: 'website-act-vi-conversation',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Smooth scroll to existing waitlist section
  const handleScrollToWaitlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const waitlistEl = document.getElementById('waitlist') || document.getElementById('outcome');
    if (waitlistEl) {
      waitlistEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="conversation"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#0B0E14] text-[#E5EAF3] font-sans overflow-hidden py-24 sm:py-32 lg:py-40 flex items-center justify-center selection:bg-[#2DD4BF]/30 selection:text-[#2DD4BF]"
    >
      {/* ============================================================== */}
      {/* 1. SEAMLESS TRANSITION FROM PREVIOUS SECTION                  */}
      {/* ============================================================== */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#F4F7FA] via-[#0B0E14]/70 to-transparent pointer-events-none z-20" />

      {/* ============================================================== */}
      {/* 2. 3D CAMERA CONTAINER: CINEMATIC MULTI-LAYER PARALLAX        */}
      {/* ============================================================== */}
      <div
        ref={cameraContainerRef}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none will-change-transform"
      >
        {/* LAYER 3: BACKGROUND — PHOTOREALISTIC DAWN MOUNTAINS & SKY */}
        <div
          ref={bgLayerRef}
          className="absolute -inset-10 bg-cover bg-center transition-transform duration-700 ease-out opacity-85"
          style={{
            backgroundImage: `url('/images/cinematic_landscape.jpg')`,
            filter: 'brightness(0.88) contrast(1.06) saturate(0.95)',
          }}
        />

        {/* LAYER 2: MIDGROUND — SOFT VOLUMETRIC HAZE & EARLY MORNING CYAN HORIZON */}
        <div
          ref={midLayerRef}
          className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent transition-transform duration-500 ease-out"
        />

        {/* LAYER 1: FOREGROUND — DARK TEXTURED ENVIRONMENTAL GRADIENT & REFLECTIONS */}
        <div
          ref={fgLayerRef}
          className="absolute inset-0 transition-transform duration-300 ease-out pointer-events-none"
        >
          {/* Subtle wet reflective horizon sheen */}
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/85 to-transparent" />
        </div>

        {/* DRIFTING DAWN MIST PARTICLES CANVAS */}
        <DriftingMistParticles mouseRatio={mouseRatio} isFormHovered={isFormHovered} />
      </div>

      {/* ============================================================== */}
      {/* 3. DYNAMIC AMBIENT CYAN LIGHT FIELD (REACTS TO CURSOR & HOVER) */}
      {/* ============================================================== */}
      <div
        ref={ambientLightRef}
        className="absolute inset-0 pointer-events-none z-10 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle 600px at ${50 + mousePos.x * 15}% ${
            45 + mousePos.y * 15
          }%, rgba(45, 212, 191, ${isFormHovered ? 0.16 : 0.09}), rgba(59, 130, 246, 0.04) 50%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Atmospheric depth vignette at borders */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none z-10" />

      {/* ============================================================== */}
      {/* 4. MAIN CONTENT CONTAINER: TWO VISUAL ZONES                    */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* ------------------------------------------------------------ */}
        {/* LEFT ZONE: EDITORIAL HEADLINE & ATMOSPHERIC NARRATIVE        */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Section Label: ACT VI / THE CONVERSATION */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#151A23]/80 border border-[#2DD4BF]/25 shadow-[0_0_15px_rgba(45,212,191,0.12)] backdrop-blur-md mb-6 sm:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse shadow-[0_0_8px_#2DD4BF]" />
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#2DD4BF]">
              ACT VI / THE CONVERSATION
            </span>
          </motion.div>

          {/* Monumental Lato Headline */}
          <motion.h2
            ref={headlineRef}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#E5EAF3] font-sans font-black text-4xl sm:text-6xl xl:text-[74px] leading-[0.98] tracking-[-0.035em] transition-transform duration-300 ease-out"
          >
            Ready to turn your <br className="hidden sm:inline" />
            <span className="relative inline-block text-white">
              lead flow
              {/* Physically embedded atmospheric lighting halo */}
              <span
                className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-[#2DD4BF]/25 via-[#3B82F6]/15 to-transparent blur-2xl -z-10 rounded-full pointer-events-none"
                aria-hidden="true"
              />
            </span>{' '}
            into a system?
          </motion.h2>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 text-[#E5EAF3]/80 font-sans text-base sm:text-lg leading-relaxed max-w-[480px]"
          >
            Tell us what you&apos;re trying to improve. We&apos;ll show you where TerraFlow can
            create flow.
          </motion.p>

          {/* High-Intent Architecture Reassurance */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 sm:mt-12 pt-8 border-t border-white/[0.08] w-full max-w-[480px] grid grid-cols-2 gap-4 text-left"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] mt-2 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#E5EAF3]">Direct Architecture Review</p>
                <p className="text-[11px] text-[#E5EAF3]/55 leading-tight mt-0.5">
                  Evaluated by our systems team, not a generic script.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#E5EAF3]">Zero Commitment</p>
                <p className="text-[11px] text-[#E5EAF3]/55 leading-tight mt-0.5">
                  Honest assessment of automation feasibility.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT ZONE: CONVERSATION FORM PANEL (FLOATING GLASS PANEL)   */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
          <motion.div
            ref={formPanelRef}
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsFormHovered(true)}
            onMouseLeave={() => setIsFormHovered(false)}
            className="w-full max-w-[480px] relative rounded-[24px] bg-[#151A23]/75 backdrop-blur-2xl border border-[#E5EAF3]/10 shadow-[0_24px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(45,212,191,0.05)] p-7 sm:p-9 transition-all duration-300"
          >
            {/* Subtle glow edge inside form */}
            <div
              className={`absolute inset-0 rounded-[24px] pointer-events-none transition-opacity duration-500 ${
                isFormHovered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                boxShadow: 'inset 0 0 20px rgba(45, 212, 191, 0.08), 0 0 35px rgba(45, 212, 191, 0.12)',
              }}
              aria-hidden="true"
            />

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <form
                  onSubmit={handleSubmit}
                  className="relative z-10 flex flex-col gap-4 text-left"
                  noValidate
                >
                  <div className="mb-1">
                    <h3 className="text-lg font-bold text-[#E5EAF3] tracking-tight">
                      Start a Conversation
                    </h3>
                    <p className="text-xs text-[#E5EAF3]/60 mt-1">
                      Secondary path for teams ready to discuss custom workflows.
                    </p>
                  </div>

                  {/* Honeypot field (hidden from real users, traps bots) */}
                  <input
                    type="text"
                    name="hp_website"
                    tabIndex={-1}
                    value={hpWebsite}
                    onChange={(e) => setHpWebsite(e.target.value)}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* FIELD 1: Work Email (Required) */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-work-email"
                      className="text-xs font-medium text-[#E5EAF3]/80 flex items-center justify-between"
                    >
                      <span>Work email</span>
                      <span className="text-[#2DD4BF] text-[10px] font-bold uppercase tracking-wider">
                        Required
                      </span>
                    </label>
                    <input
                      id="contact-work-email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.12] text-sm text-[#E5EAF3] placeholder-[#E5EAF3]/40 focus:outline-none focus:border-[#2DD4BF] focus:bg-white/[0.06] focus:shadow-[0_0_16px_rgba(45,212,191,0.2)] transition-all"
                    />
                  </div>

                  {/* FIELD 2: Company / Team (Optional) */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-company"
                      className="text-xs font-medium text-[#E5EAF3]/80 flex items-center justify-between"
                    >
                      <span>Company / team</span>
                      <span className="text-[#E5EAF3]/40 text-[10px]">Optional</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      placeholder="Your company or team"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.12] text-sm text-[#E5EAF3] placeholder-[#E5EAF3]/40 focus:outline-none focus:border-[#2DD4BF] focus:bg-white/[0.06] focus:shadow-[0_0_16px_rgba(45,212,191,0.2)] transition-all"
                    />
                  </div>

                  {/* FIELD 3: Message (Optional) */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-xs font-medium text-[#E5EAF3]/80 flex items-center justify-between"
                    >
                      <span>Message</span>
                      <span className="text-[#E5EAF3]/40 text-[10px]">Optional</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      placeholder="What are you trying to improve?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-sm text-[#E5EAF3] placeholder-[#E5EAF3]/40 focus:outline-none focus:border-[#2DD4BF] focus:bg-white/[0.06] focus:shadow-[0_0_16px_rgba(45,212,191,0.2)] transition-all resize-none"
                    />
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                      {errorMessage}
                    </div>
                  )}

                  {/* PRIMARY ACTION BUTTON */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="relative group mt-2 w-full h-[50px] rounded-full bg-[#2DD4BF] hover:bg-[#20caa9] text-[#0B0E14] font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(45,212,191,0.25)] hover:shadow-[0_8px_24px_rgba(45,212,191,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none disabled:transform-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#0B0E14]" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Start a Conversation</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* SUCCESS STATE */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-8 px-4 flex flex-col items-center text-center gap-3 relative z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] shadow-[0_0_24px_rgba(45,212,191,0.25)]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-[#E5EAF3]">Message received.</h4>
                  <p className="text-sm text-[#E5EAF3]/75 max-w-[320px]">
                    We&apos;ll be in touch soon. Our team is reviewing your context.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail('');
                      setCompany('');
                      setMessage('');
                    }}
                    className="mt-4 text-xs font-semibold text-[#2DD4BF] hover:underline"
                  >
                    Send another note
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* WAITLIST RELATIONSHIP: SECONDARY PATH */}
            <div className="mt-5 pt-4 border-t border-white/[0.08] text-center text-xs text-[#E5EAF3]/60 flex items-center justify-center gap-1.5">
              <span>Not ready to talk yet?</span>
              <a
                href="#waitlist"
                onClick={handleScrollToWaitlist}
                className="text-[#2DD4BF] hover:text-[#2DD4BF]/80 font-medium inline-flex items-center gap-0.5 hover:underline transition-colors"
              >
                <span>Join the waitlist</span>
                <span className="text-[11px]">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. SEAMLESS TRANSITION TO MONUMENTAL FOOTER (OUTCOME)          */}
      {/* ============================================================== */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#EBF3E8] via-[#0B0E14]/70 to-transparent pointer-events-none z-20" />
    </section>
  );
}
