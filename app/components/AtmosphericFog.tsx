'use client';

import React from 'react';

interface AtmosphericFogProps {
  className?: string;
}

export default function AtmosphericFog({ className = '' }: AtmosphericFogProps) {
  return (
    <div
      aria-hidden="true"
      className={`atmospheric-fog-container absolute -bottom-2 left-0 right-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        height: 'clamp(140px, 20vh, 220px)',
        zIndex: 25,
      }}
    >
      {/* 1. Irregular Natural Valley Mist (Staggered Elliptical Gradients breaking horizontal linearity) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Hill Morning Mist Pocket */}
        <div
          className="absolute -bottom-10 -left-[10%] w-[55%] h-[90%] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 40% 85%, rgba(244, 247, 250, 0.95) 0%, rgba(244, 247, 250, 0.45) 50%, transparent 100%)',
            filter: 'blur(16px)',
          }}
        />

        {/* Central Meadow Soft Haze */}
        <div
          className="absolute -bottom-12 left-[25%] w-[50%] h-[100%] rounded-full opacity-70"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 88%, rgba(244, 247, 250, 0.98) 0%, rgba(244, 247, 250, 0.4) 55%, transparent 100%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Right Valley Low Fog Pocket */}
        <div
          className="absolute -bottom-8 right-[-8%] w-[50%] h-[85%] rounded-full opacity-65"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 60% 85%, rgba(244, 247, 250, 0.95) 0%, rgba(244, 247, 250, 0.4) 50%, transparent 100%)',
            filter: 'blur(18px)',
          }}
        />
      </div>

      {/* 2. Soft Horizon Depth Dissolve (Exponentially smooth fade into #F4F7FA) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, ' +
            'rgba(244, 247, 250, 0.00)  0%,   ' +
            'rgba(244, 247, 250, 0.08) 20%,   ' +
            'rgba(244, 247, 250, 0.28) 40%,   ' +
            'rgba(244, 247, 250, 0.60) 60%,   ' +
            'rgba(244, 247, 250, 0.88) 78%,   ' +
            '#F4F7FA                   90%,   ' +
            '#F4F7FA                  100%)',
        }}
      />
    </div>
  );
}
