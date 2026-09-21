'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  targetId: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Flow Engine', href: '#intelligent-flow', targetId: 'intelligent-flow' },
  { label: 'The Problem', href: '#lead-chaos', targetId: 'lead-chaos' },
  { label: 'Architecture', href: '#automation-architecture', targetId: 'automation-architecture' },
  { label: 'Impact & ROI', href: '#impact-roi', targetId: 'impact-roi' },
];

export default function TerraflowNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll listener for scroll-aware navbar styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      // Scroll Spy Logic
      const sectionIds = ['hero', 'lead-chaos', 'intelligent-flow', 'automation-architecture', 'impact-roi', 'conversation', 'outcome', 'waitlist'];
      const scrollPosition = scrollY + 240;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler with offset
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('hero');
      return;
    }

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const navOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(targetId);
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      {/* ================================================================ */}
      {/* PERSISTENT FLOATING NAVIGATION BAR (STATIC-YET-FLOATING CAPSULE) */}
      {/* ================================================================ */}
      <header
        role="banner"
        className="w-full px-3 sm:px-6 pt-3 sm:pt-4 flex justify-center transition-all duration-300"
      >
        <nav
          aria-label="Main Navigation"
          className={`pointer-events-auto rounded-full transition-all duration-300 ease-out flex items-center justify-between gap-4 sm:gap-8 w-full ${
            isScrolled
              ? 'max-w-4xl py-2 px-3.5 sm:px-5 bg-white/90 backdrop-blur-2xl border border-[#14261C]/10 shadow-[0_12px_36px_rgba(20,38,28,0.12)]'
              : 'max-w-5xl py-2.5 sm:py-3 px-4 sm:px-6 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_6px_28px_rgba(0,0,0,0.05)]'
          }`}
        >
          {/* 1. Left Brand Mark with Bigger, Sharp TerraFlow Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, 'hero')}
            className="flex items-center gap-2.5 sm:gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B36E] rounded-full group cursor-pointer shrink-0"
          >
            {/* Crisp Modern Vector Brand Mark - Enhanced & Bigger */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#14261C] border border-[#00B36E]/40 flex items-center justify-center shadow-[0_4px_16px_rgba(0,179,110,0.22)] group-hover:border-[#00B36E] group-hover:shadow-[0_6px_22px_rgba(0,179,110,0.35)] transition-all duration-300 shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#00B36E] group-hover:scale-105 transition-transform duration-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M12 6v13M7 13.5l5 5.5 5-5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="6" r="2.2" fill="#00FF88"/>
              </svg>
            </div>
            
            <div className="flex items-center">
              <span className="font-sans font-black tracking-tight text-2xl sm:text-[27px] select-none leading-none">
                <span className="text-[#00B36E]">Terra</span>
                <span className="text-[#14261C]">Flow</span>
              </span>
              <span className="ml-2 text-[11px] sm:text-xs font-black text-[#008751] bg-[#00B36E]/15 border border-[#00B36E]/30 px-2 py-0.5 rounded-full uppercase tracking-wider hidden xs:inline-block shadow-xs">
                AI
              </span>
            </div>
          </a>

          {/* 2. Middle Navigation Links (Unified Desktop Menu with Floating Microinteractions) */}
          <div
            onMouseLeave={() => setHoveredSection(null)}
            className="hidden md:flex items-center gap-1.5 lg:gap-2 relative p-1 rounded-full bg-[#14261C]/[0.03] border border-black/[0.04]"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.targetId;
              const isHovered = hoveredSection === item.targetId;

              return (
                <a
                  key={item.targetId}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.targetId)}
                  onMouseEnter={() => setHoveredSection(item.targetId)}
                  className={`relative px-3.5 lg:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B36E] ${
                    isActive
                      ? 'text-[#007044] font-bold'
                      : 'text-[#3E5246] hover:text-[#14261C]'
                  }`}
                >
                  {/* Active Section Background Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_rgba(0,179,110,0.15)] border border-[#00B36E]/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover Magic Pill Glow (Subtle Underlay) */}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="hoverNavIndicator"
                      className="absolute inset-0 rounded-full bg-[#00B36E]/[0.08]"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  {/* Nav Item Text */}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* 3. Right Action Area: CTA Button + Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            {/* Early Access / Waitlist Button */}
            <a
              href="#waitlist"
              onClick={(e) => scrollToSection(e, 'waitlist')}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B36E] ${
                isScrolled
                  ? 'bg-[#00B36E] hover:bg-[#009E60] text-white shadow-[0_4px_14px_rgba(0,179,110,0.28)]'
                  : 'bg-[#14261C] hover:bg-[#00B36E] text-white shadow-[0_4px_14px_rgba(20,38,28,0.2)]'
              }`}
            >
              <span className="hidden sm:inline">Join Waitlist</span>
              <span className="sm:hidden">Access</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* Mobile Hamburger Toggle Button with Micro-interaction */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-[#14261C]/5 hover:bg-[#14261C]/10 text-[#14261C] border border-black/5 transition-colors cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </header>

      {/* ================================================================ */}
      {/* RESPONSIVE MOBILE FROSTED GLASS DRAWER MENU                      */}
      {/* ================================================================ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Dismiss Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/25 backdrop-blur-xs z-[-1] pointer-events-auto md:hidden"
            />

            {/* Mobile Floating Drawer Card */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="pointer-events-auto mx-3 sm:mx-6 mt-2 max-w-lg md:hidden p-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(20,38,28,0.22)] flex flex-col gap-3"
            >
              {/* Header Status Bar (Clean, no duplicate logo) */}
              <div className="flex items-center justify-between px-2 pt-0.5 pb-2 border-b border-black/5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A5043]">Navigation</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#008751] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B36E] animate-pulse" />
                  Live 24/7 Flow
                </span>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeSection === item.targetId;

                  return (
                    <motion.a
                      key={item.targetId}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 + 0.05, ease: 'easeOut' }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.targetId)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#00B36E]/12 text-[#007044] font-bold border border-[#00B36E]/20'
                          : 'text-[#2C4034] hover:bg-black/5'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-[#00B36E] shadow-[0_0_8px_rgba(0,179,110,0.6)]" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-black/30" />
                      )}
                    </motion.a>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <div className="pt-1.5 border-t border-black/5">
                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  href="#waitlist"
                  onClick={(e) => scrollToSection(e, 'waitlist')}
                  className="w-full py-3 rounded-2xl bg-[#00B36E] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(0,179,110,0.35)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,179,110,0.45)] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Join VIP Waitlist</span>
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
