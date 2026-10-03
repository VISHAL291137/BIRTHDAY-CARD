import React, { useEffect, useRef } from 'react';

interface FallingRosesCanvasProps {
  intensity?: 'gentle' | 'vibrant';
}

interface PetalOrRose {
  x: number;
  y: number;
  size: number;
  fallSpeed: number;
  swaySpeed: number;
  swayAngle: number;
  swayRadius: number;
  rotation: number;
  rotSpeed: number;
  flipAngle: number;
  flipSpeed: number;
  type: 'rose' | 'petal' | 'bud';
  color: string;
  innerColor: string;
  opacity: number;
}

// Deep Red ("Laal") Rose & Crimson Palette
const LAAL_ROSE_PALETTE = [
  { main: '#be123c', inner: '#881337' }, // Deep Crimson Velvet
  { main: '#e11d48', inner: '#9f1239' }, // Ruby Rose
  { main: '#dc2626', inner: '#991b1b' }, // Classic Laal Red
  { main: '#b91c1c', inner: '#7f1d1d' }, // Burgundy Red
  { main: '#f43f5e', inner: '#be123c' }, // Vibrant Rosebud Red
  { main: '#ef4444', inner: '#b91c1c' }, // Bright Scarlet Rose
];

export const FallingRosesCanvas: React.FC<FallingRosesCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const itemCount = Math.min(50, Math.floor(width / 24));
    const items: PetalOrRose[] = [];

    for (let i = 0; i < itemCount; i++) {
      const palette = LAAL_ROSE_PALETTE[Math.floor(Math.random() * LAAL_ROSE_PALETTE.length)];
      const randType = Math.random();
      const type: PetalOrRose['type'] = randType < 0.35 ? 'rose' : randType < 0.8 ? 'petal' : 'bud';
      const size = type === 'rose' ? Math.random() * 10 + 16 : Math.random() * 8 + 10;

      items.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        fallSpeed: Math.random() * 1.4 + 0.8,
        swaySpeed: Math.random() * 0.02 + 0.015,
        swayAngle: Math.random() * Math.PI * 2,
        swayRadius: Math.random() * 1.8 + 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 0.03 + 0.01,
        type,
        color: palette.main,
        innerColor: palette.inner,
        opacity: Math.random() * 0.35 + 0.65,
      });
    }

    const drawRoseFlower = (
      ctx: CanvasRenderingContext2D,
      size: number,
      mainColor: string,
      innerColor: string
    ) => {
      const r = size / 2;

      // 5 Outer Petals
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 * Math.PI) / 180;
        const px = Math.cos(angle) * (r * 0.55);
        const py = Math.sin(angle) * (r * 0.55);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.5, r * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4 Middle Petals
      for (let i = 0; i < 4; i++) {
        const angle = (i * 90 * Math.PI) / 180 + 0.4;
        const px = Math.cos(angle) * (r * 0.3);
        const py = Math.sin(angle) * (r * 0.3);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.fillStyle = innerColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.4, r * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Inner Swirl Core
      ctx.fillStyle = '#4c0519'; // deepest velvet core
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Highlight curl
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.15, 0, Math.PI * 1.3);
      ctx.stroke();
    };

    const drawPetal = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      const w = size * 0.65;
      const h = size;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      ctx.bezierCurveTo(w * 0.8, -h * 0.3, w * 0.9, h * 0.4, 0, h * 0.5);
      ctx.bezierCurveTo(-w * 0.9, h * 0.4, -w * 0.8, -h * 0.3, 0, -h * 0.5);
      ctx.closePath();
      ctx.fill();

      // Delicate center vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.4);
      ctx.lineTo(0, h * 0.35);
      ctx.stroke();
    };

    const drawBud = (ctx: CanvasRenderingContext2D, size: number, color: string, innerColor: string) => {
      const r = size * 0.4;
      // Calyx green leaf base
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.8, r * 0.3, r * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Red bud petals
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(-r * 0.25, 0, r * 0.5, r * 0.8, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = innerColor;
      ctx.beginPath();
      ctx.ellipse(r * 0.25, 0, r * 0.5, r * 0.8, 0.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        item.swayAngle += item.swaySpeed;
        item.rotation += item.rotSpeed;
        item.flipAngle += item.flipSpeed;

        item.x += Math.sin(item.swayAngle) * item.swayRadius;
        item.y += item.fallSpeed;

        // Reset if drifted past bottom or sides
        if (item.y > height + 40) {
          item.y = -30;
          item.x = Math.random() * width;
        }
        if (item.x < -40) item.x = width + 30;
        if (item.x > width + 40) item.x = -30;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        // 3D flutter effect using scale
        const scaleX = Math.cos(item.flipAngle);
        ctx.scale(Math.abs(scaleX) > 0.15 ? scaleX : 0.15, 1);
        ctx.globalAlpha = item.opacity;

        if (item.type === 'rose') {
          drawRoseFlower(ctx, item.size, item.color, item.innerColor);
        } else if (item.type === 'bud') {
          drawBud(ctx, item.size, item.color, item.innerColor);
        } else {
          drawPetal(ctx, item.size, item.color);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
};
