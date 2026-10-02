import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface ScratchCardProps {
  secretText?: string;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  secretText = '🎟️ SPECIAL VOUCHER: 1x Homemade Dinner + Unlimited Desserts of Your Choice!',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw silver glitter foil
    const width = (canvas.width = 280);
    const height = (canvas.height = 100);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1, '#64748b');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add silver noise texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }

    // Overlay Scratch Prompt Text
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE TO REVEAL ✨', width / 2, height / 2 + 4);
  }, []);

  const handleScratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    soundEngine.playScratchSound();

    // Check clear percentage periodically
    checkScratched(ctx, canvas.width, canvas.height);
  };

  const checkScratched = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      let transparentPixels = 0;
      for (let i = 3; i < imgData.data.length; i += 16) {
        if (imgData.data[i] === 0) {
          transparentPixels++;
        }
      }
      const totalSampled = imgData.data.length / 16;
      const pct = Math.round((transparentPixels / totalSampled) * 100);
      setScratchedPercent(pct);

      if (pct > 40 && !isRevealed) {
        setIsRevealed(true);
        soundEngine.playUnboxChime();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 p-5 bg-slate-900/70 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl text-center">
      <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center justify-center gap-1.5">
        <Sparkles className="h-4 w-4 text-cyan-400" />
        <span>Scratch & Win Fortune Ticket</span>
      </h3>

      <div className="relative inline-block my-2 overflow-hidden rounded-xl border-2 border-slate-700 shadow-2xl bg-slate-950">
        {/* Underneath Secret Text */}
        <div className="flex h-[100px] w-[280px] items-center justify-center p-3 text-center bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-cyan-200 font-semibold text-xs leading-relaxed border border-cyan-500/30">
          {secretText}
        </div>

        {/* Scratchable Canvas Overlay */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-crosshair touch-none"
            onMouseMove={(e) => {
              if (e.buttons === 1) handleScratch(e.clientX, e.clientY);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (touch) handleScratch(touch.clientX, touch.clientY);
            }}
          />
        )}
      </div>

      <p className="text-xs text-slate-400 mt-1">
        {isRevealed
          ? '🎉 Secret Coupon Decrypted!'
          : `Scratch with finger or mouse (${scratchedPercent}% revealed)`}
      </p>
    </div>
  );
};
