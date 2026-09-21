'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

// ============================================================================
// SIMULATION 1: CAPTURE (Concentric Embossed Rings with Multichannel Streams)
// ============================================================================
function CaptureCanvas({ isHovered, isCardActive }: { isHovered: boolean; isCardActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 360;
    let height = 240;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 360;
      height = rect.height || 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    interface InflowParticle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      angle: number;
      dist: number;
      speed: number;
      size: number;
      alpha: number;
      color: string;
      channelName: string;
    }

    const channelColors = [
      '#FFB800', // Amber
      '#00B36E', // Emerald
      '#3B82F6', // Royal Blue
      '#2DD4BF', // Cyan
      '#F43F5E', // Rose
    ];

    const channels = ['Website', 'WhatsApp', 'Instagram', 'MLS', 'Calls'];

    const particles: InflowParticle[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      const chIdx = i % 5;
      const startAngle = (chIdx * (Math.PI * 2)) / 5 + (Math.random() - 0.5) * 0.4;
      const dist = 140 + Math.random() * 80;
      const cx = width / 2;
      const cy = height / 2;

      particles.push({
        x: cx + Math.cos(startAngle) * dist,
        y: cy + Math.sin(startAngle) * dist,
        originX: cx + Math.cos(startAngle) * dist,
        originY: cy + Math.sin(startAngle) * dist,
        angle: startAngle,
        dist: dist,
        speed: 0.9 + Math.random() * 1.4,
        size: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        color: channelColors[chIdx],
        channelName: channels[chIdx],
      });
    }

    let t = 0;

    const render = () => {
      t += 0.02;
      const cx = width / 2;
      const cy = height / 2;

      // Card theme background
      ctx.fillStyle = isCardActive ? '#ECEEF2' : '#0F141C';
      ctx.fillRect(0, 0, width, height);

      // --- 1. EMBOSSED SCULPTURE GROOVES (Matching User Reference Image) ---
      const rOuter = 58;
      const rInner = 38;

      // Groove base (deep inset shadow)
      ctx.lineWidth = 10;
      ctx.strokeStyle = isCardActive ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineCap = 'round';

      // Outer groove arc
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, 0.3, Math.PI * 1.85);
      ctx.stroke();

      // Inner groove arc
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, Math.PI * 0.7, Math.PI * 2.3);
      ctx.stroke();

      // Groove highlight rim
      ctx.lineWidth = 2;
      ctx.strokeStyle = isCardActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter + 4, 0.3, Math.PI * 1.85);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, rInner + 4, Math.PI * 0.7, Math.PI * 2.3);
      ctx.stroke();

      // --- 2. INTENSE GLOWING LIGHT TUBES INSIDE CHANNELS ---
      const pulseSpeed = isHovered ? 2.5 : 1.2;
      const lightRot = t * pulseSpeed;

      // Outer light tube
      ctx.save();
      ctx.shadowColor = isCardActive ? '#F59E0B' : '#2DD4BF';
      ctx.shadowBlur = isHovered ? 22 : 14;
      ctx.lineWidth = 6;
      ctx.strokeStyle = isCardActive ? '#FBBF24' : '#2DD4BF';
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, lightRot, lightRot + Math.PI * 0.9);
      ctx.stroke();

      // Inner light tube (reverse swirl)
      ctx.shadowColor = isCardActive ? '#D97706' : '#00B36E';
      ctx.shadowBlur = isHovered ? 20 : 12;
      ctx.lineWidth = 5;
      ctx.strokeStyle = isCardActive ? '#FDE68A' : '#5EEAD4';
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, -lightRot * 1.4, -lightRot * 1.4 + Math.PI * 0.8);
      ctx.stroke();
      ctx.restore();

      // --- 3. INFLOWING MULTICHANNEL PARTICLES ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const currentSpeed = isHovered ? p.speed * 1.8 : p.speed;
        p.dist -= currentSpeed;
        p.angle += 0.015;

        if (p.dist < rInner - 8) {
          p.dist = 140 + Math.random() * 50;
        }

        p.x = cx + Math.cos(p.angle) * p.dist;
        p.y = cy + Math.sin(p.angle) * p.dist;

        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - p.x;
          const mdy = mouseRef.current.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 80) {
            p.x += (mdx / mDist) * 1.5;
            p.y += (mdy / mDist) * 1.5;
          }
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isHovered, isCardActive]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover select-none" />;
}

