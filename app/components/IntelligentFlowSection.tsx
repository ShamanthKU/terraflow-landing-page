'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowUpRight, Check, Copy, Share2, Compass, Waves, Flame, Sprout } from 'lucide-react';

// ============================================================================
// SIMULATION 1: ONE STREAM (Organic Bioluminescent Particle River)
// ============================================================================
function OneStreamCanvas({
  isHovered,
  activeFilter,
  isActive = true,
}: {
  isHovered: boolean;
  activeFilter: string;
  isActive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 500;
    let height = 320;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || canvas.parentElement.clientWidth || 500;
      height = rect.height || canvas.parentElement.clientHeight || 320;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      channel: 'wa' | 'web' | 'mls' | 'vox';
      streamOffset: number;
    }

    const colors = [
      'rgba(0, 179, 110, ',   // Mint
      'rgba(45, 212, 191, ',  // Cyan
      'rgba(245, 158, 11, ',  // Amber highlight
      'rgba(255, 255, 255, ', // Warm White
    ];

    const particleCount = 380;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const channelType = i % 4 === 0 ? 'wa' : i % 4 === 1 ? 'web' : i % 4 === 2 ? 'mls' : 'vox';
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        channel: channelType,
        streamOffset: (Math.random() - 0.5) * 55,
      });
    }

    let time = 0;
    const render = () => {
      time += 0.012;

      // Gentle trailing motion blur
      ctx.fillStyle = 'rgba(14, 19, 27, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Define central river streamline S-curve
      const riverCenterY = (x: number) => {
        return height * 0.52 + Math.sin(x * 0.007 + time * 1.2) * 40 + Math.cos(x * 0.014 - time * 0.8) * 18;
      };

      // Draw subtle guiding current lines
      ctx.beginPath();
      ctx.strokeStyle = isActive ? 'rgba(0, 179, 110, 0.08)' : 'rgba(45, 212, 191, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 15) {
        const y = riverCenterY(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Channel filter focus
        let channelMatch = true;
        if (activeFilter === 'wa' && p.channel !== 'wa') channelMatch = false;
        if (activeFilter === 'portals' && p.channel !== 'mls') channelMatch = false;

        const effectiveAlpha = channelMatch ? p.baseAlpha : p.baseAlpha * 0.12;

        // Converging physics toward the river current
        const targetY = riverCenterY(p.x) + p.streamOffset;
        const dy = targetY - p.y;
        p.vy += dy * 0.0018;

        // Continuous horizontal flow momentum
        p.vx += 0.025;

        // Apply friction
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Pointer disturbance physics (works for mouse and touch)
        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - p.x;
          const mdy = mouseRef.current.y - p.y;
          const mdist = Math.hypot(mdx, mdy);
          const influenceRadius = 110;

          if (mdist < influenceRadius && mdist > 1) {
            const force = (1 - mdist / influenceRadius) * 0.65;
            const angle = Math.atan2(mdy, mdx);
            p.vx += Math.sin(angle) * force * 1.8 - (mdx / mdist) * force * 0.4;
            p.vy += -Math.cos(angle) * force * 1.8 - (mdy / mdist) * force * 0.4;
            p.alpha = Math.min(1, p.alpha + 0.1);
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around seamlessly
        if (p.x > width + 20) {
          p.x = -10;
          p.y = Math.random() * height;
          p.vx = Math.random() * 0.8 + 0.4;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.y > height + 20) p.y = -10;
        if (p.y < -20) p.y = height + 10;

        // Draw luminous organic particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${effectiveAlpha})`;
        ctx.fill();

        // Subtle bioluminescent aura
        if (p.size > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${effectiveAlpha * 0.25})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeFilter, isActive]);

  const updatePointer = (clientX: number, clientY: number, active: boolean) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      active,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={(e) => updatePointer(e.clientX, e.clientY, true)}
      onMouseLeave={() => { mouseRef.current.active = false; }}
      onTouchStart={(e) => {
        if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }}
      onTouchEnd={() => { mouseRef.current.active = false; }}
      onTouchCancel={() => { mouseRef.current.active = false; }}
      style={{ touchAction: 'pan-y' }}
      className="w-full h-full cursor-crosshair bg-[#0E131B]"
    />
  );
}

