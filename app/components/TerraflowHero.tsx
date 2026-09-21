'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Building, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function TerraflowHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Master scroll tracking over the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Smooth scroll spring for ultra-fluid cinematic motion
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001
  });

  // Desktop Mouse Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    mouseX.set(x);
    mouseY.set(y);
  };

  // ----------------------------------------------------
  // SCROLL DEPTH TRANSFORMS (Percentages matched to specification)
  // ----------------------------------------------------

  // Layer 1 & 2: Sky & Distant Mountains (Very slow 1-4%, subtle scale)
  const skyY = useTransform(smoothScroll, [0, 1], ['0%', '-4%']);
  const skyScale = useTransform(smoothScroll, [0, 1], [1, 1.05]);
  const mountainMouseX = useTransform(smoothMouseX, [-1, 1], [-6, 6]);

  // Layer 4: Typography (Subtle depth movement & scale)
  // Text moves forward slightly relative to landscape, then gracefully transitions near end
  const textY = useTransform(smoothScroll, [0, 0.45, 0.75, 1], ['0%', '-8%', '-16%', '-28%']);
  const textScale = useTransform(smoothScroll, [0, 0.45, 1], [1, 1.02, 0.96]);
  const textOpacity = useTransform(smoothScroll, [0, 0.75, 0.95, 1], [1, 1, 0.3, 0]);
  const textMouseX = useTransform(smoothMouseX, [-1, 1], [-12, 12]);
  const textMouseY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);

  // Layer 5: Foreground Hills with Wildflowers (Fastest differential depth, rises over lower elements)
  const foregroundY = useTransform(smoothScroll, [0, 1], ['0%', '-12%']);
  const foregroundScale = useTransform(smoothScroll, [0, 1], [1, 1.08]);
  const foregroundMouseX = useTransform(smoothMouseX, [-1, 1], [-20, 20]);

  // Layer 6: Atmospheric Sunlight & Particles
  const sunlightOpacity = useTransform(smoothScroll, [0, 0.5, 1], [0.85, 1, 0.65]);

  // Layer 7: Floating AI Real Estate Interface (appears at 65% - 85%)
  const cardOpacity = useTransform(smoothScroll, [0.55, 0.72, 0.88, 0.98], [0, 1, 1, 0]);
  const cardY = useTransform(smoothScroll, [0.55, 0.75, 0.98], [70, 0, -40]);
  const cardScale = useTransform(smoothScroll, [0.55, 0.75], [0.92, 1]);

  // Top Navigation subtle scroll reactivity
  const navBackground = useTransform(
    smoothScroll,
    [0, 0.15],
    ['rgba(255, 255, 255, 0.55)', 'rgba(255, 255, 255, 0.92)']
  );
  const navBorder = useTransform(
    smoothScroll,
    [0, 0.15],
    ['rgba(255, 255, 255, 0.6)', 'rgba(27, 67, 50, 0.15)']
  );

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full h-[300vh] bg-[#F4F7F4] selection:bg-emerald-200 selection:text-emerald-950 font-sans"
    >
      {/* STICKY VIEWPORT CONTAINER (Pinned Hero Stage) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* ==================================================== */}
        {/* TOP NAVIGATION (Minimal, Clean, Integrated)           */}
        {/* ==================================================== */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 sm:py-5 flex justify-center pointer-events-none"
        >
          <motion.nav 
            style={{
              backgroundColor: navBackground,
              borderColor: navBorder
            }}
            className="pointer-events-auto backdrop-blur-xl border shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-full px-5 sm:px-7 py-2.5 flex items-center justify-between gap-6 sm:gap-10 max-w-5xl w-full transition-all duration-300"
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1A3828] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                TF
              </div>
              <span className="font-bold text-[#14261C] tracking-tight text-base">
                Terraflow
              </span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#2C4034]">
              <a href="#product" className="hover:text-[#112419] transition-colors">Product</a>
              <a href="#solutions" className="hover:text-[#112419] transition-colors">Solutions</a>
              <a href="#pricing" className="hover:text-[#112419] transition-colors">Pricing</a>
              <a href="#resources" className="hover:text-[#112419] transition-colors">Resources</a>
              <a href="#about" className="hover:text-[#112419] transition-colors">About</a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button className="text-xs font-semibold text-[#2C4034] hover:text-[#112419] px-2 py-1 transition-colors">
                Login
              </button>
              <button className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1A3828] text-white hover:bg-[#142B1F] shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.nav>
        </motion.header>

        {/* ==================================================== */}
        {/* 3D CINEMATIC LANDSCAPE DEPTH LAYERS                  */}
        {/* ==================================================== */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
          
          {/* LAYER 1 & 2: SKY, DISTANT MOUNTAINS & MIDGROUND HILLS */}
          <motion.div 
            style={{ 
              y: skyY,
              scale: skyScale,
              x: mountainMouseX
            }}
            className="absolute inset-0 w-full h-full origin-top"
          >
            <img 
              src="/images/landscape-sky-mountains.jpg" 
              alt="Terraflow cinematic landscape" 
              className="w-full h-full object-cover object-[center_65%]"
            />
          </motion.div>

          {/* Atmospheric Soft Light Mist Layer */}
          <motion.div 
            style={{ opacity: sunlightOpacity }}
            className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent pointer-events-none" 
          />

          {/* Atmospheric Floating Pollen & Dust Motes (Layer 6) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${(i * 7 + 4)}%`,
                  y: `${(i * 6.5 + 12)}%`,
                  opacity: 0.25 + (i % 4) * 0.15
                }}
                animate={{
                  y: ['-4%', '4%', '-4%'],
                  x: ['-3%', '3%', '-3%'],
                }}
                transition={{
                  duration: 9 + (i % 5) * 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-white/80 blur-[0.5px]"
              />
            ))}
          </div>

        </div>

        {/* ==================================================== */}
        {/* LAYER 4: HERO TYPOGRAPHY & EMBEDDED CONTENT           */}
        {/* (Physically located between midground and foreground) */}
        {/* ==================================================== */}
        <motion.div 
          style={{
            y: textY,
            scale: textScale,
            opacity: textOpacity,
            x: textMouseX
          }}
          className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 max-w-5xl mx-auto w-full pt-10 sm:pt-14 pb-20 sm:pb-28"
        >
          {/* Subtle Stage Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#1A3828]/15 text-[#1A3828] text-xs font-semibold tracking-wide shadow-sm mb-5 sm:mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Real Estate Automation</span>
          </motion.div>

          {/* MAIN HEADLINE WITH STAGED DEPTH REVEAL */}
          <h1 className="w-full text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-[-0.035em] select-none">
            {/* First phrase: "Turn Every Lead" (Dark charcoal / deep green) */}
            <motion.span 
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[#16291E] drop-shadow-[0_2px_20px_rgba(255,255,255,0.95)]"
            >
              Turn Every Lead
            </motion.span>

            {/* Second phrase: "Into a Site Visit." (Rich forest green) */}
            <motion.span 
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[#1B4D2E] font-serif italic font-normal tracking-[-0.02em] mt-1 sm:mt-2 drop-shadow-[0_2px_25px_rgba(255,255,255,1)]"
            >
              Into a Site Visit.
            </motion.span>
          </h1>

          {/* SUPPORTING COPY (Integrated, no harsh card boundary) */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            className="mt-5 sm:mt-7 max-w-2xl text-sm sm:text-base md:text-lg text-[#1F3628] font-medium leading-relaxed drop-shadow-[0_1px_12px_rgba(255,255,255,0.9)] px-2"
          >
            Terraflow helps real estate teams respond instantly, qualify buyers with AI, recommend the right properties and follow up across WhatsApp and voice — so you never lose a lead again.
          </motion.p>

          {/* CTA BUTTONS (Subtle glass-like depth, soft shadow) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto px-4 z-20 pointer-events-auto"
          >
            {/* Primary CTA: Deep Forest Green */}
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide bg-[#1A3828] text-white shadow-[0_8px_25px_rgba(26,56,40,0.3)] hover:bg-[#12271C] hover:shadow-[0_12px_32px_rgba(26,56,40,0.4)] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer group">
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Secondary CTA: Translucent Glass */}
            <button className="w-full sm:w-auto px-7 py-3.5 rounded-full font-medium text-sm tracking-wide bg-white/75 hover:bg-white/90 backdrop-blur-md border border-[#1A3828]/20 text-[#1A3828] shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer">
              <Play className="w-3.5 h-3.5 fill-[#1A3828]" />
              <span>Watch Demo</span>
            </button>
          </motion.div>

          {/* Subtle Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-6 sm:mt-10 flex flex-col items-center gap-1 text-[11px] font-semibold text-[#1A3828]/70 tracking-widest uppercase select-none"
          >
            <span>Scroll to explore depth</span>
            <div className="w-4 h-6 rounded-full border-2 border-[#1A3828]/35 flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-1.5 rounded-full bg-[#1A3828]"
              />
            </div>
          </motion.div>

        </motion.div>

        {/* ==================================================== */}
        {/* LAYER 7: FLOATING AI REAL ESTATE INTERFACE            */}
        {/* (Emerges dynamically at scroll 65% - 85%)            */}
        {/* ==================================================== */}
        <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none px-4">
          <motion.div
            style={{
              opacity: cardOpacity,
              y: cardY,
              scale: cardScale
            }}
            className="w-full max-w-sm pointer-events-auto backdrop-blur-xl bg-white/85 border border-[#1A3828]/20 shadow-[0_25px_60px_rgba(26,56,40,0.2)] rounded-2xl p-5 text-left transition-all"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A3828]/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1A3828] text-white flex items-center justify-center text-[10px] font-bold">
                  AI
                </div>
                <span className="text-xs font-bold text-[#14261C] tracking-wide">Terraflow AI</span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/40">
                New lead qualified
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-xs font-semibold text-[#14261C]">
                <Building className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span>3BHK Villa</span>
                  <p className="text-[11px] font-normal text-[#253D30]/80">Whitefield, Bengaluru</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-[#1A3828]/5 p-2 rounded-lg">
                  <span className="block text-[10px] font-medium text-[#253D30]/70 uppercase">Budget</span>
                  <span className="text-xs font-bold text-[#14261C]">₹1.2 Cr</span>
                </div>
                <div className="bg-[#1A3828]/5 p-2 rounded-lg">
                  <span className="block text-[10px] font-medium text-[#253D30]/70 uppercase">Intent</span>
                  <span className="text-xs font-bold text-emerald-700">HIGH</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-[#1A3828] hover:bg-[#12271C] text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Site Visit</span>
            </button>
          </motion.div>
        </div>

        {/* ==================================================== */}
        {/* LAYER 5: FOREGROUND HILL CREST & WILDFLOWERS          */}
        {/* (Fastest movement: passes in front of typography)    */}
        {/* ==================================================== */}
        <motion.div 
          style={{ 
            y: foregroundY,
            scale: foregroundScale,
            x: foregroundMouseX
          }}
          className="absolute inset-0 w-full h-full pointer-events-none z-30 origin-bottom"
        >
          <img 
            src="/images/landscape-foreground.png" 
            alt="Foreground rolling hill crest with wildflowers" 
            className="w-full h-full object-cover object-[center_65%]"
          />
        </motion.div>

      </div>
    </div>
  );
}