// ============================================================================
// SIMULATION 2: UNDERSTAND (Triangular Organic Field with Cold-to-Warm Intent)
// ============================================================================
function UnderstandCanvas({ isHovered, isCardActive }: { isHovered: boolean; isCardActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 360;
    let height = 240;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 360;
      height = rect.height || 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    interface IntentParticle {
      x: number;
      y: number;
      vy: number;
      vx: number;
      size: number;
      state: 'cold' | 'warm' | 'high_intent';
      color: string;
      alpha: number;
      targetLane: number;
    }

    const particles: IntentParticle[] = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const rnd = Math.random();
      const lane = rnd > 0.65 ? 2 : rnd > 0.3 ? 1 : 0;
      particles.push({
        x: width * 0.35 + Math.random() * (width * 0.3),
        y: Math.random() * height,
        vy: 0.8 + Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1.4,
        state: 'cold',
        color: '#94A3B8',
        alpha: Math.random() * 0.6 + 0.3,
        targetLane: lane,
      });
    }

    let t = 0;

    const render = () => {
      t += 0.02;
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = isCardActive ? '#ECEEF2' : '#0F141C';
      ctx.fillRect(0, 0, width, height);

      const topY = cy - 65;
      const botY = cy + 60;
      const leftX = cx - 65;
      const rightX = cx + 65;

      ctx.lineWidth = 10;
      ctx.strokeStyle = isCardActive ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, topY);
      ctx.lineTo(rightX, botY);
      ctx.lineTo(leftX, botY);
      ctx.closePath();
      ctx.stroke();

      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, topY + 28);
      ctx.lineTo(rightX - 22, botY - 12);
      ctx.lineTo(leftX + 22, botY - 12);
      ctx.closePath();
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isCardActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(cx, topY - 3);
      ctx.lineTo(rightX + 3, botY + 3);
      ctx.lineTo(leftX - 3, botY + 3);
      ctx.closePath();
      ctx.stroke();

      ctx.save();
      ctx.shadowColor = isCardActive ? '#F59E0B' : '#3B82F6';
      ctx.shadowBlur = isHovered ? 24 : 14;
      ctx.lineWidth = 5;
      ctx.strokeStyle = isCardActive ? '#FBBF24' : '#60A5FA';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const phase = (t * (isHovered ? 1.8 : 0.9)) % 3;
      ctx.beginPath();
      if (phase < 1) {
        ctx.moveTo(cx, topY);
        ctx.lineTo(cx + (rightX - cx) * phase, topY + (botY - topY) * phase);
      } else if (phase < 2) {
        const p2 = phase - 1;
        ctx.moveTo(rightX, botY);
        ctx.lineTo(rightX - (rightX - leftX) * p2, botY);
      } else {
        const p3 = phase - 2;
        ctx.moveTo(leftX, botY);
        ctx.lineTo(leftX + (cx - leftX) * p3, botY - (botY - topY) * p3);
      }
      ctx.stroke();
      ctx.restore();

      const fieldMidY = cy;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += isHovered ? p.vy * 1.7 : p.vy;
        p.x += p.vx;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = cx + (Math.random() - 0.5) * 60;
          p.state = 'cold';
          p.color = '#94A3B8';
        }

        if (p.y > fieldMidY && p.state === 'cold') {
          if (p.targetLane === 2) {
            p.state = 'high_intent';
            p.color = isCardActive ? '#D97706' : '#FFB800';
            p.size = 3.2;
            p.vx = 0.5;
          } else if (p.targetLane === 1) {
            p.state = 'warm';
            p.color = isCardActive ? '#00B36E' : '#2DD4BF';
            p.size = 2.4;
            p.vx = 0;
          } else {
            p.state = 'cold';
            p.color = isCardActive ? '#64748B' : '#475569';
            p.size = 1.4;
            p.vx = -0.4;
          }
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.state === 'high_intent' ? 12 : p.state === 'warm' ? 8 : 2;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.font = '9px monospace';
      ctx.fillStyle = isCardActive ? 'rgba(0, 179, 110, 0.8)' : 'rgba(45, 212, 191, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText('INTENT FIELD', cx, cy + 8);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isHovered, isCardActive]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover select-none" />;
}

