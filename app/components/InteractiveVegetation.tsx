'use client';

import React, { useEffect, useRef, useMemo } from 'react';

export interface StalkData {
  id: number;
  xPercent: number;        // 0 to 100% across screen width
  yOffsetPx: number;       // vertical baseline offset variation
  type: 'grass-tall' | 'grass-medium' | 'grass-tuft' | 'flower-orange' | 'flower-purple' | 'sprig';
  height: number;          // in pixels
  width: number;           // in pixels
  baseLean: number;        // initial natural tilt angle in degrees (-10 to +10)
  maxBend: number;         // maximum bend degrees
  stiffness: number;       // spring stiffness
  damping: number;         // spring damping
  phase: number;           // natural idle breeze phase
  freq: number;            // natural idle breeze frequency
  idleAmp: number;         // natural idle sway amplitude
  zIndex: number;          // depth sorting
  isDesktopOnly?: boolean; // hide on mobile to keep mobile meadow airy and uncluttered
}

export default function InteractiveVegetation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stalkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headRefs = useRef<(SVGGElement | null)[]>([]);

  // Pointer position & velocity tracking
  const pointerPos = useRef<{
    clientX: number;
    clientY: number;
    vx: number;
    vy: number;
    lastX: number;
    lastY: number;
    lastTime: number;
    active: boolean;
  }>({
    clientX: -9999,
    clientY: -9999,
    vx: 0,
    vy: 0,
    lastX: -9999,
    lastY: -9999,
    lastTime: 0,
    active: false,
  });

  const lastMoveTime = useRef<number>(0);
  const rafId = useRef<number | null>(null);

  // Generate 64 organic vegetation stalks with natural variations matching the video
  const stalks: StalkData[] = useMemo(() => {
    const list: StalkData[] = [];
    const count = 62;
    
    // Seeded pseudo-random generator for consistent, artfully curated distribution
    let seed = 4289;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const types: StalkData['type'][] = [
      'grass-tall',
      'flower-orange',
      'grass-tuft',
      'grass-medium',
      'flower-purple',
      'grass-tall',
      'sprig',
      'flower-orange',
      'grass-medium',
      'flower-purple',
      'grass-tuft',
      'grass-tall',
      'grass-medium',
      'flower-orange',
      'sprig',
    ];

    for (let i = 0; i < count; i++) {
      const basePercent = (i / (count - 1)) * 100;
      const jitter = (random() - 0.5) * (100 / count) * 0.9;
      const xPercent = Math.max(1.0, Math.min(99.0, basePercent + jitter));

      const type = types[Math.floor(random() * types.length)];
      
      let height = 75;
      let width = 22;
      let maxBend = 24;
      let idleAmp = 1.4;

      if (type === 'grass-tall') {
        height = 95 + random() * 40;  // 95 - 135px
        width = 20 + random() * 6;
        maxBend = 26;
        idleAmp = 1.7;
      } else if (type === 'grass-medium') {
        height = 65 + random() * 30;  // 65 - 95px
        width = 16 + random() * 5;
        maxBend = 22;
        idleAmp = 1.3;
      } else if (type === 'grass-tuft') {
        height = 70 + random() * 30;  // 70 - 100px
        width = 30 + random() * 10;
        maxBend = 20;
        idleAmp = 1.1;
      } else if (type === 'flower-orange') {
        height = 85 + random() * 40;  // 85 - 125px
        width = 30 + random() * 7;
        maxBend = 20;
        idleAmp = 1.8;
      } else if (type === 'flower-purple') {
        height = 80 + random() * 38;  // 80 - 118px
        width = 28 + random() * 7;
        maxBend = 18;
        idleAmp = 1.7;
      } else { // sprig
        height = 45 + random() * 25;  // 45 - 70px
        width = 22 + random() * 6;
        maxBend = 16;
        idleAmp = 1.0;
      }

      // On mobile screens (< 640px), keep only ~24 stalks so it never gets clumsy or dense
      // Stalks at even indices or specific key focal stalks are shown on mobile; remainder desktop-only
      const isDesktopOnly = (i % 5 === 1 || i % 5 === 3) && type !== 'flower-orange' && type !== 'flower-purple';

      list.push({
        id: i,
        xPercent,
        yOffsetPx: Math.round((random() - 0.5) * 26),
        type,
        height: Math.round(height),
        width: Math.round(width),
        baseLean: (random() - 0.5) * 14,     // -7° to +7°
        maxBend,
        stiffness: 0.075 + random() * 0.035, // 0.075 - 0.11
        damping: 0.83 + random() * 0.04,     // 0.83 - 0.87
        phase: random() * Math.PI * 2,
        freq: 0.0016 + random() * 0.0012,
        idleAmp,
        zIndex: random() > 0.45 ? 3 : 1,
        isDesktopOnly,
      });
    }

    return list.sort((a, b) => a.xPercent - b.xPercent);
  }, []);

  // Pre-initialize simulation physics state immediately so there is never a race condition
  const physicsState = useRef<{
    currentAngle: number;
    targetAngle: number;
    velocity: number;
    force: number;
  }[]>(
    Array.from({ length: 62 }, () => ({
      currentAngle: 0,
      targetAngle: 0,
      velocity: 0,
      force: 0,
    }))
  );

  // Initialize simulation physics state
  useEffect(() => {
    physicsState.current = stalks.map(() => ({
      currentAngle: 0,
      targetAngle: 0,
      velocity: 0,
      force: 0,
    }));
  }, [stalks]);

  // Window Pointer Tracking & Spring Physics Engine
  useEffect(() => {
    const container = containerRef.current;
    console.log('[InteractiveVegetation] mounted, container:', container, 'stalks:', stalks.length);
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('[InteractiveVegetation] prefersReducedMotion is TRUE');
      return;
    }

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Track pointer across window so approaching cursor reacts before touching
    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - (pointerPos.current.lastTime || now));
      
      const prevX = pointerPos.current.lastX === -9999 ? e.clientX : pointerPos.current.lastX;
      const prevY = pointerPos.current.lastY === -9999 ? e.clientY : pointerPos.current.lastY;

      // Cursor velocity in px/ms
      const vx = (e.clientX - prevX) / dt;
      const vy = (e.clientY - prevY) / dt;

      pointerPos.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        vx,
        vy,
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: now,
        active: true,
      };

      lastMoveTime.current = now;
    };

    const handlePointerLeave = () => {
      pointerPos.current.active = false;
      pointerPos.current.clientX = -9999;
      pointerPos.current.clientY = -9999;
      pointerPos.current.vx = 0;
      pointerPos.current.vy = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Touch interaction support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
        } as unknown as PointerEvent);
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Interaction radius: 130px desktop, 90px touch
    const influenceRadius = isTouch ? 90 : 130;
    const influenceRadiusSq = influenceRadius * influenceRadius;

    let startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerLeft = containerRect.left;
      const containerWidth = containerRect.width || window.innerWidth;
      const containerHeight = containerRect.height || 180;

      const cursor = pointerPos.current;
      const isCursorActive = cursor.active && (now - lastMoveTime.current < 2500);

      // Local cursor position relative to container
      const localCursorX = cursor.clientX - containerLeft;
      const localCursorY = cursor.clientY - containerTop;

      // Update each stalk
      for (let i = 0; i < stalks.length; i++) {
        const stalk = stalks[i];
        const state = physicsState.current[i];
        const el = stalkRefs.current[i];
        if (!state || !el) continue;

        // Base anchor in container coordinates
        const stalkX = (stalk.xPercent / 100) * containerWidth;
        const stalkY = containerHeight - 16 + stalk.yOffsetPx;

        let targetAngle = 0;
        let force = 0;

        if (isCursorActive) {
          const dx = stalkX - localCursorX;
          // Proximity evaluated at upper 60% of stalk
          const dy = (stalkY - stalk.height * 0.65) - localCursorY;
          const distSq = dx * dx + dy * dy;

          if (distSq < influenceRadiusSq) {
            const dist = Math.sqrt(distSq);
            // Smooth non-linear falloff (1 - dist / radius)^1.5
            force = Math.pow(Math.max(0, 1 - dist / influenceRadius), 1.5);
            
            // Direction to bend AWAY from cursor:
            // Cursor to the left of stalk (dx > 0) -> bends right (+angle)
            // Cursor to the right of stalk (dx < 0) -> bends left (-angle)
            const direction = dx >= 0 ? 1 : -1;
            
            // Subtle cursor velocity influence
            const velocityInfluence = Math.max(-0.35, Math.min(0.35, cursor.vx * 0.15));
            const combinedFactor = direction + velocityInfluence;

            targetAngle = combinedFactor * force * stalk.maxBend;
          }
        }

        state.targetAngle = targetAngle;
        state.force = force;

        // Spring acceleration & velocity integration
        const angleDiff = state.targetAngle - state.currentAngle;
        state.velocity += angleDiff * stalk.stiffness;
        state.velocity *= stalk.damping;
        state.currentAngle += state.velocity;

        // Ambient idle breeze oscillation
        const ambientSway = Math.sin(elapsed * stalk.freq + stalk.phase) * stalk.idleAmp;
        const totalAngle = stalk.baseLean + state.currentAngle + ambientSway;

        // Subtle vertical compression when cursor presses downward
        const scaleY = 1 - force * 0.08;
        const skewX = (state.currentAngle + ambientSway) * 0.24;

        // Apply high-performance GPU transform
        el.style.transform = `translate3d(0, 0, 0) rotate(${totalAngle.toFixed(2)}deg) skewX(${skewX.toFixed(2)}deg) scaleY(${scaleY.toFixed(3)})`;

        // Secondary subtle sway on flower heads
        const headEl = headRefs.current[i];
        if (headEl && (stalk.type === 'flower-orange' || stalk.type === 'flower-purple')) {
          const headTilt = (state.currentAngle * 0.62 + Math.sin(elapsed * stalk.freq * 1.35 + stalk.phase) * 1.5).toFixed(2);
          headEl.style.transform = `rotate(${headTilt}deg)`;
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [stalks]);

  return (
    /*
     * CONTAINER:
     *   - bottom: 0  → flush with hero bottom edge, no negative offset
     *   - overflow: hidden  → clips all children strictly within hero bounds
     *   - Responsive height: compact on mobile so it doesn't crowd CTAs, fluid on desktop
     *   - z-index: 30  → above video (z:0) and typography (z:10)
     */
    <div
      ref={containerRef}
      aria-hidden="true"
      className="interactive-vegetation-container absolute bottom-0 left-0 right-0 pointer-events-auto select-none h-[95px] sm:h-[130px] md:h-[160px] lg:h-[180px]"
      style={{
        overflow: 'hidden',
        clipPath: 'inset(0 0 0 0)',
        zIndex: 30,
        isolation: 'isolate',
      }}
    >
      {/* ============================================================ */}
      {/* LAYER A — ATMOSPHERIC MIST & GRADIENT (z-index: 0)           */}
      {/* Soft natural transition into the #FAFBF9 next section        */}
      {/* Keeps the video meadow visible while softening bottom edge   */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Soft morning mist: transparent across top/mid, gently fading to #FAFBF9 at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, ' +
              'transparent              0%,   ' +
              'transparent              35%,  ' +
              'rgba(250,251,249,0.08)  55%,  ' +
              'rgba(250,251,249,0.35)  72%,  ' +
              'rgba(250,251,249,0.72)  88%,  ' +
              'rgba(250,251,249,0.94)  96%,  ' +
              '#FAFBF9                 100%)',
          }}
        />

        {/* Subtle meadow moss tone for natural blending with video grass */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: '45%',
            background:
              'radial-gradient(ellipse 120% 80% at 50% 100%, ' +
              'rgba(42,72,24,0.08) 0%, ' +
              'rgba(30,55,18,0.03) 55%, ' +
              'transparent 100%)',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* LAYER B — INTERACTIVE STALKS & WILDFLOWERS (z-index: 1)      */}
      {/* Matched to video colors with soft contact depth shadow       */}
      {/* ============================================================ */}
      <div
        className="relative w-full h-full pointer-events-none"
        style={{ 
          zIndex: 1,
          filter: 'drop-shadow(0 2px 5px rgba(20,40,14,0.22))'
        }}
      >
        {stalks.map((stalk, idx) => (
          <div
            key={stalk.id}
            ref={(el) => {
              stalkRefs.current[idx] = el;
            }}
            style={{
              left: `${stalk.xPercent}%`,
              // Roots sit at container bottom with natural offset variation
              bottom: `${1 + (stalk.yOffsetPx > 0 ? stalk.yOffsetPx * 0.2 : 0)}px`,
              width: `${stalk.width}px`,
              height: `${stalk.height}px`,
              zIndex: stalk.zIndex,
              transformOrigin: 'bottom center',
              willChange: 'transform',
              // Subtle natural base dissolve so roots merge into the meadow
              maskImage:
                'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 8%, rgba(0,0,0,0.92) 20%, black 30%)',
              WebkitMaskImage:
                'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 8%, rgba(0,0,0,0.92) 20%, black 30%)',
            }}
            className={`absolute pointer-events-none flex justify-center items-end ${
              stalk.isDesktopOnly ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {/* 1. Orange Poppy Blossom (Calibrated to video poppies #FF6814 / #E2500A) */}
            {stalk.type === 'flower-orange' && (
              <svg
                viewBox="0 0 36 140"
                fill="none"
                style={{ width: '100%', height: '100%', overflow: 'hidden' }}
              >
                {/* Curved Poppy Stem */}
                <path
                  d="M18,140 Q16,85 19,36 Q20,20 18,14"
                  stroke="#2D541B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                {/* Delicate Stem Leaf */}
                <path
                  d="M17,92 Q8,86 6,75 Q12,77 18,84"
                  fill="#3E6B20"
                  opacity="0.92"
                />
                {/* Secondary Head with sway */}
                <g 
                  ref={(el) => {
                    headRefs.current[idx] = el;
                  }}
                  style={{ transformOrigin: '18px 14px', willChange: 'transform' }}
                >
                  {/* Outer cup petals */}
                  <path
                    d="M18,14 C11,14 4,7 6,1 C11,2 17,6 18,14 Z"
                    fill="#D9490C"
                  />
                  <path
                    d="M18,14 C25,14 32,7 30,1 C25,2 19,6 18,14 Z"
                    fill="#F26214"
                  />
                  {/* Central open petals */}
                  <path
                    d="M18,14 C13,10 9,2 14,0 C17,3 18,9 18,14 Z"
                    fill="#FF7920"
                  />
                  <path
                    d="M18,14 C23,10 27,2 22,0 C19,3 18,9 18,14 Z"
                    fill="#FF9B38"
                  />
                  {/* Golden Stamen Pistil */}
                  <circle cx="18" cy="7" r="2.5" fill="#281406" />
                  <circle cx="16.5" cy="5.8" r="1" fill="#FFC83B" />
                  <circle cx="19.5" cy="6.2" r="1" fill="#FFC83B" />
                </g>
              </svg>
            )}

            {/* 2. Purple Wildflower (Calibrated to video lupines #7E3A94 / #AC5EC0) */}
            {stalk.type === 'flower-purple' && (
              <svg
                viewBox="0 0 32 125"
                fill="none"
                style={{ width: '100%', height: '100%', overflow: 'hidden' }}
              >
                {/* Slender Curved Stem */}
                <path
                  d="M16,125 Q18,75 15,32 Q14,18 16,12"
                  stroke="#2B5119"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Side leaflet */}
                <path
                  d="M16,72 Q24,66 25,56 Q19,59 16,66"
                  fill="#3B6A20"
                  opacity="0.9"
                />
                {/* Flower Head */}
                <g
                  ref={(el) => {
                    headRefs.current[idx] = el;
                  }}
                  style={{ transformOrigin: '16px 12px', willChange: 'transform' }}
                >
                  {/* 5 Petals */}
                  <ellipse cx="16" cy="4" rx="4.2" ry="5.8" fill="#88429F" />
                  <ellipse cx="9" cy="9" rx="5.2" ry="4.2" fill="#6A2B82" transform="rotate(-30 9 9)" />
                  <ellipse cx="23" cy="9" rx="5.2" ry="4.2" fill="#7E3794" transform="rotate(30 23 9)" />
                  <ellipse cx="11" cy="16" rx="4.8" ry="3.8" fill="#A455BF" transform="rotate(25 11 16)" />
                  <ellipse cx="21" cy="16" rx="4.8" ry="3.8" fill="#B86FCE" transform="rotate(-25 21 16)" />
                  {/* Bright Core */}
                  <circle cx="16" cy="11" r="2.2" fill="#FFE366" />
                  <circle cx="16" cy="11" r="1.1" fill="#FFFFFF" />
                </g>
              </svg>
            )}

            {/* 3. Tall Meadow Grass Blade */}
            {stalk.type === 'grass-tall' && (
              <svg
                viewBox="0 0 24 150"
                fill="none"
                style={{ width: '100%', height: '100%', overflow: 'hidden' }}
              >
                <path
                  d="M10,150 Q7,85 13,40 Q15,12 12,0 Q17,24 16,65 Q14,110 15,150 Z"
                  fill="url(#grass-grad-tall)"
                />
                <defs>
                  <linearGradient id="grass-grad-tall" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#1C3F12" />
                    <stop offset="35%" stopColor="#2E611B" />
                    <stop offset="75%" stopColor="#4D8426" />
                    <stop offset="100%" stopColor="#6DA832" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {/* 4. Medium Arching Grass Blade */}
            {stalk.type === 'grass-medium' && (
              <svg
                viewBox="0 0 20 105"
                fill="none"
                style={{ width: '100%', height: '100%', overflow: 'hidden' }}
              >
                <path
                  d="M8,105 Q13,62 10,28 Q7,6 11,0 Q13,18 12,50 Q9,82 11,105 Z"
                  fill="url(#grass-grad-med)"
                />
                <defs>
                  <linearGradient id="grass-grad-med" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#224716" />
                    <stop offset="50%" stopColor="#3C7221" />
                    <stop offset="100%" stopColor="#5E992C" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {/* 5. Dense Triple-Blade Grass Tuft */}
            {stalk.type === 'grass-tuft' && (
              <svg
                viewBox="0 0 40 110"
                fill="none"
                style={{ width: '100%', height: '100%', overflow: 'hidden' }}
              >
                {/* Left blade */}
                <path
                  d="M18,110 Q13,65 4,32 Q0,12 3,2 Q8,20 15,50 Q19,82 20,110 Z"
                  fill="#2F5C1A"
                  opacity="0.94"
                />
                {/* Center tall blade */}
                <path
                  d="M19,110 Q17,55 21,20 Q22,0 20,0 Q24,14 23,42 Q21,78 22,110 Z"
                  fill="#477C23"
                />
                {/* Right blade */}
                <path
                  d="M21,110 Q26,72 34,38 Q40,20 37,9 Q34,24 28,58 Q23,86 22,110 Z"
                  fill="#396B1E"
                  opacity="0.92"
                />
              </svg>
            )}

            {/* 6. Wild Meadow Sprig */}
            {stalk.type === 'sprig' && (
              <svg
                viewBox="0 0 28 78"
                fill="none"
                style={{ width: '100%', height: '100%', overflow: 'hidden' }}
              >
                <path d="M14,78 Q13,44 15,12" stroke="#2B5018" strokeWidth="2.2" strokeLinecap="round" />
                {/* Lower leaf left */}
                <path d="M14,54 Q5,46 4,37 Q11,40 14,48" fill="#3D6E20" />
                {/* Lower leaf right */}
                <path d="M14,46 Q23,39 24,30 Q17,33 14,41" fill="#4B8125" />
                {/* Top sprout */}
                <ellipse cx="15" cy="9" rx="4.5" ry="6" fill="#5F9A2E" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
