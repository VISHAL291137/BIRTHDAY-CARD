import React, { useState, useEffect } from 'react';
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
import {
  Volume2,
  VolumeX,
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

  // Romantic Color Mood state
  const [romanticMood, setRomanticMood] = useState<RomanticColorMood>('velvet');

  // Step-by-Step Guided Navigation Mode
  const [isStepByStepMode, setIsStepByStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Start theme music on envelope open
  useEffect(() => {
    if (isOpenEnvelope && card.musicTrack && card.musicTrack !== 'none') {
      soundEngine.playMusicTrack(card.musicTrack);
    }
    return () => {
      soundEngine.stopMusic();
    };
  }, [isOpenEnvelope, card.musicTrack]);

  const handleOpenEnvelope = () => {
    soundEngine.playUnboxChime();
    setIsOpenEnvelope(true);
    // Trigger immediate dual confetti cannon salvo!
    setConfettiBurstCount((prev) => prev + 1);
    // Follow-up second cannon volley 400ms later for grand entrance!
    setTimeout(() => {
      setConfettiBurstCount((prev) => prev + 1);
    }, 400);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted && card.musicTrack && card.musicTrack !== 'none') {
      soundEngine.playMusicTrack(card.musicTrack);
    }
  };

  const activeMoodObj =
    ROMANTIC_COLOR_MOODS.find((m) => m.id === romanticMood) || ROMANTIC_COLOR_MOODS[0];

  return (
    <ThemeWrapper theme={card.theme} romanticMood={romanticMood}>
      <ConfettiCanvas theme={card.theme} triggerCount={confettiBurstCount} />

      {/* Floating Audio & Action Controls Top Bar */}
      <div className="sticky top-2 z-40 mb-4 flex items-center justify-between rounded-2xl bg-slate-900/80 p-2.5 backdrop-blur-md border border-slate-800 shadow-lg">
        <button
          onClick={onEditOrCreateOwn}
          className="flex items-center gap-1.5 rounded-xl bg-pink-600/90 hover:bg-pink-500 px-3 py-1.5 text-xs font-bold text-white transition-colors shadow"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create A Card</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {isOpenEnvelope && (
            <button
              onClick={() => setIsStepByStepMode(!isStepByStepMode)}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors border ${
                isStepByStepMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle Step-by-Step Celebration Journey"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {isStepByStepMode ? 'Step Mode' : 'Scroll Mode'}
              </span>
            </button>
          )}

          <button
            onClick={() => setConfettiBurstCount((c) => c + 1)}
            className="flex items-center gap-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 p-2 text-xs font-medium text-amber-300 transition-colors"
            title="Trigger Confetti Cannon Explosion!"
          >
            <PartyPopper className="h-4 w-4" />
          </button>

          <button
            onClick={toggleMute}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
              isMuted
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'bg-cyan-600 text-white shadow-md'
            }`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 animate-pulse" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Music'}</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors"
          >
            <Share2 className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {!isOpenEnvelope ? (
        /* ENVELOPE / GIFT SEAL ENTRY SCREEN */
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
          <div
            onClick={handleOpenEnvelope}
            className="group relative cursor-pointer flex flex-col items-center max-w-sm w-full rounded-3xl border-2 border-pink-500/40 bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-900 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-card-step"
          >
            {/* Wax Seal / Envelope Icon */}
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-xl border-2 border-pink-300 animate-bounce">
              <Mail className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black text-xs font-black">
                1
              </div>
            </div>

            {card.customBadge && (
              <span className="mb-2 rounded-full bg-pink-500/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-pink-300 border border-pink-500/30">
                {card.customBadge}
              </span>
            )}

            <h1 className="text-xl font-extrabold text-white mb-2 leading-snug">
              A Special Birthday Card for
            </h1>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-300 to-cyan-300 mb-4 animate-float-gentle">
              {card.recipientName || 'Someone Special'}!
            </h2>

            <p className="text-xs text-slate-300 mb-6">
              From <span className="font-semibold text-pink-300">{card.senderName || 'A secret admirer'}</span>
            </p>

            <div className="w-full rounded-2xl bg-pink-500 py-3 font-extrabold text-xs text-white shadow-lg group-hover:bg-pink-400 transition-colors flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>TAP TO UNSEAL & OPEN CARD</span>
            </div>
          </div>
        </div>
      ) : (
        /* REVEALED MAIN CARD PRESENTATION */
        <div className="space-y-6 pb-12">
          {/* MOVING WORDS MARQUEE RIBBON */}
          <MovingWordsMarquee theme={card.theme} />

          {/* ROMANTIC COLOR MOOD CHANGER (WHEN ROMANTIC THEME) */}
          {card.theme === 'romantic' && (
            <div className="p-3 bg-rose-950/40 rounded-2xl border border-rose-500/30 backdrop-blur-md animate-card-step">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-pink-400" />
                  <span>Romantic View Colors Change:</span>
                </span>
                <span className="text-[10px] text-rose-400/80 font-medium">
                  {activeMoodObj.name}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {ROMANTIC_COLOR_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setRomanticMood(mood.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      romanticMood === mood.id
                        ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300/50 scale-102'
                        : 'bg-black/40 text-rose-200/80 hover:bg-black/60 border border-rose-500/20'
                    }`}
                  >
                    <span>{mood.icon}</span>
                    <span className="truncate">{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP-BY-STEP GUIDED MODE NAVIGATION BAR */}
          {isStepByStepMode && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-700 backdrop-blur-md shadow-lg">
              <button
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 disabled:opacity-30 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev Step</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i + 1)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentStep === i + 1
                        ? 'w-6 bg-pink-500'
                        : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Step ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
                disabled={currentStep === totalSteps}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-600 text-xs font-bold text-white disabled:opacity-30 hover:bg-pink-500 transition-colors shadow"
              >
                <span>Next Step</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 1: MOVING WORDS HEADLINE & METADATA */}
          {(!isStepByStepMode || currentStep === 1) && (
            <div className="text-center space-y-3 pt-2 animate-card-step">
              <div className="flex items-center justify-center gap-2">
                {card.customBadge && (
                  <span className="inline-block rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-1 text-xs font-black uppercase tracking-widest text-slate-950 shadow-md animate-float-gentle">
                    🏆 {card.customBadge}
                  </span>
                )}
                <span className="text-[11px] font-bold text-pink-300/80">Step 1 · Greeting</span>
              </div>

              {/* MOVING WORD HEADLINE ANIMATION */}
              <AnimatedMovingText
                text={card.headline}
                tag="h1"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow"
              />

              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                <span>From: <strong className="text-amber-300">{card.senderName}</strong></span>
                {card.age && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-bold text-cyan-300">
                      <Award className="h-3.5 w-3.5" /> Turning {card.age}!
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: BIRTHDAY CAKE & CANDLE CEREMONY */}
          {(!isStepByStepMode || currentStep === 2) && (
            <div className="my-6 p-4 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl animate-card-step">
              <div className="text-center mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center justify-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span>Step 2 · The Birthday Candle Ceremony</span>
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
          {(!isStepByStepMode || currentStep === 3) && (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden animate-card-step">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Heart className="h-24 w-24 text-pink-500 animate-pulse" />
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-pink-400 fill-pink-400/30" />
                  <span>Step 3 · Words from the Heart</span>
                </span>

                {card.questTitle && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold">
                    <Sparkles className="h-3 w-3" />
                    <span>{card.questTitle}</span>
                  </span>
                )}
              </div>

              {/* MOVING WORD LETTER BODY */}
              <AnimatedMovingText
                text={card.message}
                tag="p"
                className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium relative z-10"
              />

              {card.specialQuote && (
                <blockquote className="mt-4 pt-3 border-t border-slate-800 italic text-xs text-amber-300">
                  "{card.specialQuote}"
                </blockquote>
              )}
            </div>
          )}

          {/* STEP 4: INTERACTIVE BALLOONS */}
          {(!isStepByStepMode || currentStep === 4) && (
            <div className="animate-card-step">
              <BalloonPop messages={card.balloonMessages} theme={card.theme} />
            </div>
          )}

          {/* STEP 5: UNBOXABLE GIFT */}
          {(!isStepByStepMode || currentStep === 5) && card.giftBoxMessage && (
            <div className="animate-card-step">
              <GiftUnbox giftMessage={card.giftBoxMessage} theme={card.theme} />
            </div>
          )}

          {/* STEP 6: SCRATCH CARD FORTUNE & MEMORIES */}
          {(!isStepByStepMode || currentStep === 6) && (
            <div className="space-y-6 animate-card-step">
              {card.scratchCardSecret && (
                <ScratchCard secretText={card.scratchCardSecret} />
              )}

              {/* MEMORIES & POLAROID PHOTOS */}
              {(card.memories?.length > 0 || card.photos?.length > 0) && (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-pink-400" />
                    <span>Special Memories & Moments</span>
                  </h3>

                  {card.memories?.length > 0 && (
                    <ul className="space-y-2 text-xs text-slate-300">
                      {card.memories.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-pink-400 font-bold">#0{i + 1}</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {card.photos?.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {card.photos.map((url, i) => (
                        <div key={i} className="p-2 bg-white rounded-xl shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
                          <img
                            src={url}
                            alt={`Memory ${i + 1}`}
                            className="h-32 w-full object-cover rounded-lg"
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

          {/* FOOTER ACTION BAR */}
          <div className="pt-6 border-t border-slate-800 text-center space-y-3">
            <button
              onClick={onEditOrCreateOwn}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 py-3.5 font-black text-xs text-white shadow-xl hover:opacity-95 transition-opacity"
            >
              <PlusCircle className="h-5 w-5" />
              <span>CREATE A CARD FOR YOUR FRIENDS!</span>
            </button>

            <button
              onClick={() => {
                setIsOpenEnvelope(false);
                setCurrentStep(1);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Replay Envelope Unsealing</span>
            </button>
          </div>
        </div>
      )}
    </ThemeWrapper>
  );
};