// ============================================================================
// SIMULATION 3: ACT (Continuous Diamond Pipeline Routing High-Intent Lead)
// ============================================================================
function ActCanvas({ isHovered, isCardActive }: { isHovered: boolean; isCardActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 360;
    let height = 240;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 360;
      height = rect.height || 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let t = 0;

    const render = () => {
      t += isHovered ? 0.035 : 0.018;
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = isCardActive ? '#ECEEF2' : '#0F141C';
      ctx.fillRect(0, 0, width, height);

      const diamondRadius = 55;
      const innerRadius = 35;

      const nodes = [
        { x: cx, y: cy - diamondRadius, label: 'LEAD' },
        { x: cx + diamondRadius, y: cy, label: 'WHATSAPP' },
        { x: cx, y: cy + diamondRadius, label: 'DISPATCH' },
        { x: cx - diamondRadius, y: cy, label: 'TOUR' },
      ];

      ctx.lineWidth = 10;
      ctx.strokeStyle = isCardActive ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[1].x, nodes[1].y);
      ctx.lineTo(nodes[2].x, nodes[2].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.closePath();
      ctx.stroke();

      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy - innerRadius);
      ctx.lineTo(cx + innerRadius, cy);
      ctx.lineTo(cx, cy + innerRadius);
      ctx.lineTo(cx - innerRadius, cy);
      ctx.closePath();
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isCardActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y - 3);
      ctx.lineTo(nodes[1].x + 3, nodes[1].y);
      ctx.lineTo(nodes[2].x, nodes[2].y + 3);
      ctx.lineTo(nodes[3].x - 3, nodes[3].y);
      ctx.closePath();
      ctx.stroke();

      nodes.forEach((n, idx) => {
        ctx.save();
        ctx.fillStyle = isCardActive ? '#FFFFFF' : '#1E293B';
        ctx.strokeStyle = isCardActive ? '#00B36E' : '#2DD4BF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = '8px monospace';
        ctx.fillStyle = isCardActive ? '#475569' : '#94A3B8';
        ctx.textAlign = 'center';
        const offY = idx === 0 ? -12 : idx === 2 ? 18 : 3;
        const offX = idx === 1 ? 26 : idx === 3 ? -24 : 0;
        ctx.fillText(n.label, n.x + offX, n.y + offY);
        ctx.restore();
      });

      const totalStages = 4;
      const currentPos = (t * 1.5) % totalStages;
      const stageIdx = Math.floor(currentPos);
      const stageFrac = currentPos - stageIdx;

      const fromNode = nodes[stageIdx];
      const toNode = nodes[(stageIdx + 1) % totalStages];

      const pulseX = fromNode.x + (toNode.x - fromNode.x) * stageFrac;
      const pulseY = fromNode.y + (toNode.y - fromNode.y) * stageFrac;

      ctx.save();
      ctx.shadowColor = isCardActive ? '#F59E0B' : '#00B36E';
      ctx.shadowBlur = isHovered ? 26 : 16;
      ctx.strokeStyle = isCardActive ? '#FBBF24' : '#2DD4BF';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(pulseX, pulseY);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const activeNode = fromNode;
      const rippleSize = (t * 20) % 24;
      ctx.save();
      ctx.strokeStyle = isCardActive ? 'rgba(245, 158, 11, ' + (1 - rippleSize / 24) + ')' : 'rgba(45, 212, 191, ' + (1 - rippleSize / 24) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(activeNode.x, activeNode.y, 6 + rippleSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isHovered, isCardActive]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover select-none" />;
}

