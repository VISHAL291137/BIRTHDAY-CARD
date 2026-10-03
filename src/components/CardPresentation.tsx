import React, { useState, useEffect, useRef } from 'react';
import { CardData, ThemeId } from '../types/card';
import { ThemeWrapper } from './ThemeWrapper';
import { CandleCake } from './CandleCake';
import { BalloonPop } from './BalloonPop';
import { GiftUnbox } from './GiftUnbox';
import { ScratchCard } from './ScratchCard';
import { ConfettiCanvas } from './ConfettiCanvas';
import { MovingWordsMarquee } from './MovingWordsMarquee';
import { AnimatedMovingText } from './AnimatedMovingText';
import { soundEngine } from '../utils/audioSynth';
import { getThemeAudioUrl, getThemeTrackTitle } from '../utils/themeAudioGenerator';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Share2,
  Sparkles,
  PlusCircle,
  Mail,
  Heart,
  Award,
  Calendar,
  RotateCcw,
  PartyPopper,
  Palette,
  ChevronRight,
  ChevronLeft,
  Layers,
  Flame,
  Gift
} from 'lucide-react';

interface CardPresentationProps {
  card: CardData;
  onEditOrCreateOwn: () => void;
  onOpenShareModal: () => void;
}

export type RomanticColorMood = 'velvet' | 'sunset' | 'lavender' | 'midnight';

const ROMANTIC_COLOR_MOODS: {
  id: RomanticColorMood;
  name: string;
  gradient: string;
  glow: string;
  border: string;
  icon: string;
}[] = [
  {
    id: 'velvet',
    name: 'Velvet Rose',
    gradient: 'from-[#3b041a] via-[#4d0c26] to-[#1c020d]',
    glow: 'bg-rose-500/20',
    border: 'border-rose-400/40',
    icon: '🌹',
  },
  {
    id: 'sunset',
    name: 'Sunset Blush',
    gradient: 'from-[#420f28] via-[#5c1638] to-[#24061a]',
    glow: 'bg-pink-500/25',
    border: 'border-pink-300/40',
    icon: '🌅',
  },
  {
    id: 'lavender',
    name: 'Lavender Amour',
    gradient: 'from-[#280838] via-[#3d0e52] to-[#140221]',
    glow: 'bg-purple-500/25',
    border: 'border-purple-300/40',
    icon: '💜',
  },
  {
    id: 'midnight',
    name: 'Midnight Merlot',
    gradient: 'from-[#200311] via-[#380820] to-[#0e0108]',
    glow: 'bg-red-600/20',
    border: 'border-red-400/30',
    icon: '🍷',
  },
];

