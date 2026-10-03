import React from 'react';
import { ThemeId } from '../types/card';
import { FallingRosesCanvas } from './FallingRosesCanvas';

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
        <div className="h-full min-h-full w-full flex-1 flex flex-col justify-center items-center bg-slate-950 text-emerald-400 font-['Press_Start_2P'] relative overflow-hidden selection:bg-yellow-400 selection:text-black">
          {/* Retro CRT Scanlines Overlay */}
          <div className="pointer-events-none fixed inset-0 z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
          
          {/* Retro 8-Bit Pixel Floral Background Elements (Swaying & Pulsing) */}
          <div className="pointer-events-none fixed top-4 left-4 z-10 opacity-75 animate-arcade-floral-sway">
            <svg width="32" height="32" viewBox="0 0 16 16" className="animate-arcade-floral-pulse drop-shadow-[0_0_10px_#00ffcc]">
              <rect x="6" y="2" width="4" height="3" fill="#ff007f" />
              <rect x="2" y="6" width="3" height="4" fill="#ff007f" />
              <rect x="11" y="6" width="3" height="4" fill="#ff007f" />
              <rect x="6" y="11" width="4" height="3" fill="#ff007f" />
              <rect x="5" y="5" width="6" height="6" fill="#ffff00" />
              <rect x="7" y="7" width="2" height="2" fill="#ff9900" />
              <rect x="7" y="14" width="2" height="2" fill="#00ff66" />
              <rect x="9" y="13" width="2" height="2" fill="#00ff66" />
            </svg>
          </div>
          <div className="pointer-events-none fixed top-6 right-6 z-10 opacity-70 animate-arcade-floral-sway" style={{ animationDelay: '1.8s' }}>
            <svg width="28" height="28" viewBox="0 0 16 16" className="animate-arcade-floral-pulse drop-shadow-[0_0_10px_#ff00ff]">
              <rect x="6" y="2" width="4" height="3" fill="#00ffff" />
              <rect x="2" y="6" width="3" height="4" fill="#00ffff" />
              <rect x="11" y="6" width="3" height="4" fill="#00ffff" />
              <rect x="6" y="11" width="4" height="3" fill="#00ffff" />
              <rect x="5" y="5" width="6" height="6" fill="#ff00ff" />
              <rect x="7" y="7" width="2" height="2" fill="#ffff00" />
            </svg>
          </div>

          {/* Arcade Outer Layout Frame */}
          <div className="relative mx-auto max-w-xl w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex flex-col justify-center items-center flex-1 min-h-0">
            {children}
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
            };
          case 'lavender':
            return {
              bg: 'bg-gradient-to-br from-[#280838] via-[#3d0e52] via-[#2f0b42] to-[#140221]',
              orb1: 'bg-purple-500/25',
              orb2: 'bg-fuchsia-500/20',
            };
          case 'midnight':
            return {
              bg: 'bg-gradient-to-br from-[#200311] via-[#380820] via-[#260515] to-[#0e0108]',
              orb1: 'bg-red-600/20',
              orb2: 'bg-rose-700/20',
            };
          default:
            return {
              bg: 'bg-gradient-to-br from-[#3b041a] via-[#4d0c26] via-[#3d081f] to-[#1c020d]',
              orb1: 'bg-rose-600/20',
              orb2: 'bg-pink-500/20',
            };
        }
      };

      const moodStyle = getMoodStyles();

      return (
        <div
          className={`h-full min-h-full w-full flex-1 flex flex-col justify-center items-center ${moodStyle.bg} animate-romantic-gradient text-rose-100 font-['Playfair_Display'] relative overflow-hidden selection:bg-rose-500 selection:text-white transition-colors duration-700`}
        >
          {/* Falling Red ("Laal") Roses, Petals & Blooms Canvas */}
          <FallingRosesCanvas />

          {/* Romantic Floral Background Elements (Swaying & Blooming) */}
          <div className="pointer-events-none fixed top-3 left-3 z-10 opacity-70 animate-romantic-floral-sway">
            <svg width="54" height="54" viewBox="0 0 100 100" className="animate-romantic-floral-bloom text-rose-500 fill-current drop-shadow-[0_4px_16px_rgba(244,63,94,0.35)]">
              <path d="M50 15 C35 15, 20 28, 28 48 C20 58, 25 75, 45 78 C48 88, 62 90, 72 80 C85 82, 92 68, 86 54 C95 40, 84 22, 68 24 C62 16, 55 15, 50 15 Z" opacity="0.85" />
              <path d="M50 25 C40 25, 32 34, 38 46 C34 54, 38 65, 50 67 C54 74, 64 74, 70 66 C78 68, 82 58, 78 48 C83 38, 75 28, 64 30 Z" fill="#9f1239" opacity="0.9" />
              <circle cx="52" cy="46" r="10" fill="#fda4af" opacity="0.65" />
            </svg>
          </div>
          <div className="pointer-events-none fixed top-4 right-4 z-10 opacity-65 animate-floral-sway-alt" style={{ animationDelay: '1.5s' }}>
            <svg width="48" height="48" viewBox="0 0 100 100" className="animate-romantic-floral-bloom text-pink-400 fill-current drop-shadow-[0_4px_14px_rgba(244,114,182,0.35)]">
              <path d="M50 15 C35 15, 20 28, 28 48 C20 58, 25 75, 45 78 C48 88, 62 90, 72 80 C85 82, 92 68, 86 54 C95 40, 84 22, 68 24 C62 16, 55 15, 50 15 Z" opacity="0.8" />
              <path d="M50 25 C40 25, 32 34, 38 46 C34 54, 38 65, 50 67 C54 74, 64 74, 70 66 C78 68, 82 58, 78 48 C83 38, 75 28, 64 30 Z" fill="#be123c" opacity="0.9" />
              <circle cx="52" cy="46" r="8" fill="#fecdd3" opacity="0.65" />
            </svg>
          </div>

          {/* Ambient Romantic Floating Glowing Orbs */}
          <div
            className={`pointer-events-none fixed top-10 left-1/4 h-80 w-80 rounded-full ${moodStyle.orb1} blur-[100px] animate-pulse-glow transition-all duration-700`}
          />
          <div
            className={`pointer-events-none fixed bottom-20 right-1/4 h-96 w-96 rounded-full ${moodStyle.orb2} blur-[120px] animate-pulse-glow transition-all duration-700`}
            style={{ animationDelay: '2.5s' }}
          />

          {/* Centered Presentation Layout (Fits Window & Center Focus) */}
          <div className="relative mx-auto max-w-xl w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex flex-col justify-center items-center flex-1 min-h-0">
            {children}
          </div>
        </div>
      );
    }

    case 'cyberpunk':
      return (
        <div className="h-full min-h-full w-full flex-1 flex flex-col justify-center items-center bg-slate-950 text-cyan-300 font-['Orbitron'] relative overflow-hidden selection:bg-cyan-400 selection:text-black">
          {/* Tech Grid Lines Background */}
          <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
          
          <div className="relative mx-auto max-w-xl w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex flex-col justify-center items-center flex-1 min-h-0">
            {children}
          </div>
        </div>
      );

    case 'galaxy':
      return (
        <div className="h-full min-h-full w-full flex-1 flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-purple-950 text-indigo-100 font-['Plus_Jakarta_Sans'] relative overflow-hidden selection:bg-purple-500 selection:text-white">
          <div className="relative mx-auto max-w-xl w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex flex-col justify-center items-center flex-1 min-h-0">
            {children}
          </div>
        </div>
      );

    case 'pastel':
      return (
        <div className="h-full min-h-full w-full flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-[#fff9f9] via-[#f3a2b5]/25 to-[#e9829b]/15 text-slate-800 font-['Fredoka'] relative overflow-hidden selection:bg-[#e9829b] selection:text-white">
          <div className="relative mx-auto max-w-xl w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex flex-col justify-center items-center flex-1 min-h-0">
            {children}
          </div>
        </div>
      );

    case 'luxury':
      return (
        <div className="h-full min-h-full w-full flex-1 flex flex-col justify-center items-center bg-slate-950 text-amber-100 font-['Cinzel'] relative overflow-hidden selection:bg-amber-400 selection:text-black">
          <div className="relative mx-auto max-w-xl w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex flex-col justify-center items-center flex-1 min-h-0">
            {children}
          </div>
        </div>
      );

    default:
      return (
        <div className="h-full min-h-full w-full flex-1 flex flex-col justify-center items-center bg-[#fff9f9] text-slate-800 font-sans p-2">
          <div className="mx-auto max-w-xl w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex flex-col justify-center items-center flex-1 min-h-0">{children}</div>
        </div>
      );
  }
};