// ============================================================================
// SIMULATION 4: CONVERT (Autonomous Deal Closing Vault & Transaction Ring)
// ============================================================================
function ConvertCanvas({ isHovered, isCardActive }: { isHovered: boolean; isCardActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 360;
    let height = 240;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 360;
      height = rect.height || 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const particleCount = 38;
    const particles = Array.from({ length: particleCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 20 + Math.random() * 70,
      speed: 0.02 + Math.random() * 0.025,
      size: 1.2 + Math.random() * 1.8,
      color: Math.random() > 0.4 ? '#FFB800' : '#00B36E',
      alpha: 0.4 + Math.random() * 0.6,
    }));

    let t = 0;

    const render = () => {
      t += 0.022;
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = isCardActive ? '#ECEEF2' : '#0F141C';
      ctx.fillRect(0, 0, width, height);

      const rOuter = 58;
      const rInner = 38;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
      ctx.strokeStyle = isCardActive ? 'rgba(0, 179, 110, 0.25)' : 'rgba(0, 212, 134, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
      ctx.strokeStyle = isCardActive ? 'rgba(255, 184, 0, 0.35)' : 'rgba(255, 215, 0, 0.22)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      const stages = [
        { label: 'OFFER', angle: t * 0.8 },
        { label: 'ESCROW', angle: t * 0.8 + (Math.PI * 2) / 3 },
        { label: 'CLOSED', angle: t * 0.8 + (Math.PI * 4) / 3 },
      ];

      stages.forEach((st) => {
        const nx = cx + Math.cos(st.angle) * rOuter;
        const ny = cy + Math.sin(st.angle) * rOuter;

        ctx.save();
        ctx.beginPath();
        ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isCardActive ? '#008751' : '#00E58F';
        ctx.shadowColor = '#00B36E';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.font = '8px monospace';
        ctx.fillStyle = isCardActive ? '#334155' : '#94A3B8';
        ctx.textAlign = 'center';
        ctx.fillText(st.label, nx, ny - 8);
        ctx.restore();
      });

      particles.forEach((p) => {
        p.angle += p.speed;
        p.dist -= 0.32;
        if (p.dist < 10) {
          p.dist = 65 + Math.random() * 25;
        }

        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * p.dist;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      const centerPulse = Math.sin(t * 3) * 2.5;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 18 + centerPulse, 0, Math.PI * 2);
      ctx.fillStyle = isCardActive ? 'rgba(0, 179, 110, 0.15)' : 'rgba(0, 179, 110, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = isCardActive ? '#008751' : '#00B36E';
      ctx.shadowColor = '#00B36E';
      ctx.shadowBlur = 14;
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 4.5, cy);
      ctx.lineTo(cx - 1, cy + 3.5);
      ctx.lineTo(cx + 5.5, cy - 3.5);
      ctx.stroke();

      ctx.font = 'bold 8.5px sans-serif';
      ctx.fillStyle = isCardActive ? '#008751' : '#FFD700';
      ctx.textAlign = 'center';
      ctx.fillText('$2.4M DEAL', cx, cy + 32);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isHovered, isCardActive]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover select-none" />;
}

