import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { ThemeId } from '../types/card';

interface GiftUnboxProps {
  giftMessage?: string;
  theme?: ThemeId;
}

export const GiftUnbox: React.FC<GiftUnboxProps> = ({
  giftMessage = '🎁 SPECIAL SURPRISE: A day of celebration, laughter, and your favorite treat on me!',
  theme = 'arcade',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    soundEngine.playUnboxChime();
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 p-5 bg-slate-900/70 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl text-center">
      <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-center gap-2">
        <Gift className="h-4 w-4 text-amber-400" />
        <span>Unwrap Your Birthday Present</span>
      </h3>

      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="group relative inline-flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 my-2"
        >
          {/* Gift Bow */}
          <div className="relative -mb-2 z-10">
            <div className="h-6 w-12 rounded-full bg-amber-400 border border-amber-300 shadow-md transform -rotate-6 animate-pulse" />
          </div>

          {/* Gift Box Lid */}
          <div className="h-8 w-32 bg-rose-600 rounded-t-md border border-rose-400 shadow-md relative overflow-hidden flex items-center justify-center">
            {/* Vertical Ribbon */}
            <div className="absolute inset-y-0 w-6 bg-amber-400 left-1/2 -translate-x-1/2" />
          </div>

          {/* Gift Box Base */}
          <div className="h-24 w-28 bg-rose-700 rounded-b-md border border-rose-500 shadow-2xl relative overflow-hidden flex items-center justify-center">
            {/* Vertical Ribbon */}
            <div className="absolute inset-y-0 w-6 bg-amber-400 left-1/2 -translate-x-1/2" />
            {/* Horizontal Ribbon */}
            <div className="absolute inset-x-0 h-6 bg-amber-400 top-1/2 -translate-y-1/2" />
            <span className="z-10 text-xs font-bold text-slate-900 bg-amber-300 px-2 py-0.5 rounded shadow">
              Tap to Open!
            </span>
          </div>
        </button>
      ) : (
        /* Unboxed Surprise Content */
        <div className="animate-scale-up p-4 bg-gradient-to-br from-amber-950/80 via-slate-900 to-amber-900/40 rounded-xl border border-amber-400/50 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 h-16 w-16 bg-amber-400/20 rounded-full blur-xl" />
          <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-sm mb-2">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>SURPRISE REVEALED!</span>
          </div>
          <p className="text-sm font-medium text-amber-100/90 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-amber-500/30">
            {giftMessage}
          </p>
          <div className="mt-3 flex items-center justify-center gap-1 text-xs text-amber-400/80">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Present Unboxed & Claimed</span>
          </div>
        </div>
      )}
    </div>
  );
};