// ============================================================================
// SIMULATION 2: INTENT EMERGES (Bioluminescent Microcosm / Intent Gravitation)
// ============================================================================
function IntentEmergenceCanvas({
  isHovered,
  isActive = true,
}: {
  isHovered: boolean;
  isActive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 500;
    let height = 320;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || canvas.parentElement.clientWidth || 500;
      height = rect.height || canvas.parentElement.clientHeight || 320;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    interface Spore {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseRadius: number;
      pulsePhase: number;
      pulseSpeed: number;
      isHighIntent: boolean;
      luminance: number;
      color: string;
    }

    const sporeCount = 260;
    const spores: Spore[] = [];

    for (let i = 0; i < sporeCount; i++) {
      const isHighIntent = i < 45;
      spores.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: isHighIntent ? Math.random() * 2.2 + 2.0 : Math.random() * 1.4 + 0.8,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        isHighIntent,
        luminance: isHighIntent ? 0.9 : Math.random() * 0.25 + 0.08,
        color: isHighIntent ? (i % 2 === 0 ? '#00B36E' : '#2DD4BF') : '#94A3B8',
      });
    }

    let time = 0;
    const render = () => {
      time += 0.015;
      const centerX = width * 0.5;
      const centerY = height * 0.52;

      // Theme-adaptive atmosphere
      ctx.fillStyle = 'rgba(14, 19, 27, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient central beacon glow
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 130);
      coreGrad.addColorStop(0, 'rgba(0, 179, 110, 0.10)');
      coreGrad.addColorStop(0.5, 'rgba(45, 212, 191, 0.04)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < spores.length; i++) {
        const s = spores[i];
        s.pulsePhase += s.pulseSpeed;
        const pulse = Math.sin(s.pulsePhase) * 0.3 + 0.7;

        if (s.isHighIntent) {
          // Gravitate toward central intent cluster
          const dxCenter = centerX - s.x;
          const dyCenter = centerY - s.y;
          const distCenter = Math.hypot(dxCenter, dyCenter);

          if (distCenter > 35) {
            s.vx += (dxCenter / distCenter) * 0.025;
            s.vy += (dyCenter / distCenter) * 0.025;
          } else {
            s.vx += (-dyCenter / distCenter) * 0.035;
            s.vy += (dxCenter / distCenter) * 0.035;
          }
        } else {
          s.vx += (Math.random() - 0.5) * 0.04;
          s.vy += (Math.random() - 0.5) * 0.04;
        }

        s.vx *= 0.98;
        s.vy *= 0.98;

        // Pointer gravitational field (mouse and touch)
        if (mouseRef.current.active) {
          const dxMouse = s.x - mouseRef.current.x;
          const dyMouse = s.y - mouseRef.current.y;
          const distMouse = Math.hypot(dxMouse, dyMouse);
          const influenceRadius = 110;

          if (distMouse < influenceRadius) {
            const pull = (1 - distMouse / influenceRadius) * 0.65;
            if (s.isHighIntent) {
              s.vx -= (dxMouse / distMouse) * pull * 1.5;
              s.vy -= (dyMouse / distMouse) * pull * 1.5;
              s.luminance = Math.min(1, s.luminance + 0.15);
            } else {
              s.vx += (dxMouse / distMouse) * pull * 0.6;
              s.vy += (dyMouse / distMouse) * pull * 0.6;
            }
          }
        }

        s.x += s.vx;
        s.y += s.vy;

        // Wrap boundaries
        if (s.x < 10) s.x = width - 10;
        if (s.x > width - 10) s.x = 10;
        if (s.y < 10) s.y = height - 10;
        if (s.y > height - 10) s.y = 10;

        const r = s.baseRadius * pulse;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);

        if (s.isHighIntent) {
          const highColor = isActive ? (s.color === '#2DD4BF' ? '#0D9488' : '#00B36E') : s.color;
          ctx.fillStyle = highColor;
          ctx.shadowColor = highColor;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.beginPath();
          ctx.arc(s.x, s.y, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? 'rgba(0, 179, 110, 0.14)' : 'rgba(45, 212, 191, 0.18)';
          ctx.fill();
        } else {
          ctx.fillStyle = isActive ? `rgba(113, 128, 150, ${s.luminance * 0.5})` : `rgba(148, 163, 184, ${s.luminance * 0.6})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  const updatePointer = (clientX: number, clientY: number, active: boolean) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      active,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={(e) => updatePointer(e.clientX, e.clientY, true)}
      onMouseLeave={() => { mouseRef.current.active = false; }}
      onTouchStart={(e) => {
        if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }}
      onTouchEnd={() => { mouseRef.current.active = false; }}
      onTouchCancel={() => { mouseRef.current.active = false; }}
      style={{ touchAction: 'pan-y' }}
      className="w-full h-full cursor-crosshair bg-[#0E131B]"
    />
  );
}

// ============================================================================
// SIMULATION 3: THE NEXT STEP (Organic Underwater Silk Ribbons)
// ============================================================================
function NextStepRibbonsCanvas({
  isHovered,
  mode = 'auto',
  isActive = true,
}: {
  isHovered: boolean;
  mode?: string;
  isActive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 500;
    let height = 320;

    const ribbonCount = 8;
    interface RibbonNode {
      x: number;
      y: number;
      origY: number;
      vx: number;
      vy: number;
    }

    interface Ribbon {
      nodes: RibbonNode[];
      color: string;
      strokeWidth: number;
      phase: number;
      speed: number;
      harmonyWeight: number;
    }

    const palette = [
      'rgba(0, 179, 110, 0.85)',   // Deep Mint
      'rgba(45, 212, 191, 0.8)',   // Cyan
      'rgba(16, 185, 129, 0.75)',  // Emerald
      'rgba(245, 158, 11, 0.7)',   // Warm Amber highlight
      'rgba(20, 38, 28, 0.65)',    // Deep Forest
    ];

    const ribbons: Ribbon[] = [];
    const nodeCount = 18;

    const initRibbons = (w: number, h: number) => {
      ribbons.length = 0;
      for (let r = 0; r < ribbonCount; r++) {
        const nodes: RibbonNode[] = [];
        const baseSpacing = w / (nodeCount - 1);
        const targetFlowY = h * 0.35 + (r * (h * 0.38)) / ribbonCount;

        for (let n = 0; n < nodeCount; n++) {
          const initialTangle = Math.sin(n * 0.8 + r * 1.5) * 35;
          nodes.push({
            x: n * baseSpacing,
            y: targetFlowY + initialTangle,
            origY: targetFlowY,
            vx: 0,
            vy: 0,
          });
        }

        ribbons.push({
          nodes,
          color: palette[r % palette.length],
          strokeWidth: 2.2 + (r % 3) * 0.8,
          phase: r * 0.7,
          speed: 0.015 + (r % 4) * 0.005,
          harmonyWeight: 0,
        });
      }
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || canvas.parentElement.clientWidth || 500;
      height = rect.height || canvas.parentElement.clientHeight || 320;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (ribbons.length === 0) {
        initRibbons(width, height);
      } else {
        // Re-anchor existing ribbon nodes smoothly to new width/height
        const baseSpacing = width / (nodeCount - 1);
        for (let r = 0; r < ribbons.length; r++) {
          const targetFlowY = height * 0.35 + (r * (height * 0.38)) / ribbonCount;
          for (let n = 0; n < ribbons[r].nodes.length; n++) {
            ribbons[r].nodes[n].x = n * baseSpacing;
            ribbons[r].nodes[n].origY = targetFlowY;
          }
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let time = 0;
    const render = () => {
      time += 0.016;

      ctx.fillStyle = 'rgba(14, 19, 27, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw each ribbon
      for (let r = 0; r < ribbons.length; r++) {
        const ribbon = ribbons[r];
        ribbon.harmonyWeight = Math.min(1, ribbon.harmonyWeight + 0.002);

        const nodes = ribbon.nodes;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const harmonicOffset = Math.sin(time * 1.8 + i * 0.35 + ribbon.phase) * (26 * (1 - ribbon.harmonyWeight * 0.6));
          const targetY = node.origY + harmonicOffset;

          node.vy += (targetY - node.y) * 0.045;
          node.vy *= 0.88;

          // Pointer deflection (mouse and touch)
          if (mouseRef.current.active) {
            const dx = node.x - mouseRef.current.x;
            const dy = node.y - mouseRef.current.y;
            const dist = Math.hypot(dx, dy);
            const radius = 95;

            if (dist < radius && dist > 1) {
              const push = (1 - dist / radius) * 20;
              node.vy += (dy / dist) * push;
            }
          }

          node.y += node.vy;
        }

        // Draw smooth fluid ribbon curve
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);

        for (let i = 0; i < nodes.length - 1; i++) {
          const xc = (nodes[i].x + nodes[i + 1].x) / 2;
          const yc = (nodes[i].y + nodes[i + 1].y) / 2;
          ctx.quadraticCurveTo(nodes[i].x, nodes[i].y, xc, yc);
        }
        ctx.lineTo(nodes[nodes.length - 1].x, nodes[nodes.length - 1].y);

        ctx.strokeStyle = ribbon.color;
        ctx.lineWidth = ribbon.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Subtle parallel shadow ribbon
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y + 3.5);
        for (let i = 0; i < nodes.length - 1; i++) {
          const xc = (nodes[i].x + nodes[i + 1].x) / 2;
          const yc = (nodes[i].y + nodes[i + 1].y) / 2 + 3.5;
          ctx.quadraticCurveTo(nodes[i].x, nodes[i].y + 3.5, xc, yc);
        }
        ctx.lineTo(nodes[nodes.length - 1].x, nodes[nodes.length - 1].y + 3.5);
        ctx.strokeStyle = isActive ? 'rgba(0, 179, 110, 0.05)' : 'rgba(45, 212, 191, 0.08)';
        ctx.lineWidth = ribbon.strokeWidth * 1.6;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  const updatePointer = (clientX: number, clientY: number, active: boolean) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      active,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={(e) => updatePointer(e.clientX, e.clientY, true)}
      onMouseLeave={() => { mouseRef.current.active = false; }}
      onTouchStart={(e) => {
        if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }}
      onTouchEnd={() => { mouseRef.current.active = false; }}
      onTouchCancel={() => { mouseRef.current.active = false; }}
      style={{ touchAction: 'pan-y' }}
      className="w-full h-full cursor-crosshair bg-[#0E131B]"
    />
  );


}

// ============================================================================
// SIMULATION 4: MOMENTUM (Hyper-Realistic Kinetic Sculpture — 5 Metallic Spheres)
// Photorealistic brushed titanium & studio lighting Newton's cradle mechanism.
// Communicates physical momentum transfer with zero internal text or HUD badges.
// ============================================================================

interface AtmosphericDustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  phase: number;
}

interface MomentumPendulumCanvasProps {
  isHovered: boolean;
  isActive?: boolean;
  externalAction?: 'left' | 'wave' | 'right' | 'auto' | null;
  onStageChange?: (stageIdx: number) => void;
}

function MomentumPendulumCanvas({
  isHovered,
  isActive = true,
  externalAction = null,
  onStageChange,
}: MomentumPendulumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerActionRef = useRef<((act: 'left' | 'wave' | 'right' | 'auto') => void) | null>(null);
  const mouseRef = useRef<{ x: number; y: number; normX: number; normY: number }>({
    x: 0,
    y: 0,
    normX: 0,
    normY: 0,
  });

  useEffect(() => {
    if (externalAction && triggerActionRef.current) {
      triggerActionRef.current(externalAction);
    }
  }, [externalAction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 500;
    let height = 340;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 500;
      height = rect.height || 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 5 perfectly aligned metallic spheres
    const BALL_COUNT = 5;
    const ballRadius = Math.max(16, Math.min(23, Math.floor(width / 24)));
    const stringLen = Math.max(105, Math.min(142, Math.floor(height * 0.40)));
    const pivotY = 32;
    const restY = pivotY + stringLen;
    const centerRestX = width / 2;

    // 5 tangent resting coordinates
    const restPositions = [
      centerRestX - 4 * ballRadius,
      centerRestX - 2 * ballRadius,
      centerRestX,
      centerRestX + 2 * ballRadius,
      centerRestX + 4 * ballRadius,
    ];

    // Physics parameters for realistic weight and gravity
    const omega = 4.3; // rad/s natural pendulum frequency (deliberate heavy swing)
    let swingAmp = 0.78; // max angular deflection (~45 degrees)
    const swingDuration = Math.PI / omega; // half period (outward & return to impact)

    // System state machine:
    // 'SWING_LEFT'  -> Ball 0 swings out and returns to impact Ball 1
    // 'MOMENTUM_TX' -> Microsecond acoustic momentum transfer through Balls 1, 2, 3
    // 'SWING_RIGHT' -> Ball 4 swings out and returns to impact Ball 3
    let phase: 'SWING_LEFT' | 'MOMENTUM_TX' | 'SWING_RIGHT' = 'SWING_LEFT';
    let swingTime = Math.PI / (2 * omega); // start mid-swing inward for immediate realism
    let transferTime = 0;
    let transferDir: 'L_TO_R' | 'R_TO_L' = 'L_TO_R';

    // Microscopic physical vibrations after impact
    let shudderTime = 0;
    let cableVibeTime = 0;

    // Dragging state for direct user interaction
    let isDragging = false;
    let draggedBallIdx = -1;
    let dragAngle = 0;

    // Subtle atmospheric dust motes floating in studio light
    const dustMotes: AtmosphericDustMote[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.25 + 0.08),
      radius: Math.random() * 1.5 + 0.6,
      baseAlpha: Math.random() * 0.25 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));

    triggerActionRef.current = (act: 'left' | 'wave' | 'right' | 'auto') => {
      if (act === 'left') {
        phase = 'SWING_LEFT';
        swingTime = 0;
        swingAmp = 0.82;
        onStageChange?.(0);
      } else if (act === 'right') {
        phase = 'SWING_RIGHT';
        swingTime = 0;
        swingAmp = 0.82;
        onStageChange?.(4);
      } else if (act === 'wave') {
        phase = 'MOMENTUM_TX';
        transferTime = 0;
        transferDir = 'L_TO_R';
        shudderTime = 0.16;
        cableVibeTime = 0.24;
      } else {
        swingAmp = 0.78;
      }
    };

    let prevTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      ctx.clearRect(0, 0, width, height);

      // --- 1. DARK STUDIO ENVIRONMENT (#0B0E14) WITH VOLUMETRIC SOFTBOX LIGHT ---
      const mouseCamX = mouseRef.current.normX * 5;
      const mouseCamY = mouseRef.current.normY * 4;

      // Studio background gradient with cool overhead key light
      const studioGrad = ctx.createRadialGradient(
        centerRestX + mouseCamX * 2,
        pivotY - 10,
        20,
        centerRestX,
        height * 0.6,
        Math.max(width, height) * 0.75
      );
      studioGrad.addColorStop(0, '#151D28'); // Overhead softbox illumination
      studioGrad.addColorStop(0.35, '#0E141D');
      studioGrad.addColorStop(0.7, '#0B0E14');
      studioGrad.addColorStop(1, '#07090D');
      ctx.fillStyle = studioGrad;
      ctx.fillRect(0, 0, width, height);

      // Studio floor reflection sheen
      const floorGrad = ctx.createLinearGradient(0, restY + ballRadius + 15, 0, height);
      floorGrad.addColorStop(0, 'rgba(11, 14, 20, 0)');
      floorGrad.addColorStop(0.4, 'rgba(21, 26, 35, 0.35)');
      floorGrad.addColorStop(1, 'rgba(7, 9, 13, 0.85)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, restY + ballRadius + 15, width, height - (restY + ballRadius + 15));

      // Atmospheric dust motes gently drifting in studio light
      ctx.save();
      for (let i = 0; i < dustMotes.length; i++) {
        const m = dustMotes[i];
        m.x += m.vx + mouseRef.current.normX * 0.15;
        m.y += m.vy;
        m.phase += 0.02;

        if (m.y < 0) m.y = height + 5;
        if (m.x < 0) m.x = width + 5;
        if (m.x > width + 5) m.x = -5;

        const alpha = Math.max(0.02, m.baseAlpha + Math.sin(m.phase) * 0.08);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 234, 243, ${alpha})`;
        ctx.fill();
      }
      ctx.restore();

      // --- 2. PHYSICS & HARMONIC OSCILLATOR CALCULATIONS ---
      let theta0 = 0;
      let theta4 = 0;
      let coreShudder = 0;

      if (shudderTime > 0) {
        shudderTime -= dt;
        coreShudder = Math.sin(shudderTime * 130) * Math.exp(-shudderTime * 18) * 0.5;
      }
      if (cableVibeTime > 0) {
        cableVibeTime -= dt;
      }

      if (isDragging) {
        if (draggedBallIdx === 0) {
          theta0 = dragAngle;
        } else if (draggedBallIdx === 4) {
          theta4 = dragAngle;
        }
      } else {
        if (phase === 'SWING_LEFT') {
          swingTime += dt;
          // Harmonic outward and return swing: decelerates at apex, accelerates inward
          theta0 = -swingAmp * Math.sin(swingTime * omega);

          // Impact occurs at half period
          if (swingTime >= swingDuration) {
            theta0 = 0;
            phase = 'MOMENTUM_TX';
            transferTime = 0;
            transferDir = 'L_TO_R';
            shudderTime = 0.18;
            cableVibeTime = 0.28;
          }
        } else if (phase === 'MOMENTUM_TX') {
          transferTime += dt;
          // Ultra-crisp acoustic momentum transfer (0.04s transmission through 3 core balls)
          if (transferTime >= 0.04) {
            if (transferDir === 'L_TO_R') {
              phase = 'SWING_RIGHT';
              swingTime = 0;
            } else {
              phase = 'SWING_LEFT';
              swingTime = 0;
            }
          }
        } else if (phase === 'SWING_RIGHT') {
          swingTime += dt;
          // Harmonic outward and return swing to the right
          theta4 = swingAmp * Math.sin(swingTime * omega);

          // Impact occurs on return
          if (swingTime >= swingDuration) {
            theta4 = 0;
            phase = 'MOMENTUM_TX';
            transferTime = 0;
            transferDir = 'R_TO_L';
            shudderTime = 0.18;
            cableVibeTime = 0.28;
          }
        }
      }

      // Compute precise physical coordinates for each of the 5 spheres
      const ballCoords = [
        {
          x: restPositions[0] + stringLen * Math.sin(theta0) + mouseCamX * 0.8,
          y: pivotY + stringLen * Math.cos(theta0) + mouseCamY * 0.6,
          theta: theta0,
        },
        {
          x: restPositions[1] + coreShudder * (transferDir === 'L_TO_R' ? 0.7 : -0.7) + mouseCamX * 0.9,
          y: restY + mouseCamY * 0.6,
          theta: 0,
        },
        {
          x: restPositions[2] + coreShudder * (transferDir === 'L_TO_R' ? 0.9 : -0.9) + mouseCamX * 1.0,
          y: restY + mouseCamY * 0.6,
          theta: 0,
        },
        {
          x: restPositions[3] + coreShudder * (transferDir === 'L_TO_R' ? 0.7 : -0.7) + mouseCamX * 1.1,
          y: restY + mouseCamY * 0.6,
          theta: 0,
        },
        {
          x: restPositions[4] + stringLen * Math.sin(theta4) + mouseCamX * 1.2,
          y: pivotY + stringLen * Math.cos(theta4) + mouseCamY * 0.6,
          theta: theta4,
        },
      ];

      // --- 3. TOP MACHINED TITANIUM SUSPENSION RAIL ---
      ctx.save();
      const railWidth = 11.6 * ballRadius;
      const railLeft = centerRestX - railWidth / 2 + mouseCamX;
      const railTop = pivotY - 7 + mouseCamY * 0.4;

      // Machined titanium rail body with beveled specular highlights
      const railGrad = ctx.createLinearGradient(0, railTop, 0, railTop + 8);
      railGrad.addColorStop(0, '#475569');
      railGrad.addColorStop(0.25, '#94A3B8');
      railGrad.addColorStop(0.65, '#64748B');
      railGrad.addColorStop(1, '#1E293B');
      ctx.fillStyle = railGrad;
      ctx.beginPath();
      ctx.roundRect(railLeft, railTop, railWidth, 8, 3);
      ctx.fill();

      // Top suspension anchor pins (2 per ball for realistic V-suspension)
      for (let i = 0; i < BALL_COUNT; i++) {
        const bx = restPositions[i] + mouseCamX;
        ctx.beginPath();
        ctx.arc(bx - 3.8, railTop + 4, 1.8, 0, Math.PI * 2);
        ctx.arc(bx + 3.8, railTop + 4, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#CBD5E1';
        ctx.fill();
      }
      ctx.restore();

      // --- 4. SOFT CONTACT DROP SHADOWS UNDER SPHERES ON STUDIO FLOOR ---
      const floorShadowY = restY + ballRadius + 32 + mouseCamY * 0.4;
      for (let i = 0; i < BALL_COUNT; i++) {
        const b = ballCoords[i];
        // As a ball swings up, its shadow blurs out and fades away with distance
        const heightLift = Math.max(0, restY - b.y + ballRadius * (1 - Math.cos(b.theta)));
        const shadowScale = Math.max(0.3, 1 - heightLift / 160);
        const shadowAlpha = Math.max(0.04, (1 - heightLift / 140) * 0.55);

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          b.x,
          floorShadowY,
          ballRadius * 0.95 * shadowScale,
          ballRadius * 0.28 * shadowScale,
          0,
          0,
          Math.PI * 2
        );
        const shadowGrad = ctx.createRadialGradient(
          b.x,
          floorShadowY,
          0,
          b.x,
          floorShadowY,
          ballRadius * 0.95 * shadowScale
        );
        shadowGrad.addColorStop(0, `rgba(0, 0, 0, ${shadowAlpha})`);
        shadowGrad.addColorStop(0.6, `rgba(7, 9, 13, ${shadowAlpha * 0.5})`);
        shadowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = shadowGrad;
        ctx.fill();
        ctx.restore();
      }

      // --- 5. DUAL V-SUSPENSION CABLES (THIN HIGH-TENSILE STEEL) ---
      for (let i = 0; i < BALL_COUNT; i++) {
        const pX = restPositions[i] + mouseCamX;
        const pY = railTop + 4;
        const b = ballCoords[i];

        // Micro cable transverse wave on impact
        const cableWave = cableVibeTime > 0 ? Math.sin(cableVibeTime * 70) * 0.4 : 0;

        ctx.save();
        ctx.beginPath();
        // Left V-cable
        ctx.moveTo(pX - 3.8, pY);
        ctx.lineTo(b.x - 1 + cableWave, b.y - ballRadius * 0.92);
        // Right V-cable
        ctx.moveTo(pX + 3.8, pY);
        ctx.lineTo(b.x + 1 + cableWave, b.y - ballRadius * 0.92);

        // Thin high-tensile steel appearance (visible when illuminated)
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.42)';
        ctx.lineWidth = 0.85;
        ctx.stroke();

        // Top collar eyelet connector
        ctx.beginPath();
        ctx.arc(b.x, b.y - ballRadius * 0.96, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#94A3B8';
        ctx.fill();

        ctx.restore();
      }

      // --- 6. 5 PHOTOREALISTIC BRUSHED TITANIUM SPHERES ---
      for (let i = 0; i < BALL_COUNT; i++) {
        const b = ballCoords[i];

        ctx.save();

        // Ambient occlusion shadow in the narrow crevices between touching spheres
        if (i < BALL_COUNT - 1) {
          const nextB = ballCoords[i + 1];
          const dist = Math.hypot(nextB.x - b.x, nextB.y - b.y);
          if (dist < ballRadius * 2.15) {
            const midX = (b.x + nextB.x) / 2;
            const midY = (b.y + nextB.y) / 2;
            ctx.beginPath();
            ctx.ellipse(midX, midY, 3, ballRadius * 0.75, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            ctx.fill();
          }
        }

        // --- PHYSICAL SPHERE SHADING (Brushed Titanium Alloy) ---
        ctx.beginPath();
        ctx.arc(b.x, b.y, ballRadius, 0, Math.PI * 2);

        // Multi-stop 3D radial sphere gradient
        // Specular key light offset toward top-left overhead studio softbox
        const lightOffsetX = b.x - ballRadius * 0.35 + mouseRef.current.normX * 2;
        const lightOffsetY = b.y - ballRadius * 0.38 + mouseRef.current.normY * 2;
        const sphereGrad = ctx.createRadialGradient(
          lightOffsetX,
          lightOffsetY,
          ballRadius * 0.05,
          b.x,
          b.y,
          ballRadius
        );

        // Realistic studio lighting:
        // Hot specular core -> soft brushed titanium -> neutral steel midtones -> dark shadow rim
        sphereGrad.addColorStop(0, '#FFFFFF'); // Hot white overhead reflection
        sphereGrad.addColorStop(0.16, '#F8FAFC');
        sphereGrad.addColorStop(0.38, '#CBD5E1'); // Brushed titanium highlight
        sphereGrad.addColorStop(0.68, '#64748B'); // Metal midtones
        sphereGrad.addColorStop(0.92, '#334155'); // Shadow rim
        sphereGrad.addColorStop(1, '#0F172A');    // Ambient dark floor occlusion
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // Subtle TerraFlow cyan rim light reflection (#2DD4BF)
        // Delicate, tasteful studio rim reflection — NOT neon glow
        const isPrimaryActive = (i === 0 && Math.abs(theta0) > 0.05) || (i === 4 && Math.abs(theta4) > 0.05);
        ctx.beginPath();
        ctx.arc(b.x, b.y, ballRadius - 0.4, 0, Math.PI * 2);
        const rimGrad = ctx.createRadialGradient(
          b.x + ballRadius * 0.45,
          b.y + ballRadius * 0.35,
          ballRadius * 0.3,
          b.x,
          b.y,
          ballRadius
        );
        rimGrad.addColorStop(0, 'transparent');
        rimGrad.addColorStop(0.78, 'transparent');
        rimGrad.addColorStop(
          0.98,
          isPrimaryActive ? 'rgba(45, 212, 191, 0.28)' : 'rgba(45, 212, 191, 0.12)'
        );
        rimGrad.addColorStop(1, 'rgba(45, 212, 191, 0.04)');
        ctx.fillStyle = rimGrad;
        ctx.fill();

        // Brushed metallic anisotropic reflection arc (subtle lathe texture)
        ctx.beginPath();
        ctx.ellipse(
          b.x,
          b.y - ballRadius * 0.1,
          ballRadius * 0.75,
          ballRadius * 0.28,
          -0.2,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Secondary soft specular glint
        ctx.beginPath();
        ctx.arc(lightOffsetX, lightOffsetY, ballRadius * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // --- 7. INTUITIVE INTERACTIVE POINTER & TOUCH HANDLERS ---
    const handlePointerDown = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const pt = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };

      const d0 = Math.hypot(pt.x - restPositions[0], pt.y - restY);
      const d4 = Math.hypot(pt.x - restPositions[4], pt.y - restY);
      const dMid = Math.hypot(pt.x - centerRestX, pt.y - restY);

      if (d0 < ballRadius * 2.5) {
        // Drag or pull back leftmost ball
        isDragging = true;
        draggedBallIdx = 0;
        dragAngle = -0.75;
      } else if (d4 < ballRadius * 2.5) {
        // Drag or pull back rightmost ball
        isDragging = true;
        draggedBallIdx = 4;
        dragAngle = 0.75;
      } else if (dMid < ballRadius * 3.5) {
        // Tap middle balls -> Trigger crisp momentum wave
        phase = 'MOMENTUM_TX';
        transferTime = 0;
        transferDir = 'L_TO_R';
        shudderTime = 0.16;
        cableVibeTime = 0.24;
      } else {
        // Click elsewhere on canvas: directional impulse
        if (pt.x < centerRestX) {
          triggerActionRef.current?.('left');
        } else {
          triggerActionRef.current?.('right');
        }
      }
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const pt = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };

      // Mouse tracking for subtle camera perspective parallax
      mouseRef.current.x = pt.x;
      mouseRef.current.y = pt.y;
      mouseRef.current.normX = Math.max(-1, Math.min(1, (pt.x / width - 0.5) * 2));
      mouseRef.current.normY = Math.max(-1, Math.min(1, (pt.y / height - 0.5) * 2));

      if (!isDragging) return;

      if (draggedBallIdx === 0) {
        const dx = pt.x - restPositions[0];
        const dy = Math.max(20, pt.y - pivotY);
        dragAngle = Math.min(0, Math.max(-1.15, Math.atan2(dx, dy)));
      } else if (draggedBallIdx === 4) {
        const dx = pt.x - restPositions[4];
        const dy = Math.max(20, pt.y - pivotY);
        dragAngle = Math.max(0, Math.min(1.15, Math.atan2(dx, dy)));
      }
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      if (draggedBallIdx === 0) {
        swingAmp = Math.max(0.35, Math.abs(dragAngle));
        phase = 'SWING_LEFT';
        swingTime = Math.PI / (2 * omega); // release from apex to swing inward with gravity
      } else if (draggedBallIdx === 4) {
        swingAmp = Math.max(0.35, Math.abs(dragAngle));
        phase = 'SWING_RIGHT';
        swingTime = Math.PI / (2 * omega); // release from apex to swing inward with gravity
      }
      draggedBallIdx = -1;
    };

    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handlePointerUp();

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing overflow-hidden rounded-xl bg-[#0B0E14]"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        title="Interactive kinetic momentum sculpture"
      />
    </div>
  );
}


// ============================================================================
// MAIN COMPONENT: ACT III — "Turn the chaos into a flow."
// ============================================================================
export default function IntelligentFlowSection() {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [copiedCard, setCopiedCard] = useState<string | null>(null);
  const [streamFilter, setStreamFilter] = useState<'all' | 'wa' | 'portals'>('all');
  const [activeIntentFilter, setActiveIntentFilter] = useState<'all' | 'ready' | 'nurture'>('ready');
  const [nextStepMode, setNextStepMode] = useState<'auto' | 'vip' | 'calendar'>('auto');
  const [momentumAction, setMomentumAction] = useState<'auto' | 'left' | 'wave' | 'right'>('auto');

  const handleCopyLink = (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText?.(window.location.href);
      setCopiedCard(cardId);
      setTimeout(() => setCopiedCard(null), 2000);
    }
  };

  const isCard1Active = activeCardIndex === 0;
  const isCard2Active = activeCardIndex === 1;
  const isCard3Active = activeCardIndex === 2;
  const isCard4Active = activeCardIndex === 3;

  return (
    <section
      id="intelligent-flow"
      className="relative z-10 w-full py-20 sm:py-28 md:py-36 px-3.5 xs:px-4 sm:px-6 lg:px-8 bg-[#F4F7FA] text-[#14261C] font-sans selection:bg-emerald-200 selection:text-emerald-950 overflow-hidden"
    >
      {/* Soft Ambient Background Lensing */}
      <div
        className="absolute top-0 inset-x-0 h-96 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 179, 110, 0.07) 0%, rgba(45, 212, 191, 0.03) 45%, transparent 80%)',
        }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* ================================================================ */}
        {/* SECTION HEADER: ACT III TRANSFORMATION STATEMENT                 */}
        {/* ================================================================ */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#00B36E]/25 text-[#00B36E] text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00B36E]" aria-hidden="true" />
            <span>03 / THE TRANSFORMATION</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#14261C] leading-[1.12] tracking-tight font-normal">
            Turn the Chaos.{' '}
            <span className="italic font-normal text-[#00B36E]">
              Into a Flow.
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#3A5043] font-sans font-medium leading-relaxed max-w-2xl mx-auto px-2">
            Autonomous multichannel intelligence where every signal connects and every lead converts.
          </p>
        </div>

        {/* ================================================================ */}
        {/* 2 × 2 SOPHISTICATED EDITORIAL GRID OF LIVING VISUAL CARDS         */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xs:gap-6 sm:gap-8 md:gap-10 w-full">
          
          {/* ============================================================== */}
          {/* CARD 01: ONE STREAM                                            */}
          {/* ============================================================== */}
          <div
            onClick={() => setActiveCardIndex(0)}
            onMouseEnter={() => setActiveCardIndex(0)}
            className={`relative rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-7 md:p-8 transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-pointer border select-none ${
              isCard1Active
                ? 'bg-white text-[#2D3436] border-[#00B36E]/40 shadow-[0_20px_50px_rgba(0,179,110,0.14)] scale-[1.01]'
                : 'bg-[#151A23]/95 text-[#E5EAF3] border-[#2D333E] shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-[#2DD4BF]/40'
            }`}
          >
            {/* Corner Tick Marks ⌜ ⌝ ⌞ ⌟ */}
            <div className={`absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-l-2 pointer-events-none transition-colors duration-300 ${isCard1Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-r-2 pointer-events-none transition-colors duration-300 ${isCard1Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-l-2 pointer-events-none transition-colors duration-300 ${isCard1Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-r-2 pointer-events-none transition-colors duration-300 ${isCard1Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />

            {/* Top Indicator */}
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-colors duration-300 ${
                  isCard1Active
                    ? 'text-[#00B36E] bg-[#00B36E]/10 border-[#00B36E]/25'
                    : 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/25'
                }`}>
                  01 / CONVERGENCE
                </span>
                <span className={`text-[11px] sm:text-xs font-medium hidden xs:inline transition-colors duration-300 ${
                  isCard1Active ? 'text-[#718096]' : 'text-[#97A3B6]'
                }`}>
                  Bioluminescent Stream
                </span>
              </div>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-colors duration-300 shrink-0 ${
                isCard1Active
                  ? 'bg-[#FAFBF9] border-[#00B36E]/20 text-[#00B36E]'
                  : 'bg-[#1A2230] border-[#2D333E] text-[#2DD4BF]'
              }`}>
                <Waves className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Living Visual Canvas Area */}
            <div className="relative w-full h-60 xs:h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden border shadow-inner my-2 bg-[#0E131B] border-[#2D333E]">
              <OneStreamCanvas isHovered={true} activeFilter={streamFilter} isActive={isCard1Active} />
            </div>

            {/* Editorial Content */}
            <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t transition-colors duration-300 ${
              isCard1Active ? 'border-[#14261C]/8' : 'border-[#2D333E]'
            }`}>
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className={`font-editorial text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300 ${
                    isCard1Active ? 'text-[#14261C]' : 'text-white'
                  }`}>
                    One Stream
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold tracking-wide mt-1 transition-colors duration-300 ${
                    isCard1Active ? 'text-[#00B36E]' : 'text-[#2DD4BF]'
                  }`}>
                    Everything flows into one place.
                  </p>
                </div>
                <a
                  href="#hero"
                  aria-label="One Stream details"
                  onClick={(e) => e.stopPropagation()}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm ${
                    isCard1Active
                      ? 'bg-[#14261C] text-white hover:bg-[#00B36E]'
                      : 'bg-[#242D3C] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0B0E14]'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>

              <p className={`mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed font-sans transition-colors duration-300 ${
                isCard1Active ? 'text-[#4A5568]' : 'text-[#97A3B6]'
              }`}>
                Website, WhatsApp, portals, campaigns and calls become one continuous lead stream without fractured data.
              </p>

              {/* Bottom Control Pills - Mobile First Layout */}
              <div className={`mt-4 sm:mt-5 pt-3 sm:pt-4 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 sm:gap-3 border-t transition-colors duration-300 ${
                isCard1Active ? 'border-[#14261C]/6' : 'border-[#2D333E]'
              }`}>
                <div className={`inline-flex items-center justify-between xs:justify-start p-0.5 sm:p-1 rounded-xl border text-[11px] sm:text-xs font-semibold overflow-x-auto scrollbar-none transition-colors duration-300 ${
                  isCard1Active ? 'bg-[#EDF2F7] border-black/5 text-[#4A5568]' : 'bg-[#1A2230] border-[#2D333E] text-[#97A3B6]'
                }`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStreamFilter('all'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      streamFilter === 'all'
                        ? isCard1Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard1Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    All Channels
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStreamFilter('wa'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      streamFilter === 'wa'
                        ? isCard1Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard1Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStreamFilter('portals'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      streamFilter === 'portals'
                        ? isCard1Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard1Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    Portals
                  </button>
                </div>

                <button
                  onClick={(e) => handleCopyLink('card-01', e)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all shadow-sm shrink-0 w-full xs:w-auto ${
                    isCard1Active
                      ? 'bg-white text-[#2D3748] border-[#14261C]/10 hover:border-[#00B36E]'
                      : 'bg-[#1A2230] text-[#E5EAF3] border-[#2D333E] hover:border-[#2DD4BF]'
                  }`}
                >
                  {copiedCard === 'card-01' ? <Check className="w-3.5 h-3.5 text-[#00B36E]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCard === 'card-01' ? 'Link Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 02: INTENT EMERGES                                        */}
          {/* ============================================================== */}
          <div
            onClick={() => setActiveCardIndex(1)}
            onMouseEnter={() => setActiveCardIndex(1)}
            className={`relative rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-7 md:p-8 transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-pointer border select-none ${
              isCard2Active
                ? 'bg-white text-[#2D3436] border-[#00B36E]/40 shadow-[0_20px_50px_rgba(0,179,110,0.14)] scale-[1.01]'
                : 'bg-[#151A23]/95 text-[#E5EAF3] border-[#2D333E] shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-[#2DD4BF]/40'
            }`}
          >
            {/* Corner Tick Marks ⌜ ⌝ ⌞ ⌟ */}
            <div className={`absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-l-2 pointer-events-none transition-colors duration-300 ${isCard2Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-r-2 pointer-events-none transition-colors duration-300 ${isCard2Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-l-2 pointer-events-none transition-colors duration-300 ${isCard2Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-r-2 pointer-events-none transition-colors duration-300 ${isCard2Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />

            {/* Top Indicator */}
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-colors duration-300 ${
                  isCard2Active
                    ? 'text-[#00B36E] bg-[#00B36E]/10 border-[#00B36E]/25'
                    : 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/25'
                }`}>
                  02 / INTELLIGENCE
                </span>
                <span className={`text-[11px] sm:text-xs font-medium hidden xs:inline transition-colors duration-300 ${
                  isCard2Active ? 'text-[#718096]' : 'text-[#97A3B6]'
                }`}>
                  Signal Synthesis
                </span>
              </div>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-colors duration-300 shrink-0 ${
                isCard2Active
                  ? 'bg-[#FAFBF9] border-[#00B36E]/20 text-[#00B36E]'
                  : 'bg-[#1A2230] border-[#2D333E] text-[#2DD4BF]'
              }`}>
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Living Visual Canvas Area */}
            <div className="relative w-full h-60 xs:h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden border shadow-inner my-2 bg-[#0E131B] border-[#2D333E]">
              <IntentEmergenceCanvas isHovered={true} isActive={isCard2Active} />
            </div>

            {/* Editorial Content */}
            <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t transition-colors duration-300 ${
              isCard2Active ? 'border-[#14261C]/8' : 'border-[#2D333E]'
            }`}>
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className={`font-editorial text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300 ${
                    isCard2Active ? 'text-[#14261C]' : 'text-white'
                  }`}>
                    Intent Emerges
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold tracking-wide mt-1 transition-colors duration-300 ${
                    isCard2Active ? 'text-[#00B36E]' : 'text-[#2DD4BF]'
                  }`}>
                    Know who is ready.
                  </p>
                </div>
                <a
                  href="#hero"
                  aria-label="Intent Emergence details"
                  onClick={(e) => e.stopPropagation()}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm ${
                    isCard2Active
                      ? 'bg-[#14261C] text-white hover:bg-[#00B36E]'
                      : 'bg-[#242D3C] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0B0E14]'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>

              <p className={`mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed font-sans transition-colors duration-300 ${
                isCard2Active ? 'text-[#4A5568]' : 'text-[#97A3B6]'
              }`}>
                AI reads signals across conversations and behaviour to reveal true buying intent from the background noise.
              </p>

              {/* Bottom Control Pills - Mobile First Layout */}
              <div className={`mt-4 sm:mt-5 pt-3 sm:pt-4 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 sm:gap-3 border-t transition-colors duration-300 ${
                isCard2Active ? 'border-[#14261C]/6' : 'border-[#2D333E]'
              }`}>
                <div className={`inline-flex items-center justify-between xs:justify-start p-0.5 sm:p-1 rounded-xl border text-[11px] sm:text-xs font-semibold overflow-x-auto scrollbar-none transition-colors duration-300 ${
                  isCard2Active ? 'bg-[#EDF2F7] border-black/5 text-[#4A5568]' : 'bg-[#1A2230] border-[#2D333E] text-[#97A3B6]'
                }`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveIntentFilter('ready'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      activeIntentFilter === 'ready'
                        ? isCard2Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard2Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    Ready Now
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveIntentFilter('all'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      activeIntentFilter === 'all'
                        ? isCard2Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard2Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    High Affinity
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveIntentFilter('nurture'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      activeIntentFilter === 'nurture'
                        ? isCard2Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard2Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    Nurture
                  </button>
                </div>

                <button
                  onClick={(e) => handleCopyLink('card-02', e)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all shadow-sm shrink-0 w-full xs:w-auto ${
                    isCard2Active
                      ? 'bg-white text-[#2D3748] border-[#14261C]/10 hover:border-[#00B36E]'
                      : 'bg-[#1A2230] text-[#E5EAF3] border-[#2D333E] hover:border-[#2DD4BF]'
                  }`}
                >
                  {copiedCard === 'card-02' ? <Check className="w-3.5 h-3.5 text-[#00B36E]" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedCard === 'card-02' ? 'Saved' : 'Share Signal'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 03: THE NEXT STEP                                         */}
          {/* ============================================================== */}
          <div
            onClick={() => setActiveCardIndex(2)}
            onMouseEnter={() => setActiveCardIndex(2)}
            className={`relative rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-7 md:p-8 transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-pointer border select-none ${
              isCard3Active
                ? 'bg-white text-[#2D3436] border-[#00B36E]/40 shadow-[0_20px_50px_rgba(0,179,110,0.14)] scale-[1.01]'
                : 'bg-[#151A23]/95 text-[#E5EAF3] border-[#2D333E] shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-[#2DD4BF]/40'
            }`}
          >
            {/* Corner Tick Marks ⌜ ⌝ ⌞ ⌟ */}
            <div className={`absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-l-2 pointer-events-none transition-colors duration-300 ${isCard3Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-r-2 pointer-events-none transition-colors duration-300 ${isCard3Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-l-2 pointer-events-none transition-colors duration-300 ${isCard3Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-r-2 pointer-events-none transition-colors duration-300 ${isCard3Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />

            {/* Top Indicator */}
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-colors duration-300 ${
                  isCard3Active
                    ? 'text-[#00B36E] bg-[#00B36E]/10 border-[#00B36E]/25'
                    : 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/25'
                }`}>
                  03 / COORDINATION
                </span>
                <span className={`text-[11px] sm:text-xs font-medium hidden xs:inline transition-colors duration-300 ${
                  isCard3Active ? 'text-[#718096]' : 'text-[#97A3B6]'
                }`}>
                  Harmonic Ribbon Paths
                </span>
              </div>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-colors duration-300 shrink-0 ${
                isCard3Active
                  ? 'bg-[#FAFBF9] border-[#00B36E]/20 text-[#00B36E]'
                  : 'bg-[#1A2230] border-[#2D333E] text-[#2DD4BF]'
              }`}>
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Living Visual Canvas Area */}
            <div className="relative w-full h-60 xs:h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden border shadow-inner my-2 bg-[#0E131B] border-[#2D333E]">
              <NextStepRibbonsCanvas isHovered={true} mode={nextStepMode} isActive={isCard3Active} />
            </div>

            {/* Editorial Content */}
            <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t transition-colors duration-300 ${
              isCard3Active ? 'border-[#14261C]/8' : 'border-[#2D333E]'
            }`}>
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className={`font-editorial text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300 ${
                    isCard3Active ? 'text-[#14261C]' : 'text-white'
                  }`}>
                    The Next Step
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold tracking-wide mt-1 transition-colors duration-300 ${
                    isCard3Active ? 'text-[#00B36E]' : 'text-[#2DD4BF]'
                  }`}>
                    Every lead gets a next move.
                  </p>
                </div>
                <a
                  href="#hero"
                  aria-label="The Next Step details"
                  onClick={(e) => e.stopPropagation()}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm ${
                    isCard3Active
                      ? 'bg-[#14261C] text-white hover:bg-[#00B36E]'
                      : 'bg-[#242D3C] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0B0E14]'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>

              <p className={`mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed font-sans transition-colors duration-300 ${
                isCard3Active ? 'text-[#4A5568]' : 'text-[#97A3B6]'
              }`}>
                Know who to contact, when to follow up and what happens next with automated contextual intelligence.
              </p>

              {/* Bottom Control Pills - Mobile First Layout */}
              <div className={`mt-4 sm:mt-5 pt-3 sm:pt-4 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 sm:gap-3 border-t transition-colors duration-300 ${
                isCard3Active ? 'border-[#14261C]/6' : 'border-[#2D333E]'
              }`}>
                <div className={`inline-flex items-center justify-between xs:justify-start p-0.5 sm:p-1 rounded-xl border text-[11px] sm:text-xs font-semibold overflow-x-auto scrollbar-none transition-colors duration-300 ${
                  isCard3Active ? 'bg-[#EDF2F7] border-black/5 text-[#4A5568]' : 'bg-[#1A2230] border-[#2D333E] text-[#97A3B6]'
                }`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setNextStepMode('auto'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      nextStepMode === 'auto'
                        ? isCard3Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard3Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    Auto-Followup
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setNextStepMode('vip'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      nextStepMode === 'vip'
                        ? isCard3Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard3Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    VIP Alert
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setNextStepMode('calendar'); }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      nextStepMode === 'calendar'
                        ? isCard3Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard3Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    Calendar Sync
                  </button>
                </div>

                <button
                  onClick={(e) => handleCopyLink('card-03', e)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all shadow-sm shrink-0 w-full xs:w-auto ${
                    isCard3Active
                      ? 'bg-white text-[#2D3748] border-[#14261C]/10 hover:border-[#00B36E]'
                      : 'bg-[#1A2230] text-[#E5EAF3] border-[#2D333E] hover:border-[#2DD4BF]'
                  }`}
                >
                  {copiedCard === 'card-03' ? <Check className="w-3.5 h-3.5 text-[#00B36E]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCard === 'card-03' ? 'Copied' : 'Copy Route'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 04: MOMENTUM (Photorealistic Botanical Life Cycle)          */}
          {/* ============================================================== */}
          <div
            onClick={() => setActiveCardIndex(3)}
            onMouseEnter={() => setActiveCardIndex(3)}
            className={`relative rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-7 md:p-8 transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-pointer border select-none ${
              isCard4Active
                ? 'bg-white text-[#2D3436] border-[#00B36E]/40 shadow-[0_20px_50px_rgba(0,179,110,0.14)] scale-[1.01]'
                : 'bg-[#151A23]/95 text-[#E5EAF3] border-[#2D333E] shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-[#2DD4BF]/40'
            }`}
          >
            {/* Corner Tick Marks ⌜ ⌝ ⌞ ⌟ */}
            <div className={`absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-l-2 pointer-events-none transition-colors duration-300 ${isCard4Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-r-2 pointer-events-none transition-colors duration-300 ${isCard4Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-l-2 pointer-events-none transition-colors duration-300 ${isCard4Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />
            <div className={`absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-r-2 pointer-events-none transition-colors duration-300 ${isCard4Active ? 'border-[#00B36E]/50' : 'border-[#2DD4BF]/30'}`} />

            {/* Top Indicator */}
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-colors duration-300 ${
                  isCard4Active
                    ? 'text-[#00B36E] bg-[#00B36E]/10 border-[#00B36E]/25'
                    : 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/25'
                }`}>
                  04 / MOMENTUM
                </span>
                <span className={`text-[11px] sm:text-xs font-medium hidden xs:inline transition-colors duration-300 ${
                  isCard4Active ? 'text-[#718096]' : 'text-[#97A3B6]'
                }`}>
                  Kinetic Momentum Pendulum
                </span>
              </div>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-colors duration-300 shrink-0 ${
                isCard4Active
                  ? 'bg-[#FAFBF9] border-[#00B36E]/20 text-[#00B36E]'
                  : 'bg-[#1A2230] border-[#2D333E] text-[#2DD4BF]'
              }`}>
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Living Visual Canvas Area */}
            <div className="relative w-full h-64 xs:h-68 sm:h-76 md:h-84 rounded-xl sm:rounded-2xl overflow-hidden border shadow-inner my-2 bg-[#020503] border-[#1E293B]">
              <MomentumPendulumCanvas isHovered={isCard4Active} isActive={isCard4Active} externalAction={momentumAction} />
            </div>

            {/* Editorial Content */}
            <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t transition-colors duration-300 ${
              isCard4Active ? 'border-[#14261C]/8' : 'border-[#2D333E]'
            }`}>
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className={`font-editorial text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300 ${
                    isCard4Active ? 'text-[#14261C]' : 'text-white'
                  }`}>
                    Momentum
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold tracking-wide mt-1 transition-colors duration-300 ${
                    isCard4Active ? 'text-[#00B36E]' : 'text-[#2DD4BF]'
                  }`}>
                    Keep every opportunity moving.
                  </p>
                </div>
                <a
                  href="#hero"
                  aria-label="Momentum details"
                  onClick={(e) => e.stopPropagation()}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm ${
                    isCard4Active
                      ? 'bg-[#14261C] text-white hover:bg-[#00B36E]'
                      : 'bg-[#242D3C] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0B0E14]'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>

              <p className={`mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed font-sans transition-colors duration-300 ${
                isCard4Active ? 'text-[#4A5568]' : 'text-[#97A3B6]'
              }`}>
                Prioritize the right leads, trigger the right action and keep conversations moving from inquiry to private site visit.
              </p>

              {/* Bottom Control Pills - Mobile First Layout */}
              <div className={`mt-4 sm:mt-5 pt-3 sm:pt-4 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 sm:gap-3 border-t transition-colors duration-300 ${
                isCard4Active ? 'border-[#14261C]/6' : 'border-[#2D333E]'
              }`}>
                <div className={`inline-flex items-center justify-between xs:justify-start p-0.5 sm:p-1 rounded-xl border text-[11px] sm:text-xs font-semibold overflow-x-auto scrollbar-none transition-colors duration-300 ${
                  isCard4Active ? 'bg-[#EDF2F7] border-black/5 text-[#4A5568]' : 'bg-[#1A2230] border-[#2D333E] text-[#97A3B6]'
                }`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMomentumAction('left'); }}
                    title="Fire left pendulum ball (01 · Capture)"
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      momentumAction === 'left'
                        ? isCard4Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard4Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    ⚡ Swing Left
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMomentumAction('wave'); }}
                    title="Trigger kinetic light wave across middle balls"
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      momentumAction === 'wave'
                        ? isCard4Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard4Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    ⚡ Light Wave
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMomentumAction('right'); }}
                    title="Fire right pendulum ball (04 · Convert)"
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      momentumAction === 'right'
                        ? isCard4Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard4Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    ⚡ Swing Right
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMomentumAction('auto'); }}
                    title="Continuous Newton's Cradle cycle"
                    className={`px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                      momentumAction === 'auto'
                        ? isCard4Active
                          ? 'bg-white text-[#14261C] shadow-sm font-bold'
                          : 'bg-[#2DD4BF]/20 text-[#2DD4BF] shadow-sm font-bold'
                        : isCard4Active
                        ? 'hover:text-[#14261C]'
                        : 'hover:text-white'
                    }`}
                  >
                    ↺ Auto Flow
                  </button>
                </div>

                <button
                  onClick={(e) => handleCopyLink('card-04', e)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all shadow-sm shrink-0 w-full xs:w-auto ${
                    isCard4Active
                      ? 'bg-white text-[#2D3748] border-[#14261C]/10 hover:border-[#00B36E]'
                      : 'bg-[#1A2230] text-[#E5EAF3] border-[#2D333E] hover:border-[#2DD4BF]'
                  }`}
                >
                  {copiedCard === 'card-04' ? <Check className="w-3.5 h-3.5 text-[#00B36E]" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedCard === 'card-04' ? 'Copied' : 'Share Tour'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Section Footer Editorial Quote */}
        <div className="mt-20 sm:mt-24 text-center">
          <p className="text-sm sm:text-base font-medium text-[#14261C]/70 tracking-wide bg-white/70 backdrop-blur-md px-6 py-3 rounded-full border border-[#14261C]/10 inline-block shadow-sm">
            &ldquo;Many scattered signals become one flow, intent becomes visible, the next action becomes clear, and opportunities gain momentum.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