// ============================================================================
// 3D TILT CARD COMPONENT WITH CURSOR LIGHTING & DUAL COLOR SHIFT
// ============================================================================
function TiltCard({
  card,
  isActive,
  onActivate,
}: {
  card: {
    id: string;
    step: string;
    title: string;
    subtitle: string;
    description: string;
    visualType: 'capture' | 'understand' | 'act' | 'convert';
    pills: string[];
    videoUrl?: string;
  };
  isActive: boolean;
  onActivate: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; gx: number; gy: number }>({
    rx: 0,
    ry: 0,
    gx: 50,
    gy: 50,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = ((y - cy) / cy) * -9;
    const ry = ((x - cx) / cx) * 9;

    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;

    setTilt({ rx, ry, gx, gy });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onActivate();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onActivate}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1}, 1)`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.45s ease-out, background-color 0.3s ease, border-color 0.3s ease',
      }}
      className={`relative rounded-[28px] p-5 sm:p-6 lg:p-7 flex flex-col justify-between cursor-pointer select-none border overflow-hidden ${
        isActive
          ? 'bg-white/95 text-[#14261C] border-[#00B36E]/40 shadow-[0_26px_65px_rgba(0,179,110,0.16),0_4px_16px_rgba(0,0,0,0.04)]'
          : 'bg-[#151A23]/92 text-[#F1F5F9] border-[#2D333E] shadow-[0_16px_40px_rgba(0,0,0,0.35)] hover:border-[#00B36E]/40'
      }`}
    >
      {/* Dynamic Specular Lighting Layer Following Cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: isActive
            ? `radial-gradient(circle 280px at ${tilt.gx}% ${tilt.gy}%, rgba(255, 255, 255, 0.5), transparent 70%)`
            : `radial-gradient(circle 280px at ${tilt.gx}% ${tilt.gy}%, rgba(45, 212, 191, 0.15), transparent 70%)`,
        }}
      />

      {/* Subtle Corner Tick Marks ⌜ ⌝ ⌞ ⌟ */}
      <div className={`absolute top-3 left-3 w-2.5 h-2.5 border-t border-l transition-colors duration-300 z-10 ${isActive ? 'border-[#00B36E]/60' : 'border-[#2DD4BF]/40'}`} />
      <div className={`absolute top-3 right-3 w-2.5 h-2.5 border-t border-r transition-colors duration-300 z-10 ${isActive ? 'border-[#00B36E]/60' : 'border-[#2DD4BF]/40'}`} />
      <div className={`absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l transition-colors duration-300 z-10 ${isActive ? 'border-[#00B36E]/60' : 'border-[#2DD4BF]/40'}`} />
      <div className={`absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r transition-colors duration-300 z-10 ${isActive ? 'border-[#00B36E]/60' : 'border-[#2DD4BF]/40'}`} />

      {/* -------------------------------------------------------- */}
      {/* TOP STAGE: HIGH-IMPACT LIVING VISUAL SIMULATION          */}
      {/* -------------------------------------------------------- */}
      <div
        className={`relative w-full aspect-[16/11] rounded-2xl overflow-hidden mb-6 border transition-colors duration-300 shadow-inner group z-10 ${
          isActive ? 'bg-[#ECEEF2] border-black/[0.08]' : 'bg-[#0F141C] border-[#2D333E]'
        }`}
      >
        {card.videoUrl ? (
          <video src={card.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : (
          <>
            {card.visualType === 'capture' && <CaptureCanvas isHovered={isHovered} isCardActive={isActive} />}
            {card.visualType === 'understand' && <UnderstandCanvas isHovered={isHovered} isCardActive={isActive} />}
            {card.visualType === 'act' && <ActCanvas isHovered={isHovered} isCardActive={isActive} />}
            {card.visualType === 'convert' && <ConvertCanvas isHovered={isHovered} isCardActive={isActive} />}
          </>
        )}
      </div>

      {/* -------------------------------------------------------- */}
      {/* BOTTOM CONTENT AREA (CRYSTAL CLEAR AAA CONTRAST)         */}
      {/* -------------------------------------------------------- */}
      <div className="flex flex-col flex-grow justify-between z-10">
        <div>
          {/* Step Tag */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border transition-colors ${
                isActive
                  ? 'text-[#008751] bg-[#00B36E]/10 border-[#00B36E]/25'
                  : 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/25'
              }`}
            >
              {card.step}
            </span>
          </div>

          {/* Title (High-Contrast Bold) */}
          <h3
            className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 transition-colors ${
              isActive ? 'text-[#0D1510]' : 'text-[#FFFFFF]'
            }`}
          >
            {card.title}
          </h3>

          {/* Subtitle */}
          <p
            className={`text-xs sm:text-sm font-bold mb-3 tracking-wide transition-colors ${
              isActive ? 'text-[#008751]' : 'text-[#2DD4BF]'
            }`}
          >
            {card.subtitle}
          </p>

          {/* Narrative Description (High Contrast) */}
          <p
            className={`text-xs sm:text-[13px] leading-relaxed transition-colors font-medium ${
              isActive ? 'text-[#334155]' : 'text-[#CBD5E1]'
            }`}
          >
            {card.description}
          </p>
        </div>

        {/* Channel & Pipeline Pills */}
        <div
          className={`pt-3.5 border-t flex flex-wrap gap-1.5 transition-colors ${
            isActive ? 'border-black/[0.08]' : 'border-white/[0.08]'
          }`}
        >
          {card.pills.map((pill, idx) => (
            <span
              key={idx}
              className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                isActive
                  ? 'bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1]'
                  : 'bg-[#1E293B] text-[#E2E8F0] border-[#334155]'
              }`}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN ACT IV VIDEO BACKGROUND SECTION (SCOPED STRICTLY TO SECTION 4)
