import React, { useState } from 'react';
import { soundEngine } from '../utils/audioSynth';
import { ThemeId } from '../types/card';

interface BalloonPopProps {
  messages?: string[];
  theme?: ThemeId;
  onBalloonTap?: (index: number) => void;
}

const DEFAULT_BALLOON_MESSAGES = [
  '🎉 Wishing you infinite joy!',
  '🎂 May all your dreams come true!',
  '⭐ Level Up +1 Year of Awesomeness!',
  '🍕 Free Pizza & Happiness Forever!'
];

export const BalloonPop: React.FC<BalloonPopProps> = ({
  messages = DEFAULT_BALLOON_MESSAGES,
  theme = 'arcade',
  onBalloonTap,
}) => {
  const activeMessages = messages.length > 0 ? messages : DEFAULT_BALLOON_MESSAGES;

  const [poppedIndex, setPoppedIndex] = useState<Record<number, boolean>>({});
  const [revealedNotes, setRevealedNotes] = useState<Record<number, string>>({});

  const balloonColors = [
    'from-rose-400 to-pink-600',
    'from-cyan-400 to-blue-600',
    'from-amber-300 to-yellow-500',
    'from-purple-400 to-indigo-600',
    'from-emerald-400 to-teal-600'
  ];

  const handlePop = (index: number) => {
    // Subtle acoustic balloon tap SFX
    soundEngine.playBalloonTapSound();
    onBalloonTap?.(index);

    if (poppedIndex[index]) return;
    soundEngine.playPopSound();

    setPoppedIndex((prev) => ({ ...prev, [index]: true }));
    const note = activeMessages[index % activeMessages.length];
    setRevealedNotes((prev) => ({ ...prev, [index]: note }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-xl my-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold tracking-wide text-slate-200 flex items-center gap-1.5">
          🎈 Pop the Party Balloons!
        </h3>
        <span className="text-xs text-slate-400">
          {Object.keys(poppedIndex).length}/{activeMessages.length} Popped
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center py-2">
        {activeMessages.map((msg, index) => {
          const isPopped = poppedIndex[index];
          const color = balloonColors[index % balloonColors.length];

          return (
            <div key={index} className="flex flex-col items-center">
              {!isPopped ? (
                <button
                  onClick={() => handlePop(index)}
                  className="group relative flex flex-col items-center focus:outline-none transition-transform hover:scale-105 active:scale-95 animate-bounce"
                  style={{ animationDuration: `${3 + (index % 3)}s` }}
                >
                  {/* Balloon Oval */}
                  <div
                    className={`h-20 w-16 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-br ${color} shadow-lg relative flex items-center justify-center border border-white/30`}
                  >
                    {/* Shine highlight */}
                    <div className="absolute top-2 left-3 h-4 w-2 rounded-full bg-white/40 transform -rotate-45" />
                    <span className="text-xs font-bold text-white drop-shadow">
                      Tap!
                    </span>
                  </div>

                  {/* Knot */}
                  <div className={`h-2 w-3 rounded-b-md bg-gradient-to-br ${color} -mt-0.5`} />

                  {/* Wavy String */}
                  <div className="h-10 w-0.5 bg-slate-400/50" />
                </button>
              ) : (
                /* Revealed Secret Note */
                <div className="flex flex-col items-center animate-fade-in p-2 bg-slate-800/90 rounded-xl border border-pink-500/40 shadow-inner text-center w-full min-h-[90px] justify-center">
                  <span className="text-lg mb-1">💥</span>
                  <p className="text-xs font-medium text-pink-200 leading-tight">
                    {revealedNotes[index]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
