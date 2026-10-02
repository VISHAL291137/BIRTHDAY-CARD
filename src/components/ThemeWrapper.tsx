import React from 'react';
import { ThemeId } from '../types/card';

interface ThemeWrapperProps {
  theme: ThemeId;
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children }) => {
  switch (theme) {
    case 'arcade':
      return (
        <div className="min-h-screen bg-slate-950 text-emerald-400 font-['Press_Start_2P'] relative overflow-x-hidden selection:bg-yellow-400 selection:text-black">
          {/* Retro CRT Scanlines Overlay */}
          <div className="pointer-events-none fixed inset-0 z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
          
          {/* Arcade Outer Border Frame */}
          <div className="relative mx-auto max-w-2xl px-3 py-6 sm:px-6">
            <div className="border-4 border-yellow-400 bg-slate-900 p-4 shadow-[8px_8px_0_#000] sm:p-6">
              {children}
            </div>
          </div>
        </div>
      );

    case 'romantic':
      return (
        <div className="min-h-screen bg-gradient-to-b from-rose-950 via-slate-950 to-pink-950 text-rose-100 font-['Playfair_Display'] relative overflow-x-hidden selection:bg-rose-500 selection:text-white">
          <div className="relative mx-auto max-w-2xl px-4 py-8">
            <div className="rounded-3xl border border-rose-300/20 bg-rose-950/40 p-6 backdrop-blur-xl shadow-2xl ring-1 ring-rose-500/10 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      );

    case 'cyberpunk':
      return (
        <div className="min-h-screen bg-slate-950 text-cyan-300 font-['Orbitron'] relative overflow-x-hidden selection:bg-cyan-400 selection:text-black">
          {/* Tech Grid Lines Background */}
          <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
          
          <div className="relative mx-auto max-w-2xl px-4 py-8">
            <div className="relative rounded-xl border-2 border-cyan-400/80 bg-slate-900/90 p-6 shadow-[0_0_25px_rgba(0,240,255,0.25)] sm:p-8 backdrop-blur-md">
              {/* Sci-Fi HUD Corner Elements */}
              <div className="absolute top-0 left-0 h-4 w-4 border-t-4 border-l-4 border-yellow-400" />
              <div className="absolute top-0 right-0 h-4 w-4 border-t-4 border-r-4 border-yellow-400" />
              <div className="absolute bottom-0 left-0 h-4 w-4 border-b-4 border-l-4 border-yellow-400" />
              <div className="absolute bottom-0 right-0 h-4 w-4 border-b-4 border-r-4 border-yellow-400" />
              {children}
            </div>
          </div>
        </div>
      );

    case 'galaxy':
      return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-purple-950 text-indigo-100 font-['Plus_Jakarta_Sans'] relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
          <div className="relative mx-auto max-w-2xl px-4 py-8">
            <div className="rounded-3xl border border-purple-500/30 bg-purple-950/30 p-6 backdrop-blur-xl shadow-[0_0_35px_rgba(168,85,247,0.2)] sm:p-8">
              {children}
            </div>
          </div>
        </div>
      );

    case 'pastel':
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-950 via-slate-950 to-pink-950 text-amber-100 font-['Fredoka'] relative overflow-x-hidden selection:bg-pink-400 selection:text-slate-950">
          <div className="relative mx-auto max-w-2xl px-4 py-8">
            <div className="rounded-3xl border-2 border-amber-300/30 bg-slate-900/90 p-6 backdrop-blur-lg shadow-2xl sm:p-8">
              {children}
            </div>
          </div>
        </div>
      );

    case 'luxury':
      return (
        <div className="min-h-screen bg-slate-950 text-amber-100 font-['Cinzel'] relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
          <div className="relative mx-auto max-w-2xl px-4 py-8">
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/50 p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] sm:p-8 backdrop-blur-xl">
              {children}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4">
          <div className="mx-auto max-w-2xl">{children}</div>
        </div>
      );
  }
};