// ============================================================================
export default function VideoBackgroundSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCardId, setActiveCardId] = useState<string>('act-01');

  const cards = [
    {
      id: 'act-01',
      step: '01 — CAPTURE',
      title: 'Capture',
      subtitle: 'Every conversation starts somewhere.',
      description:
        'Different streams of lead signals from your website, WhatsApp, Instagram, property portals, and inbound calls converge seamlessly into one unified Terraflow stream.',
      visualType: 'capture' as const,
      pills: ['Website', 'WhatsApp', 'MLS Portals', 'Direct Calls'],
    },
    {
      id: 'act-02',
      step: '02 — UNDERSTAND',
      title: 'Understand',
      subtitle: 'AI turns signals into intent.',
      description:
        'As leads stream through the organic intelligence field, individual signals dynamically evolve—cold to warm to high-intent—visually qualifying buyer readiness in real time.',
      visualType: 'understand' as const,
      pills: ['Signal Scoring', 'Cold → Warm', 'High Intent', 'Instant Match'],
    },
    {
      id: 'act-03',
      step: '03 — ACT',
      title: 'Act',
      subtitle: 'The next action happens automatically.',
      description:
        'High-intent leads immediately glide down an automated pipeline: instant WhatsApp replies, bespoke follow-ups, sales agent dispatch, and scheduled VIP site visits.',
      visualType: 'act' as const,
      pills: ['Instant WhatsApp', 'Agent Dispatch', 'VIP Site Visit'],
    },
    {
      id: 'act-04',
      step: '04 — CONVERT',
      title: 'Convert',
      subtitle: 'Turning momentum into signed contracts.',
      description:
        'High-intent conversations seamlessly turn into signed broker agreements, verified escrows, and realized commissions — closing the loop completely.',
      visualType: 'convert' as const,
      pills: ['Contract Signed', 'Escrow Sync', 'Commission Realized'],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="automation-architecture"
      aria-label="Act IV: 4 Moments of Automation"
      className="relative z-10 w-full min-h-screen py-24 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-10 overflow-hidden bg-white font-sans flex flex-col justify-center items-center"
    >

      {/* ------------------------------------------------------------------ */}
      {/* 2. FOREGROUND CONTENT & ANIMATED INTERFACE (z-index: 10)           */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center relative z-10">
        
        {/* ============================================================== */}
        {/* SECTION HEADING (NO CARD CONTAINER — BLENDED CINEMATIC REVEAL)  */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center max-w-3xl mx-auto mb-14 sm:mb-20"
        >
          {/* Luminous Atmospheric Halo directly behind text — no box/card edge */}
          <div
            className="absolute -top-16 inset-x-0 h-80 pointer-events-none -z-1"
            style={{
              background:
                'radial-gradient(ellipse 80% 65% at 50% 45%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.72) 50%, transparent 85%)',
            }}
          />

          {/* Eyebrow Stage Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#00B36E]/30 text-[#008751] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00B36E]" aria-hidden="true" />
            <span>ACT IV / ARCHITECTURE</span>
          </div>

          {/* Semantic Headline directly on scene with soft typographic depth */}
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#0A1610] leading-[1.12] tracking-tight font-normal drop-shadow-[0_2px_24px_rgba(255,255,255,1)]">
            4 Moments of{' '}
            <span className="italic font-normal text-[#008751] drop-shadow-[0_2px_24px_rgba(255,255,255,1)]">
              Autonomous Intelligence.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#2A3B30] font-sans font-medium leading-relaxed max-w-xl mx-auto drop-shadow-[0_1px_16px_rgba(255,255,255,0.95)]">
            Autonomous AI agents that qualify buyer intent, follow up across channels 24/7, and book verified site tours into your pipeline.
          </p>
        </motion.div>

        {/* ============================================================== */}
        {/* 4 FLOATING 3D TILT CARDS (STAGGERED BLUR & POP-UP ENTRANCE)    */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full max-w-7xl mx-auto">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard
                card={card}
                isActive={activeCardId === card.id}
                onActivate={() => setActiveCardId(card.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 sm:mt-18 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-black/[0.06] text-xs font-semibold text-[#1E293B] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B36E] animate-pulse" />
            <span>Continuous Autonomous Intelligence — 24/7 Multi-Channel Conversion</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
