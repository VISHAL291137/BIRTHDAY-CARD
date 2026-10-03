import React, { useEffect, useRef } from 'react';
import { ThemeId } from '../types/card';

interface ConfettiCanvasProps {
  theme: ThemeId;
  triggerCount?: number;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ theme, triggerCount = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    vRot: number;
    shape: 'rect' | 'circle' | 'pixel' | 'petal' | 'star' | 'ribbon';
    opacity: number;
    drag: number;
    gravity: number;
    life: number;
    maxLife: number;
  }

  // Color palettes per theme
  const getThemeColors = () => {
    switch (theme) {
      case 'arcade':
        return ['#ff0055', '#00ffcc', '#ffff00', '#ff00ff', '#00ff00', '#ffffff', '#ff9900'];
      case 'romantic':
        return ['#dc2626', '#b91c1c', '#991b1b', '#be123c', '#881337', '#e11d48', '#f43f5e', '#fda4af', '#fff1f2'];
      case 'cyberpunk':
        return ['#00f0ff', '#ff007f', '#7000ff', '#39ff14', '#00ffff', '#ffe600'];
      case 'galaxy':
        return ['#818cf8', '#c084fc', '#e879f9', '#38bdf8', '#f472b6', '#ffffff', '#a855f7'];
      case 'pastel':
        return ['#fef08a', '#bbf7d0', '#fbcfe8', '#bfdbfe', '#fed7aa', '#e9d5ff', '#f472b6'];
      case 'luxury':
        return ['#fbbf24', '#f59e0b', '#d97706', '#fef3c7', '#ffffff', '#e5e7eb', '#fef08a'];
      default:
        return ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#00f0ff'];
    }
  };

  const fireConfettiCannon = (width: number, height: number) => {
    const colors = getThemeColors();
    const newParticles: Particle[] = [];

    // Left Cannon Blast (Firing upwards & right ~60 degrees)
    const leftX = width * 0.05;
    const leftY = height * 0.95;
    for (let i = 0; i < 90; i++) {
      const angle = (Math.random() * 40 + 35) * (Math.PI / 180); // 35° - 75°
      const speed = Math.random() * 18 + 12;
      const vx = Math.cos(angle) * speed;
      const vy = -Math.sin(angle) * speed;

      let shape: Particle['shape'] = 'rect';
      if (theme === 'arcade') shape = 'pixel';
      else if (theme === 'romantic') shape = Math.random() > 0.4 ? 'petal' : 'circle';
      else if (theme === 'galaxy' || theme === 'luxury') shape = Math.random() > 0.5 ? 'star' : 'rect';

      newParticles.push({
        x: leftX,
        y: leftY,
        vx,
        vy,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape,
        opacity: 1,
        drag: 0.965,
        gravity: 0.28,
        life: 0,
        maxLife: Math.random() * 120 + 160,
      });
    }

    // Right Cannon Blast (Firing upwards & left ~120 degrees)
    const rightX = width * 0.95;
    const rightY = height * 0.95;
    for (let i = 0; i < 90; i++) {
      const angle = (Math.random() * 40 + 105) * (Math.PI / 180); // 105° - 145°
      const speed = Math.random() * 18 + 12;
      const vx = Math.cos(angle) * speed;
      const vy = -Math.sin(angle) * speed;

      let shape: Particle['shape'] = 'rect';
      if (theme === 'arcade') shape = 'pixel';
      else if (theme === 'romantic') shape = Math.random() > 0.4 ? 'petal' : 'circle';
      else if (theme === 'galaxy' || theme === 'luxury') shape = Math.random() > 0.5 ? 'star' : 'rect';

      newParticles.push({
        x: rightX,
        y: rightY,
        vx,
        vy,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape,
        opacity: 1,
        drag: 0.965,
        gravity: 0.28,
        life: 0,
        maxLife: Math.random() * 120 + 160,
      });
    }

    particlesRef.current.push(...newParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.life++;

        if (p.life > p.maxLife * 0.7) {
          p.opacity = Math.max(0, (p.maxLife - p.life) / (p.maxLife * 0.3));
        }

        if (p.life >= p.maxLife || p.opacity <= 0 || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'pixel') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(
              Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
              -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size
            );
            ctx.lineTo(
              Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2),
              -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2)
            );
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Trigger Cannon Blast whenever triggerCount changes
  useEffect(() => {
    if (canvasRef.current) {
      fireConfettiCannon(window.innerWidth, window.innerHeight);
    }
  }, [triggerCount]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
};
