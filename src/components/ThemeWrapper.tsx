import React from 'react';
import { ThemeId } from '../types/card';

interface ThemeWrapperProps {
  theme: ThemeId;
  romanticMood?: 'velvet' | 'sunset' | 'lavender' | 'midnight';
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  theme,
  romanticMood = 'velvet',
  children,
}) => {
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

    case 'romantic': {
      const getMoodStyles = () => {
        switch (romanticMood) {
          case 'sunset':
            return {
              bg: 'bg-gradient-to-br from-[#420f28] via-[#5c1638] via-[#48112e] to-[#24061a]',
              orb1: 'bg-pink-500/25',
              orb2: 'bg-amber-500/20',
              border: 'border-pink-300/40',
              cardBg: 'bg-rose-950/50',
            };
          case 'lavender':
            return {
              bg: 'bg-gradient-to-br from-[#280838] via-[#3d0e52] via-[#2f0b42] to-[#140221]',
              orb1: 'bg-purple-500/25',
              orb2: 'bg-fuchsia-500/20',
              border: 'border-purple-300/40',
              cardBg: 'bg-purple-950/50',
            };
          case 'midnight':
            return {
              bg: 'bg-gradient-to-br from-[#200311] via-[#380820] via-[#260515] to-[#0e0108]',
              orb1: 'bg-red-600/20',
              orb2: 'bg-rose-700/20',
              border: 'border-red-400/30',
              cardBg: 'bg-black/60',
            };
          default:
            return {
              bg: 'bg-gradient-to-br from-[#3b041a] via-[#4d0c26] via-[#3d081f] to-[#1c020d]',
              orb1: 'bg-rose-600/20',
              orb2: 'bg-pink-500/20',
              border: 'border-rose-300/30',
              cardBg: 'bg-rose-950/50',
            };
        }
      };

      const moodStyle = getMoodStyles();

      return (
        <div
          className={`min-h-screen ${moodStyle.bg} animate-romantic-gradient text-rose-100 font-['Playfair_Display'] relative overflow-x-hidden selection:bg-rose-500 selection:text-white transition-colors duration-700`}
        >
          {/* Ambient Romantic Floating Glowing Orbs */}
          <div
            className={`pointer-events-none fixed top-10 left-1/4 h-80 w-80 rounded-full ${moodStyle.orb1} blur-[100px] animate-pulse-glow transition-all duration-700`}
          />
          <div
            className={`pointer-events-none fixed bottom-20 right-1/4 h-96 w-96 rounded-full ${moodStyle.orb2} blur-[120px] animate-pulse-glow transition-all duration-700`}
            style={{ animationDelay: '2.5s' }}
          />

          <div className="relative mx-auto max-w-2xl px-4 py-8">
            <div
              className={`rounded-3xl border ${moodStyle.border} ${moodStyle.cardBg} p-6 backdrop-blur-2xl shadow-[0_10px_50px_rgba(244,63,94,0.18)] ring-1 ring-rose-500/20 sm:p-8 transition-all duration-500`}
            >
              {children}
            </div>
          </div>
        </div>
      );
    }

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
