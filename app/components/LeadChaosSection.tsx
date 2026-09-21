'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import AtmosphericFog from './AtmosphericFog';

// --------------------------------------------------------------------------
// 1. ISOMETRIC 3D DATA ILLUSTRATIONS (TERRAFLOW DESIGN SYSTEM COLORS)
// Dual palettes: Mint #00B36E & Royal Blue #3B82F6 (Light) | Cyan #2DD4BF & Royal Blue (Dark)
// High Urgency Focal: #FF5757 (DESIGN.md High Priority Token)
// --------------------------------------------------------------------------

// ILLUSTRATION 001: Scattered Channels
function ScatteredChannelsIllustration({ isHovered }: { isHovered: boolean }) {
  const [activeChannel, setActiveChannel] = useState(0);

  const channels = [
    { name: 'WhatsApp', x: 50, y: 55, h: 42, icon: 'WA' },
    { name: 'Portals', x: 175, y: 50, h: 48, icon: 'MLS' },
    { name: 'Direct SMS', x: 75, y: 115, h: 36, icon: 'SMS' },
    { name: 'Broker Call', x: 160, y: 110, h: 38, icon: 'VOX' },
  ];

  return (
    <svg
      viewBox="0 0 240 160"
      className="w-full h-40 sm:h-44 overflow-visible select-none cursor-pointer"
    >
      <defs>
        <pattern id="dotGridScattered" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill={isHovered ? '#CBD5E1' : '#2D333E'} />
        </pattern>
        <radialGradient id="alertGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF7A7A" stopOpacity="1" />
          <stop offset="60%" stopColor="#FF5757" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="mintGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity="1" />
          <stop offset="60%" stopColor="#2DD4BF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#00B36E" stopOpacity="0.9" />
        </radialGradient>
        <filter id="softGlow1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>

      {/* Grid Canvas Backdrop */}
      <rect x="10" y="10" width="220" height="140" fill="url(#dotGridScattered)" opacity="0.65" />

      {/* Center Disconnected Void / Missing Hub Ring */}
      <ellipse
        cx="120"
        cy="85"
        rx="26"
        ry="12"
        fill="none"
        stroke={isHovered ? '#94A3B8' : '#3B82F6'}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity={isHovered ? 0.6 : 0.4}
      />
      <circle cx="120" cy="85" r="3.5" fill={isHovered ? '#3B82F6' : '#2DD4BF'} opacity="0.85" />

      {/* Fractured Isometric Connection Rays */}
      {channels.map((ch, i) => (
        <line
          key={`ray-${i}`}
          x1="120"
          y1="85"
          x2={ch.x + 14}
          y2={ch.y + 10}
          stroke={activeChannel === i ? (isHovered ? '#00B36E' : '#2DD4BF') : isHovered ? '#CBD5E1' : '#2D333E'}
          strokeWidth={activeChannel === i ? '1.5' : '1'}
          strokeDasharray={activeChannel === i ? 'none' : '3 4'}
          className="transition-colors duration-200"
        />
      ))}

      {/* 4 Isometric Channel Silo Pillars */}
      {channels.map((ch, i) => {
        const x = ch.x;
        const y = ch.y;
        const h = ch.h;
        const isActive = activeChannel === i;

        const topCenterY = y - h;
        const topPts = `${x},${topCenterY} ${x + 14},${topCenterY - 7} ${x + 28},${topCenterY} ${x + 14},${topCenterY + 7}`;
        const leftPts = `${x},${topCenterY} ${x + 14},${topCenterY + 7} ${x + 14},${y + 7} ${x},${y}`;
        const rightPts = `${x + 14},${topCenterY + 7} ${x + 28},${topCenterY} ${x + 28},${y} ${x + 14},${y + 7}`;

        const strokeColor = isActive
          ? isHovered
            ? '#00B36E'
            : '#2DD4BF'
          : isHovered
          ? '#94A3B8'
          : '#2D333E';

        const leftFill = isActive
          ? isHovered
            ? '#D1FAE5'
            : '#134E4A'
          : isHovered
          ? '#F1F5F9'
          : '#1A2230';

        const rightFill = isActive
          ? isHovered
            ? '#A7F3D0'
            : '#115E59'
          : isHovered
          ? '#E2E8F0'
          : '#151A23';

        const topFill = isActive
          ? isHovered
            ? '#34D399'
            : '#2DD4BF'
          : isHovered
          ? '#FFFFFF'
          : '#242D3C';

        return (
          <g
            key={`pillar-${i}`}
            onClick={() => setActiveChannel(i)}
            onMouseEnter={() => setActiveChannel(i)}
            className="cursor-pointer transition-all duration-200"
            style={{
              transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Ground Footprint */}
            <ellipse
              cx={x + 14}
              cy={y + 7}
              rx="12"
              ry="5"
              fill="#000000"
              opacity={isHovered ? '0.08' : '0.25'}
            />

            {/* Pillar Faces */}
            <polygon points={leftPts} fill={leftFill} stroke={strokeColor} strokeWidth={isActive ? '1.5' : '1'} strokeLinejoin="round" />
            <polygon points={rightPts} fill={rightFill} stroke={strokeColor} strokeWidth={isActive ? '1.5' : '1'} strokeLinejoin="round" />
            <polygon points={topPts} fill={topFill} stroke={strokeColor} strokeWidth={isActive ? '1.5' : '1'} strokeLinejoin="round" />

            {/* Channel Tag Badge on top face */}
            <text
              x={x + 14}
              y={topCenterY + 2.5}
              textAnchor="middle"
              className={`text-[8px] font-bold font-mono select-none ${
                isActive ? (isHovered ? 'fill-[#064E3B]' : 'fill-[#0B0E14]') : isHovered ? 'fill-[#475569]' : 'fill-[#97A3B6]'
              }`}
            >
              {ch.icon}
            </text>

            {/* Alert Indicator on Active Pillar (DESIGN.md High Priority Token #FF5757) */}
            {isActive && (
              <g className="animate-pulse">
                <circle cx={x + 14} cy={topCenterY - 12} r="10" fill="#FF5757" opacity="0.3" filter="url(#softGlow1)" />
                <circle cx={x + 14} cy={topCenterY - 12} r="5" fill="url(#alertGlowGrad)" stroke="#FFA3A3" strokeWidth="0.8" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ILLUSTRATION 002: Response Delays
function ResponseDelaysIllustration({ isHovered }: { isHovered: boolean }) {
  const [elevated, setElevated] = useState(true);

  return (
    <svg
      viewBox="0 0 240 160"
      className="w-full h-40 sm:h-44 overflow-visible select-none cursor-pointer"
      onMouseEnter={() => setElevated(true)}
    >
      <defs>
        <pattern id="dotGridDelays" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill={isHovered ? '#CBD5E1' : '#2D333E'} />
        </pattern>
        <linearGradient id="wedgeGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B36E" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="wedgeGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>

      {/* Grid Canvas Backdrop */}
      <rect x="10" y="10" width="220" height="140" fill="url(#dotGridDelays)" opacity="0.65" />

      {/* Concentric Dashed Time Rings */}
      <ellipse
        cx="120"
        cy="105"
        rx="78"
        ry="36"
        fill="none"
        stroke={isHovered ? '#CBD5E1' : '#2D333E'}
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <ellipse
        cx="120"
        cy="105"
        rx="52"
        ry="24"
        fill="none"
        stroke={isHovered ? '#CBD5E1' : '#2D333E'}
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Time Markers: 5m Window vs +45m Lost */}
      <text
        x="120"
        y="65"
        textAnchor="middle"
        className={`text-[8px] font-mono font-bold ${
          isHovered ? 'fill-[#00B36E]' : 'fill-[#2DD4BF]'
        }`}
      >
        5m GOLDEN WINDOW
      </text>
      <text
        x="185"
        y="112"
        textAnchor="start"
        className={`text-[7px] font-mono font-semibold ${
          isHovered ? 'fill-[#FF5757]' : 'fill-[#FF5757]'
        }`}
      >
        +45m (Lost)
      </text>

      {/* Base Non-Active Slices */}
      <g stroke={isHovered ? '#94A3B8' : '#2D333E'} strokeWidth="1" strokeLinejoin="round">
        <path d="M 120,95 L 60,95 A 60 26 0 0 0 100,118 Z" fill={isHovered ? '#F1F5F9' : '#1A2230'} />
        <path d="M 120,95 L 100,118 A 60 26 0 0 0 160,115 Z" fill={isHovered ? '#E2E8F0' : '#151A23'} />
        <path d="M 120,95 L 160,115 A 60 26 0 0 0 180,95 Z" fill={isHovered ? '#CBD5E1' : '#0F131A'} />
        <path d="M 120,95 L 180,95 A 60 26 0 0 0 120,69 Z" fill={isHovered ? '#F8FAFC' : '#242D3C'} />
      </g>

      {/* THE ELEVATED WEDGE (5-Minute First Response Window in Brand Mint / Cyan) */}
      <g
        style={{
          transform: elevated ? 'translateY(-14px)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Glow Shadow on base */}
        <ellipse
          cx="88"
          cy="95"
          rx="28"
          ry="12"
          fill={isHovered ? '#00B36E' : '#2DD4BF'}
          opacity={isHovered ? '0.2' : '0.35'}
          filter="blur(8px)"
        />

        {/* 3D Thickness side faces of the wedge */}
        <path
          d="M 68,78 L 68,90 A 62 26 0 0 0 128,94 L 128,82 A 62 26 0 0 1 68,78 Z"
          fill={isHovered ? '#047857' : '#0F766E'}
          stroke={isHovered ? '#00B36E' : '#2DD4BF'}
          strokeWidth="1"
        />
        <path
          d="M 120,69 L 120,81 L 68,90 L 68,78 Z"
          fill={isHovered ? '#059669' : '#115E59'}
          stroke={isHovered ? '#00B36E' : '#2DD4BF'}
          strokeWidth="1"
        />

        {/* Top Face of Elevated Slice */}
        <path
          d="M 120,69 L 68,78 A 62 26 0 0 0 128,82 Z"
          fill={isHovered ? 'url(#wedgeGradLight)' : 'url(#wedgeGradDark)'}
          stroke={isHovered ? '#A7F3D0' : '#5EEAD4'}
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

// ILLUSTRATION 003: Follow-up Grind
function FollowUpGrindIllustration({ isHovered }: { isHovered: boolean }) {
  const [beamAngle, setBeamAngle] = useState(45);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.6;
    const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
    setBeamAngle(Math.round((rad * 180) / Math.PI));
  };

  const rad = (beamAngle * Math.PI) / 180;
  const targetX = Math.round(120 + Math.cos(rad) * 65);
  const targetY = Math.round(118 + Math.sin(rad) * 26);

  const leadDots = [
    { angle: 20, isBuyer: false },
    { angle: 65, isBuyer: false },
    { angle: 110, isBuyer: false },
    { angle: 175, isBuyer: false },
    { angle: 220, isBuyer: true }, // The 1 qualified buyer
    { angle: 280, isBuyer: false },
    { angle: 325, isBuyer: false },
  ];

  return (
    <svg
      ref={containerRef}
      onMouseMove={handleMouseMove}
      viewBox="0 0 240 160"
      className="w-full h-40 sm:h-44 overflow-visible select-none cursor-pointer"
      suppressHydrationWarning
    >
      <defs>
        <pattern id="dotGridGrind" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill={isHovered ? '#CBD5E1' : '#2D333E'} />
        </pattern>
        <linearGradient id="beamGradientBrand" x1="120" y1="58" x2={targetX} y2={targetY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isHovered ? '#00B36E' : '#2DD4BF'} stopOpacity="0.85" />
          <stop offset="50%" stopColor={isHovered ? '#3B82F6' : '#3B82F6'} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Grid Canvas Backdrop */}
      <rect x="10" y="10" width="220" height="140" fill="url(#dotGridGrind)" opacity="0.65" />

      {/* 24-Hour Circular Dial */}
      <ellipse
        cx="120"
        cy="118"
        rx="68"
        ry="28"
        fill="none"
        stroke={isHovered ? '#CBD5E1' : '#2D333E'}
        strokeWidth="1"
        strokeDasharray="2 4"
      />

      {/* Radial Ticks */}
      {[...Array(12)].map((_, idx) => {
        const tickRad = (idx * 30 * Math.PI) / 180;
        const x1 = Math.round(120 + Math.cos(tickRad) * 62);
        const y1 = Math.round(118 + Math.sin(tickRad) * 25);
        const x2 = Math.round(120 + Math.cos(tickRad) * 72);
        const y2 = Math.round(118 + Math.sin(tickRad) * 29);
        return (
          <line
            key={`tick-${idx}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isHovered ? '#94A3B8' : '#333F50'}
            strokeWidth="1"
          />
        );
      })}

      {/* Window Shopper Dots (Grey) vs 1 Qualified Buyer (Mint/Cyan) */}
      {leadDots.map((dot, idx) => {
        const dotRad = (dot.angle * Math.PI) / 180;
        const dx = Math.round(120 + Math.cos(dotRad) * 52);
        const dy = Math.round(118 + Math.sin(dotRad) * 21);
        return (
          <circle
            key={`dot-${idx}`}
            cx={dx}
            cy={dy}
            r={dot.isBuyer ? '3.5' : '2'}
            fill={dot.isBuyer ? (isHovered ? '#00B36E' : '#2DD4BF') : isHovered ? '#94A3B8' : '#475569'}
            stroke={dot.isBuyer ? '#FFFFFF' : 'none'}
            strokeWidth="1"
          />
        );
      })}

      {/* Sweeping Brand Light Beam (Mint to Royal Blue) */}
      <polygon
        points={`120,58 ${targetX - 16},${targetY + 4} ${targetX + 16},${targetY - 4}`}
        fill="url(#beamGradientBrand)"
        opacity={isHovered ? '0.85' : '0.65'}
      />
      {/* Target Marker */}
      <circle
        cx={targetX}
        cy={targetY}
        r="4"
        fill={isHovered ? '#00B36E' : '#2DD4BF'}
        stroke="#FFFFFF"
        strokeWidth="1"
      />

      {/* Tower / Screening Structure */}
      <g stroke={isHovered ? '#94A3B8' : '#2D333E'} strokeWidth="1" strokeLinejoin="round">
        <ellipse cx="120" cy="118" rx="20" ry="8" fill={isHovered ? '#E2E8F0' : '#1A2230'} />
        <path d="M 112,118 L 114,64 L 126,64 L 128,118 Z" fill={isHovered ? '#F8FAFC' : '#242D3C'} />
        <ellipse cx="120" cy="64" rx="12" ry="5" fill={isHovered ? '#E2E8F0' : '#151A23'} />
        <rect x="114" y="52" width="12" height="12" fill={isHovered ? '#00B36E' : '#2DD4BF'} stroke={isHovered ? '#047857' : '#5EEAD4'} />
        <polygon
          points="112,52 120,38 128,52"
          fill={isHovered ? '#3B82F6' : '#1D4ED8'}
          stroke={isHovered ? '#2563EB' : '#3B82F6'}
        />
      </g>
    </svg>
  );
}

// ILLUSTRATION 004: Radio Silence
function RadioSilenceIllustration({ isHovered }: { isHovered: boolean }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPulse((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const waveColor = isHovered ? '#3B82F6' : '#2DD4BF';

  return (
    <svg
      viewBox="0 0 240 160"
      className="w-full h-40 sm:h-44 overflow-visible select-none cursor-pointer"
    >
      <defs>
        <pattern id="dotGridSilence" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill={isHovered ? '#CBD5E1' : '#2D333E'} />
        </pattern>
      </defs>

      {/* Grid Canvas Backdrop */}
      <rect x="10" y="10" width="220" height="140" fill="url(#dotGridSilence)" opacity="0.65" />

      {/* Stepped Cascade Funnel Rings (Tapering into Silence) */}
      {[
        { y: 50, rx: 65, ry: 20, fill: isHovered ? '#F8FAFC' : '#242D3C' },
        { y: 78, rx: 46, ry: 15, fill: isHovered ? '#F1F5F9' : '#1A2230' },
        { y: 104, rx: 28, ry: 10, fill: isHovered ? '#E2E8F0' : '#151A23' },
      ].map((plate, i) => (
        <g key={`funnel-${i}`} stroke={isHovered ? '#94A3B8' : '#2D333E'} strokeWidth="1">
          <ellipse cx="120" cy={plate.y + 8} rx={plate.rx} ry={plate.ry} fill={isHovered ? '#CBD5E1' : '#0B0E14'} />
          <ellipse cx="120" cy={plate.y} rx={plate.rx} ry={plate.ry} fill={plate.fill} />
        </g>
      ))}

      {/* Vertical Dissipation Drop Path */}
      <line
        x1="120"
        y1="50"
        x2="120"
        y2="128"
        stroke={isHovered ? '#94A3B8' : '#334155'}
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Dissipating Sonar Radar Waves at Base in Royal Blue / Cyan */}
      <ellipse
        cx="120"
        cy="128"
        rx={18 + (pulse % 30) * 0.9}
        ry={8 + (pulse % 30) * 0.4}
        fill="none"
        stroke={waveColor}
        strokeWidth="1"
        opacity={Math.max(0, 1 - (pulse % 30) / 30)}
      />
      <ellipse
        cx="120"
        cy="128"
        rx={32 + ((pulse + 15) % 30) * 0.9}
        ry={14 + ((pulse + 15) % 30) * 0.4}
        fill="none"
        stroke={waveColor}
        strokeWidth="1"
        opacity={Math.max(0, 1 - ((pulse + 15) % 30) / 30)}
      />

      {/* Silent Droplet Base (High Priority Warning Token #FF5757) */}
      <ellipse cx="120" cy="128" rx="8" ry="4" fill="#FF5757" />
      <circle cx="120" cy="126" r="3" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

// --------------------------------------------------------------------------
// 2. DATA CARD WRAPPER (DUAL COLOR SYSTEM STRICTLY FROM DESIGN.MD)
// Default Inactive: Dark Mode Theme ("Deep Sea & Cyan") - #151A23, #2DD4BF
// Active / Hover:   Light Mode Theme ("Mint & Snow")  - #FFFFFF, #00B36E
// --------------------------------------------------------------------------
interface ProblemCardData {
  number: string;
  title: string;
  tagline: string;
  description: string;
  statHighlight: string;
  illustration: (isHovered: boolean) => React.ReactNode;
}

const CARDS_DATA: ProblemCardData[] = [
  {
    number: '001',
    title: 'Scattered Channels',
    tagline: 'FRACTURED INTAKE',
    description:
      'Inquiries pour in across WhatsApp, portals, broker SMS, and web forms. Without unified memory, high-intent buyer notes are manually transcribed or forgotten.',
    statHighlight: '3+ hours lost daily manually copying buyer context across apps',
    illustration: (isHovered) => <ScatteredChannelsIllustration isHovered={isHovered} />,
  },
  {
    number: '002',
    title: 'Response Delays',
    tagline: 'DEADLINE WINDOW',
    description:
      'A midnight query sits unread for 45 minutes. By sunrise, your high-net-worth prospect has already scheduled a private walkthrough with a competing development.',
    statHighlight: '78% of luxury buyers sign with whichever brokerage replies first',
    illustration: (isHovered) => <ResponseDelaysIllustration isHovered={isHovered} />,
  },
  {
    number: '003',
    title: 'Follow-up Grind',
    tagline: 'MANUAL EXHAUSTION',
    description:
      'Sales agents burn prime daylight answering repetitive pricing FAQs and vetting unqualified window-shoppers instead of conducting high-touch private showings.',
    statHighlight: 'Brokers waste 65% of productive daylight on manual qualification',
    illustration: (isHovered) => <FollowUpGrindIllustration isHovered={isHovered} />,
  },
  {
    number: '004',
    title: 'Radio Silence',
    tagline: 'COLD PIPELINE',
    description:
      'Without instant qualification and dynamic calendar scheduling, buyer momentum drops to zero. Warm conversations quietly stall into unreturned voice notes.',
    statHighlight: '$4.2M+ in pipeline volume quietly evaporates before private tours',
    illustration: (isHovered) => <RadioSilenceIllustration isHovered={isHovered} />,
  },
];

function InteractiveProblemCard({
  card,
  isActive,
  onActivate,
}: {
  card: ProblemCardData;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      onClick={onActivate}
      onMouseEnter={onActivate}
      className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer border select-none backdrop-blur-md ${
        isActive
          ? 'bg-white text-[#2D3436] border-[#00B36E]/40 shadow-[0_20px_50px_rgba(0,179,110,0.14)] scale-[1.02]'
          : 'bg-[#151A23]/95 text-[#E5EAF3] border-[#2D333E] shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-[#2DD4BF]/40'
      }`}
    >
      {/* 1. TOP BAR: Problem Title & Numbering */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3
          className={`font-display font-semibold text-lg tracking-tight transition-colors duration-200 ${
            isActive ? 'text-[#2D3436]' : 'text-[#E5EAF3]'
          }`}
        >
          {card.title}
        </h3>
        <span
          className={`font-mono text-xs font-semibold tracking-wider transition-colors duration-200 ${
            isActive ? 'text-[#5C666E]' : 'text-[#97A3B6]'
          }`}
        >
          {card.number}
        </span>
      </div>

      {/* 2. CENTER: Isometric 3D Illustration Area Framed by 4 Corner Ticks */}
      <div className="relative my-auto py-2 flex items-center justify-center">
        {/* Corner Tick Marks (⌜ ⌝ ⌞ ⌟) */}
        <div
          className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-200 ${
            isActive ? 'border-[#00B36E]/60' : 'border-[#2DD4BF]/40'
          }`}
        />
        <div
          className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-200 ${
            isActive ? 'border-[#00B36E]/60' : 'border-[#2DD4BF]/40'
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-200 ${
            isActive ? 'border-[#00B36E]/60' : 'border-[#2DD4BF]/40'
          }`}
        />
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-200 ${
            isActive ? 'border-[#00B36E]/60' : 'border-[#2DD4BF]/40'
          }`}
        />

        {/* Dynamic Vector Line Art */}
        {card.illustration(isActive)}
      </div>

      {/* 3. BOTTOM: Narrative Problem Statement & Highlight */}
      <div
        className={`mt-4 pt-3 border-t transition-colors duration-200 ${
          isActive ? 'border-[#E5EAF3]' : 'border-[#2D333E]'
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-[#00B36E]' : 'bg-[#2DD4BF]'
            }`}
          />
          <span
            className={`text-[10px] font-black tracking-widest uppercase transition-colors duration-200 ${
              isActive ? 'text-[#00B36E]' : 'text-[#2DD4BF]'
            }`}
          >
            {card.tagline}
          </span>
        </div>

        <p
          className={`text-xs leading-relaxed font-sans transition-colors duration-200 ${
            isActive ? 'text-[#5C666E]' : 'text-[#97A3B6]'
          }`}
        >
          {card.description}
        </p>

        {/* Metric Pill */}
        <div
          className={`mt-2.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium leading-snug font-sans transition-colors duration-200 ${
            isActive
              ? 'bg-[#F4F7FA] text-[#00B36E] border border-[#E5EAF3]'
              : 'bg-[#0B0E14] text-[#2DD4BF] border border-[#2D333E]'
          }`}
        >
          {card.statHighlight}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 3. MAIN SECTION: FULL-SCREEN CRISP LIVING WOOD BACKGROUND
// No heavy white milk overlay - the wood grain and blooming wildflowers
// are 100% visible, rich, and tactile!
// --------------------------------------------------------------------------
export default function LeadChaosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Images state
  const baseImgRef = useRef<HTMLImageElement | null>(null);
  const flowersImgRef = useRef<HTMLImageElement | null>(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // Load textures
  useEffect(() => {
    let active = true;
    const base = new window.Image();
    const flowers = new window.Image();

    let count = 0;
    const onLoaded = () => {
      count += 1;
      if (count === 2 && active) {
        baseImgRef.current = base;
        flowersImgRef.current = flowers;
        setTexturesLoaded(true);
      }
    };

    if (base.complete && base.naturalWidth > 0) count++;
    else base.onload = onLoaded;

    if (flowers.complete && flowers.naturalWidth > 0) count++;
    else flowers.onload = onLoaded;

    if (count === 2 && active) {
      baseImgRef.current = base;
      flowersImgRef.current = flowers;
      setTexturesLoaded(true);
    }

    base.src = '/images/wood/weathered_wood_base.jpg';
    flowers.src = '/images/wood/weathered_wood_flowers.jpg';

    return () => {
      active = false;
    };
  }, []);

  // Canvas rendering & dynamic decaying trail loop
  useEffect(() => {
    if (!texturesLoaded) return;

    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    const baseImg = baseImgRef.current;
    const flowersImg = flowersImgRef.current;

    if (!canvas || !container || !baseImg || !flowersImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create mask canvas if needed
    if (!maskCanvasRef.current) {
      maskCanvasRef.current = document.createElement('canvas');
    }
    const maskCanvas = maskCanvasRef.current;
    const mCtx = maskCanvas.getContext('2d');
    if (!mCtx) return;

    // Offscreen composite canvas
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    // Sizing to full section dimensions
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;

      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Continuous 60fps render & decay loop
    let active = true;
    const render = () => {
      if (!active) return;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Calculate aspect cover coordinates
      const imgRatio = baseImg.width / baseImg.height;
      const canvasRatio = w / h;
      let rw = w;
      let rh = h;
      let ox = 0;
      let oy = 0;

      if (canvasRatio > imgRatio) {
        rw = w;
        rh = w / imgRatio;
        // Shift wood gently downward so header text enjoys clear atmospheric space
        oy = (h - rh) * 0.35 + h * 0.08;
      } else {
        rh = h * 1.06;
        rw = rh * imgRatio;
        ox = (w - rw) / 2;
        // Gentle downward offset so the top crown of the log sits below the headline
        oy = h * 0.09;
      }

      // 2. Draw bare weathered driftwood
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(baseImg, ox, oy, rw, rh);

      // 3. Composite blooming wildflowers masked by user's trail
      offCtx.clearRect(0, 0, w, h);
      offCtx.globalCompositeOperation = 'source-over';
      offCtx.drawImage(flowersImg, ox, oy, rw, rh);
      offCtx.globalCompositeOperation = 'destination-in';
      offCtx.drawImage(maskCanvas, 0, 0);

      ctx.drawImage(offscreen, 0, 0);

      // 4. Decay mask trail gently over time (destination-out) so flowers fade back to bare wood in ~3s
      mCtx.globalCompositeOperation = 'destination-out';
      mCtx.fillStyle = 'rgba(0, 0, 0, 0.012)';
      mCtx.fillRect(0, 0, w, h);
      mCtx.globalCompositeOperation = 'source-over';

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);

    // Single point bloom stamp
    const stampAt = (x: number, y: number, radius: number) => {
      mCtx.globalCompositeOperation = 'source-over';

      // Primary blooming radial spot
      const grad = mCtx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.98)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(0.85, 'rgba(0, 0, 0, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      mCtx.fillStyle = grad;
      mCtx.beginPath();
      mCtx.arc(x, y, radius, 0, Math.PI * 2);
      mCtx.fill();

      // Micro scatter blooms
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = (Math.random() * 0.7 + 0.3) * radius;
        const sx = x + Math.cos(angle) * dist;
        const sy = y + Math.sin(angle) * dist;
        const sr = (Math.random() * 0.35 + 0.2) * radius;

        const sGrad = mCtx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
        sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        mCtx.fillStyle = sGrad;
        mCtx.beginPath();
        mCtx.arc(sx, sy, sr, 0, Math.PI * 2);
        mCtx.fill();
      }
    };

    let lastPos: { x: number; y: number } | null = null;

    // Paint function: awakens lush grass & flowers at cursor location with path interpolation
    const paint = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const currX = (clientX - rect.left) * scaleX;
      const currY = (clientY - rect.top) * scaleY;
      const brushRadius = Math.max(75, rect.width * 0.08) * scaleX;

      if (lastPos) {
        const dx = currX - lastPos.x;
        const dy = currY - lastPos.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.floor(dist / (brushRadius * 0.35)));

        for (let s = 1; s <= steps; s++) {
          const ix = lastPos.x + (dx * s) / steps;
          const iy = lastPos.y + (dy * s) / steps;
          stampAt(ix, iy, brushRadius);
        }
      } else {
        stampAt(currX, currY, brushRadius);
      }

      lastPos = { x: currX, y: currY };
    };

    // Listen across section window so moving anywhere over Section 02 awakens the living wood background
    const onMove = (e: MouseEvent | PointerEvent | TouchEvent) => {
      let cx = 0;
      let cy = 0;
      if ('touches' in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ('clientX' in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      } else {
        return;
      }

      const section = sectionRef.current;
      if (!section) return;
      const sRect = section.getBoundingClientRect();
      if (
        cx >= sRect.left &&
        cx <= sRect.right &&
        cy >= sRect.top &&
        cy <= sRect.bottom
      ) {
        paint(cx, cy);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    if (typeof window !== 'undefined') {
      (window as unknown as { __paintWoodAt?: typeof paint }).__paintWoodAt = paint;
    }

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, [texturesLoaded]);

  return (
    <section
      ref={sectionRef}
      id="lead-chaos"
      className="relative z-10 w-full min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans flex flex-col justify-center bg-[#F4F7FA]"
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. FULL-SCREEN CRISP LIVING WOOD CANVAS BACKGROUND                 */}
      {/* No heavy white overlay - rich natural wood texture & vivid flowers!*/}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden cursor-crosshair select-none bg-[#F4F7FA]"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover select-none pointer-events-auto"
        />

        {/* Soft edge vignetting blending smoothly into section border without clouding the wood */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 100px 30px rgba(244, 247, 250, 0.45)',
          }}
        />

        {/* Luminous Morning Mist Cloud directly behind Section Header for crystal-clear readability */}
        <div
          className="absolute top-0 inset-x-0 h-[520px] pointer-events-none z-1"
          style={{
            background:
              'radial-gradient(ellipse 85% 70% at 50% 26%, rgba(244, 247, 250, 0.94) 0%, rgba(244, 247, 250, 0.72) 48%, rgba(244, 247, 250, 0) 82%)',
          }}
        />

        {/* Seamless Soft Fade from Hero into Living Wood Canvas */}
        <div
          className="absolute top-0 inset-x-0 h-48 pointer-events-none z-2"
          style={{
            background:
              'linear-gradient(to bottom, #F4F7FA 0%, rgba(244, 247, 250, 0.88) 35%, rgba(244, 247, 250, 0.4) 65%, transparent 100%)',
          }}
        />

        {/* Bottom Cloud Fog (Dissolving into Section 03: Pipeline) */}
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-1 opacity-90">
          <AtmosphericFog />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FOREGROUND CONTENT: EDITORIAL HEADLINE + STATIC 4 DATA CARDS   */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#00B36E]/25 text-[#00B36E] text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00B36E]" aria-hidden="true" />
            <span>02 / The Lead Chaos</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#0D1F14] leading-[1.12] tracking-tight font-normal drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)]">
            Your Leads Don&apos;t Wait.{' '}
            <span className="italic font-normal text-[#009E60] drop-shadow-[0_2px_16px_rgba(255,255,255,0.95)]">
              They Scatter.
            </span>
          </h2>

          <p 
            className="mt-4 text-sm sm:text-base md:text-lg text-[#3A5043] font-sans font-medium leading-relaxed max-w-2xl mx-auto"
            style={{
              textShadow: '0 1px 12px rgba(255, 255, 255, 0.95), 0 0 24px rgba(255, 255, 255, 0.85)',
            }}
          >
            Without automated intelligence, high-intent buyer inquiries fracture across channels, delay response times, and quietly slip away to competing projects.
          </p>
        </div>

        {/* 3. STATIC INTERACTIVE DATA CARDS (DUAL COLOR THEME FROM DESIGN.MD) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full">
          {CARDS_DATA.map((card, idx) => (
            <InteractiveProblemCard
              key={card.number}
              card={card}
              isActive={activeCardIndex === idx}
              onActivate={() => setActiveCardIndex(idx)}
            />
          ))}
        </div>

        {/* Bridge Note into Section 03 */}
        <div className="mt-12 sm:mt-14 text-center">
          <p className="text-xs sm:text-sm font-semibold text-[#00B36E] tracking-wide bg-white/85 backdrop-blur-md px-5 py-2 rounded-full border border-[#00B36E]/20 inline-block shadow-sm">
            &ldquo;Without intelligence, leads scatter into silence. With Terraflow, they become site visits.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
