import React, { useState, useEffect } from 'react';
import { CardData } from '../types/card';
import { ThemeWrapper } from './ThemeWrapper';
import { CandleCake } from './CandleCake';
import { BalloonPop } from './BalloonPop';
import { GiftUnbox } from './GiftUnbox';
import { ScratchCard } from './ScratchCard';
import { ConfettiCanvas } from './ConfettiCanvas';
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
  PartyPopper
} from 'lucide-react';

interface CardPresentationProps {
  card: CardData;
  onEditOrCreateOwn: () => void;
  onOpenShareModal: () => void;
}

export const CardPresentation: React.FC<CardPresentationProps> = ({
  card,
  onEditOrCreateOwn,
  onOpenShareModal,
}) => {
  const [isOpenEnvelope, setIsOpenEnvelope] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [confettiBurstCount, setConfettiBurstCount] = useState(0);

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

  return (
    <ThemeWrapper theme={card.theme}>
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfettiBurstCount((c) => c + 1)}
            className="flex items-center gap-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 p-2 text-xs font-medium text-amber-300 transition-colors"
            title="Trigger Confetti Explosion!"
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
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Music On'}</span>
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
            className="group relative cursor-pointer flex flex-col items-center max-w-sm w-full rounded-3xl border-2 border-pink-500/40 bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-900 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
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
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-300 to-cyan-300 mb-4">
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
        <div className="space-y-6 animate-fade-in pb-12">
          {/* Header Card Headline & Metadata */}
          <div className="text-center space-y-3 pt-2">
            {card.customBadge && (
              <span className="inline-block rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-1 text-xs font-black uppercase tracking-widest text-slate-950 shadow-md">
                🏆 {card.customBadge}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow">
              {card.headline}
            </h1>

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

          {/* MAIN BIRTHDAY CAKE & CANDLE BLOWING */}
          <div className="my-6">
            <CandleCake
              candleCount={card.candleCount}
              enableMicBlow={card.enableMicBlow}
              theme={card.theme}
              onAllCandlesBlown={() => setConfettiBurstCount((c) => c + 1)}
            />
          </div>

          {/* MAIN MESSAGE BOX */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Heart className="h-24 w-24 text-pink-500" />
            </div>

            {card.questTitle && (
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{card.questTitle}</span>
              </div>
            )}

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium whitespace-pre-line relative z-10">
              {card.message}
            </p>

            {card.specialQuote && (
              <blockquote className="mt-4 pt-3 border-t border-slate-800 italic text-xs text-amber-300">
                "{card.specialQuote}"
              </blockquote>
            )}
          </div>

          {/* MEMORIES & POLAROID PHOTOS (IF ANY) */}
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

          {/* INTERACTIVE BALLOONS */}
          <BalloonPop messages={card.balloonMessages} theme={card.theme} />

          {/* UNBOXABLE GIFT */}
          {card.giftBoxMessage && (
            <GiftUnbox giftMessage={card.giftBoxMessage} theme={card.theme} />
          )}

          {/* SCRATCH CARD FORTUNE */}
          {card.scratchCardSecret && (
            <ScratchCard secretText={card.scratchCardSecret} />
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
              onClick={() => setIsOpenEnvelope(false)}
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