export const CardPresentation: React.FC<CardPresentationProps> = ({
  card,
  onEditOrCreateOwn,
  onOpenShareModal,
}) => {
  const [isOpenEnvelope, setIsOpenEnvelope] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [confettiBurstCount, setConfettiBurstCount] = useState(0);

  // HTML5 Audio Reference for Looping Theme-Specific Background Music
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const trackInfo = getThemeTrackTitle(card.theme);

  // Romantic Color Mood state
  const [romanticMood, setRomanticMood] = useState<RomanticColorMood>('velvet');

  // Step-by-Step Guided Navigation Mode (Default: True as requested)
  const [isStepByStepMode, setIsStepByStepMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  /**
   * Initializes and plays theme-specific background music
   * (retro synth for Arcade, piano for Romantic, etc.)
   * using an HTML5 Audio object with seamless looping (audio.loop = true)
   */
  const playThemeMusic = async () => {
    try {
      // Resume if audio instance already exists
      if (audioRef.current && audioRef.current.src) {
        audioRef.current.muted = false;
        await audioRef.current.play();
        setIsPlayingAudio(true);
        setIsMuted(false);
        return;
      }

      const audioUrl = await getThemeAudioUrl(card.theme || 'arcade');
      if (!audioUrl) return;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      // Create new HTML5 Audio object configured for continuous looping
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;

      await audio.play();
      setIsPlayingAudio(true);
      setIsMuted(false);
    } catch (err) {
      console.log('HTML5 Audio autoplay waiting for user interaction:', err);
      setIsPlayingAudio(false);
    }
  };

  /**
   * Pauses the HTML5 Audio background music
   */
  const pauseThemeMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingAudio(false);
  };

  /**
   * Toggle button handler to play or pause theme-specific background music
   * (synth for Arcade, piano for Romantic) using the HTML5 Audio object
   */
  const togglePlayPauseMusic = () => {
    if (isPlayingAudio) {
      pauseThemeMusic();
    } else {
      playThemeMusic();
    }
  };

  // Play HTML5 Audio when envelope is opened, pause on unmount
  useEffect(() => {
    if (isOpenEnvelope && !isMuted) {
      playThemeMusic();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      setIsPlayingAudio(false);
    };
  }, [isOpenEnvelope, card.theme]);

  const handleOpenEnvelope = () => {
    soundEngine.playUnboxChime();
    setIsOpenEnvelope(true);
    playThemeMusic();

    // Trigger immediate dual confetti cannon salvo!
    setConfettiBurstCount((prev) => prev + 1);
    // Follow-up second cannon volley 400ms later for grand entrance!
    setTimeout(() => {
      setConfettiBurstCount((prev) => prev + 1);
    }, 400);
  };

  const activeMoodObj =
    ROMANTIC_COLOR_MOODS.find((m) => m.id === romanticMood) || ROMANTIC_COLOR_MOODS[0];

  // Dynamic theme music label for Arcade synth vs Romantic piano
  const themeMusicLabel =
    card.theme === 'arcade' ? 'Synth' : card.theme === 'romantic' ? 'Piano' : 'Music';

  return (
    <ThemeWrapper theme={card.theme} romanticMood={romanticMood}>
      <ConfettiCanvas theme={card.theme} triggerCount={confettiBurstCount} />

      {/* Floating Audio & Action Controls Top Bar */}
      <div className="w-full flex-shrink-0 mb-1.5 sm:mb-2.5 flex items-center justify-between rounded-xl sm:rounded-2xl bg-white/95 px-2.5 py-1.5 sm:py-2 backdrop-blur-md border border-[#f3a2b5]/40 shadow-xs">
        <div className="flex items-center gap-1.5 pl-0.5">
          <span className="text-xs sm:text-sm">🎂</span>
          <span className="text-[11px] sm:text-xs font-black tracking-wide text-slate-800 uppercase truncate max-w-[130px] sm:max-w-none">
            {card.recipientName ? `${card.recipientName}'s Card` : 'Birthday Card'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setConfettiBurstCount((c) => c + 1)}
            className="flex items-center gap-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 p-1.5 sm:p-2 text-xs font-bold text-amber-800 transition-colors shadow-2xs"
            title="Trigger Confetti Cannon Explosion!"
          >
            <PartyPopper className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
          </button>

          {/* Theme-Specific Background Music Play/Pause Toggle Button */}
          <button
            type="button"
            onClick={togglePlayPauseMusic}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold transition-all shadow-md active:scale-95 ${
              isPlayingAudio
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 shadow-2xs'
            }`}
            title={`Toggle Theme Music: ${trackInfo.title} (${isPlayingAudio ? 'Click to Pause' : 'Click to Play'})`}
          >
            {isPlayingAudio ? (
              <div className="flex items-center gap-1.5">
                <Pause className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current text-white" />
                {/* Dancing Equalizer Bars */}
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-emerald-200 rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                  <span className="w-0.5 bg-white rounded-full animate-bounce h-3" style={{ animationDuration: '0.4s' }} />
                  <span className="w-0.5 bg-cyan-200 rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.7s' }} />
                </span>
                <span className="hidden sm:inline font-black">
                  Pause {themeMusicLabel}
                </span>
                <span className="sm:hidden font-black">Pause</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current text-cyan-600" />
                <span className="hidden sm:inline font-bold">
                  Play {themeMusicLabel}
                </span>
                <span className="sm:hidden font-bold">Play</span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
          >
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-600" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {!isOpenEnvelope ? (
        /* ENVELOPE / GIFT SEAL ENTRY SCREEN - FITS ONE SCREEN */
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center text-center p-2 sm:p-4 my-auto">
          <div
            onClick={handleOpenEnvelope}
            className="group relative cursor-pointer flex flex-col items-center max-w-sm w-full rounded-3xl border-2 border-[#f3a2b5] bg-[#fff9f9] p-5 sm:p-7 shadow-2xl shadow-[#f3a2b5]/25 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-card-step"
          >
            {/* Wax Seal / Envelope Icon */}
            <div className="relative mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#e9829b] to-[#f3a2b5] shadow-lg border-2 border-white animate-bounce">
              <Mail className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black text-[10px] font-black shadow-xs">
                1
              </div>
            </div>

            {card.customBadge && (
              <span className="mb-1.5 rounded-full bg-[#f3a2b5]/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#e9829b] border border-[#f3a2b5]/60">
                {card.customBadge}
              </span>
            )}

            <h1 className="text-base sm:text-lg font-extrabold text-slate-800 mb-1 leading-snug">
              A Special Birthday Card for
            </h1>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e9829b] via-rose-500 to-amber-500 mb-3 animate-float-gentle">
              {card.recipientName || 'Someone Special'}!
            </h2>

            <p className="text-xs text-slate-600 mb-4">
              From <span className="font-bold text-[#e9829b]">{card.senderName || 'A secret admirer'}</span>
            </p>

            <div className="w-full rounded-xl bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] py-2.5 px-4 font-extrabold text-xs text-white shadow-md shadow-[#e9829b]/25 group-hover:opacity-95 transition-all flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>TAP TO UNSEAL & OPEN CARD</span>
            </div>
          </div>
        </div>
      ) : (
        /* REVEALED MAIN CARD PRESENTATION - FITS ONE WINDOW & CENTER FOCUS */
        <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-between space-y-1.5 sm:space-y-2 py-0.5 my-auto">
          {/* MOVING WORDS MARQUEE RIBBON */}
          <div className="w-full flex-shrink-0">
            <MovingWordsMarquee theme={card.theme} />
          </div>

          {/* MAIN CARD CONTAINER - CENTER FOCUS & RESPONSIVE SCREEN FITTING */}
          <div className="w-full flex-1 min-h-[350px] max-h-[calc(100dvh-165px)] sm:max-h-[calc(100dvh-175px)] rounded-3xl bg-[#fff9f9] border-2 border-[#f3a2b5] p-3.5 sm:p-5 shadow-2xl shadow-[#f3a2b5]/20 flex flex-col justify-between">
            {/* FIXED RESPONSIVE CONTENT STAGE: Prevents random height shifts as step content changes */}
            <div className="w-full flex-1 min-h-0 flex items-center justify-center relative overflow-hidden">
              {/* Only the active card content panel animates smoothly during transitions */}
              <div
                key={currentStep}
                className="w-full h-full animate-card-step flex flex-col justify-center items-center overflow-y-auto pr-1"
              >
                {/* STEP 1: GREETING & METADATA */}
                {currentStep === 1 && (
                  <div className="text-center space-y-4 py-2 w-full max-w-md mx-auto my-auto">
                    <div className="flex items-center justify-center gap-2">
                      {card.customBadge && (
                        <span className="inline-block rounded-full bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] px-4 py-1 text-xs font-black uppercase tracking-widest text-white shadow-md animate-float-gentle">
                          🏆 {card.customBadge}
                        </span>
                      )}
                      <span className="text-[11px] font-extrabold text-[#e9829b] bg-[#f3a2b5]/20 px-2.5 py-0.5 rounded-full border border-[#f3a2b5]/50">
                        Step 1 · Greeting
                      </span>
                    </div>

                    <AnimatedMovingText
                      text={card.headline}
                      tag="h1"
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 leading-tight drop-shadow-xs"
                    />

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                      <span>From: <strong className="text-[#e9829b] font-bold">{card.senderName}</strong></span>
                      {card.age && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-bold text-[#e9829b]">
                            <Award className="h-3.5 w-3.5" /> Turning {card.age}!
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: BIRTHDAY CAKE & CANDLE CEREMONY */}
                {currentStep === 2 && (
                  <div className="w-full flex flex-col items-center justify-center py-1 space-y-2 my-auto">
                    <div className="text-center mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#e9829b] bg-[#f3a2b5]/20 px-3 py-1 rounded-full border border-[#f3a2b5]/50 inline-flex items-center gap-1.5 shadow-2xs">
                        <Flame className="h-3.5 w-3.5 text-amber-500" />
                        <span>Step 2 · Birthday Candle Ceremony</span>
                      </span>
                    </div>
                    <CandleCake
                      candleCount={card.candleCount}
                      enableMicBlow={card.enableMicBlow}
                      theme={card.theme}
                      onAllCandlesBlown={() => setConfettiBurstCount((c) => c + 1)}
                    />
                  </div>
                )}

                {/* STEP 3: MAIN MESSAGE BOX WITH MOVING WORDS */}
                {currentStep === 3 && (
                  <div className="w-full rounded-2xl bg-white border border-[#f3a2b5]/40 p-5 sm:p-6 shadow-xs relative overflow-hidden my-auto">
                    <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                      <Heart className="h-24 w-24 text-[#e9829b] animate-pulse" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#e9829b] flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-[#e9829b] fill-[#e9829b]/30" />
                        <span>Step 3 · Words from the Heart</span>
                      </span>

                      {card.questTitle && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#f3a2b5]/20 text-[#e9829b] border border-[#f3a2b5]/50 text-xs font-bold">
                          <Sparkles className="h-3 w-3" />
                          <span>{card.questTitle}</span>
                        </span>
                      )}
                    </div>

                    <AnimatedMovingText
                      text={card.message}
                      tag="p"
                      className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium relative z-10"
                    />

                    {card.specialQuote && (
                      <blockquote className="mt-4 pt-3 border-t border-[#f3a2b5]/30 italic text-xs text-[#e9829b] font-medium">
                        "{card.specialQuote}"
                      </blockquote>
                    )}
                  </div>
                )}

                {/* STEP 4: INTERACTIVE BALLOONS */}
                {currentStep === 4 && (
                  <div className="w-full flex flex-col items-center justify-center py-1 space-y-2 my-auto">
                    <div className="text-center mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#e9829b] bg-[#f3a2b5]/20 px-3 py-1 rounded-full border border-[#f3a2b5]/50 inline-flex items-center gap-1.5 shadow-2xs">
                        <span>🎈 Step 4 · Pop Celebration Balloons</span>
                      </span>
                    </div>
                    <BalloonPop
                      messages={card.balloonMessages}
                      theme={card.theme}
                      onBalloonTap={() => {
                        soundEngine.playBalloonTapSound();
                      }}
                    />
                  </div>
                )}

                {/* STEP 5: UNBOXABLE GIFT */}
                {currentStep === 5 && (
                  <div className="w-full flex flex-col items-center justify-center py-1 space-y-2 my-auto">
                    <div className="text-center mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#e9829b] bg-[#f3a2b5]/20 px-3 py-1 rounded-full border border-[#f3a2b5]/50 inline-flex items-center gap-1.5 shadow-2xs">
                        <Gift className="h-3.5 w-3.5 text-[#e9829b]" />
                        <span>Step 5 · Unbox Special Present</span>
                      </span>
                    </div>
                    <GiftUnbox
                      giftMessage={card.giftBoxMessage || '🎁 Unlimited Warm Hugs & Happiness!'}
                      theme={card.theme}
                    />
                  </div>
                )}

                {/* STEP 6: SCRATCH CARD FORTUNE & MEMORIES */}
                {currentStep === 6 && (
                  <div className="w-full space-y-3 py-1 my-auto">
                    <div className="text-center mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#e9829b] bg-[#f3a2b5]/20 px-3 py-1 rounded-full border border-[#f3a2b5]/50 inline-flex items-center gap-1.5 shadow-2xs">
                        <span>✨ Step 6 · Scratch Card & Memories</span>
                      </span>
                    </div>
                    {card.scratchCardSecret && (
                      <ScratchCard secretText={card.scratchCardSecret} />
                    )}

                    {(card.memories?.length > 0 || card.photos?.length > 0) && (
                      <div className="p-3.5 rounded-2xl bg-white border border-[#f3a2b5]/40 space-y-2.5 shadow-2xs">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#e9829b]" />
                          <span>Special Memories & Moments</span>
                        </h3>

                        {card.memories?.length > 0 && (
                          <ul className="space-y-1 text-xs text-slate-700 max-h-28 overflow-y-auto pr-1">
                            {card.memories.map((m, i) => (
                              <li key={i} className="flex items-start gap-2 bg-[#fff9f9] p-1.5 rounded-xl border border-[#f3a2b5]/30">
                                <span className="text-[#e9829b] font-bold">#0{i + 1}</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {card.photos?.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {card.photos.map((url, i) => (
                              <div key={i} className="p-1 bg-white rounded-xl shadow-xs border border-[#f3a2b5]/30">
                                <img
                                  src={url}
                                  alt={`Memory ${i + 1}`}
                                  className="h-20 w-full object-cover rounded-lg"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FIXED NAVIGATION BUTTONS: Dedicated, static bottom row directly below card contents */}
            <div className="w-full flex-shrink-0 mt-4 pt-4 border-t-2 border-[#f3a2b5]/30 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border-2 border-[#f3a2b5]/50 text-xs font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fff9f9] hover:border-[#e9829b] transition-colors shadow-2xs active:scale-95"
              >
                <ChevronLeft className="h-4 w-4 text-[#e9829b]" />
                <span>Prev Step</span>
              </button>

              {/* Progress Dots Indicator */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentStep(i + 1)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentStep === i + 1
                          ? 'w-7 bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] shadow-xs'
                          : 'w-2.5 bg-[#f3a2b5]/40 hover:bg-[#f3a2b5]'
                      }`}
                      title={`Step ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
                disabled={currentStep === totalSteps}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] text-xs font-extrabold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-md shadow-[#e9829b]/20 active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </ThemeWrapper>
  );
};
