import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCw, Flame, Volume2, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { ThemeId } from '../types/card';

interface CandleCakeProps {
  candleCount?: number;
  enableMicBlow?: boolean;
  theme?: ThemeId;
  onAllCandlesBlown?: () => void;
}

export const CandleCake: React.FC<CandleCakeProps> = ({
  candleCount = 5,
  enableMicBlow = true,
  theme = 'arcade',
  onAllCandlesBlown,
}) => {
  const [litCandles, setLitCandles] = useState<boolean[]>([]);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [blowStrength, setBlowStrength] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize candles array based on candleCount
  useEffect(() => {
    const count = Math.min(10, Math.max(1, candleCount));
    setLitCandles(new Array(count).fill(true));
  }, [candleCount]);

  const allOut = litCandles.length > 0 && litCandles.every((lit) => !lit);

  // Handle all candles blown
  useEffect(() => {
    if (allOut) {
      soundEngine.playCheerFanfare();
      if (onAllCandlesBlown) {
        onAllCandlesBlown();
      }
      stopMicListening();
    }
  }, [allOut]);

  // Blow out a single candle or tap candle to extinguish
  const extinguishCandle = (index: number) => {
    if (!litCandles[index]) return;
    soundEngine.playWhooshSound();
    setLitCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  const blowAllCandles = () => {
    soundEngine.playWhooshSound();
    setLitCandles((prev) => prev.map(() => false));
  };

  const relightCandles = () => {
    setLitCandles(new Array(litCandles.length).fill(true));
    setBlowStrength(0);
  };

  // Microphone blow detection logic using Web Audio API
  const startMicListening = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListeningMic(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume in low-mid frequencies typical for blowing air into mic
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length; // 0 - 255 scale
        const normalized = Math.min(100, Math.round((avg / 120) * 100));
        setBlowStrength(normalized);

        // High volume / wind blow threshold trigger
        if (normalized > 55) {
          // Blow out a candle or all
          setLitCandles((prev) => {
            const litIndexes = prev.map((lit, idx) => (lit ? idx : -1)).filter((idx) => idx !== -1);
            if (litIndexes.length === 0) return prev;
            // Extinguish random or next candle
            const nextToExtinguish = litIndexes[Math.floor(Math.random() * litIndexes.length)];
            const nextState = [...prev];
            nextState[nextToExtinguish] = false;
            soundEngine.playWhooshSound();
            return nextState;
          });
        }

        animFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (err: any) {
      console.error('Microphone error:', err);
      setMicError('Mic access denied or unavailable. You can tap candles to blow them out!');
      setIsListeningMic(false);
    }
  };

  const stopMicListening = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    setIsListeningMic(false);
    setBlowStrength(0);
  };

  useEffect(() => {
    return () => {
      stopMicListening();
    };
  }, []);

  // Theme styling for cake
  const getCakeStyles = () => {
    switch (theme) {
      case 'arcade':
        return {
          cakeTop: 'bg-pink-500 border-2 border-yellow-300 shadow-[4px_4px_0_#000]',
          cakeBase: 'bg-purple-600 border-2 border-yellow-300 shadow-[4px_4px_0_#000]',
          plate: 'bg-yellow-400 border-2 border-black shadow-[4px_4px_0_#000]',
          candleBg: 'bg-cyan-400 border border-black',
        };
      case 'romantic':
        return {
          cakeTop: 'bg-gradient-to-r from-pink-300 via-rose-300 to-pink-200 border-b border-rose-400/40 shadow-lg',
          cakeBase: 'bg-gradient-to-r from-rose-400 to-pink-500 shadow-xl',
          plate: 'bg-gradient-to-r from-slate-100 to-rose-100 border border-rose-200 shadow-md',
          candleBg: 'bg-gradient-to-t from-pink-400 to-rose-200',
        };
      case 'cyberpunk':
        return {
          cakeTop: 'bg-cyan-950 border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]',
          cakeBase: 'bg-slate-900 border border-pink-500 shadow-[0_0_15px_rgba(255,0,127,0.4)]',
          plate: 'bg-slate-950 border border-yellow-400 shadow-[0_0_10px_rgba(255,255,0,0.3)]',
          candleBg: 'bg-yellow-300 shadow-[0_0_10px_#f00]',
        };
      case 'luxury':
        return {
          cakeTop: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-400/50 shadow-xl',
          cakeBase: 'bg-gradient-to-r from-amber-900/60 via-slate-900 to-amber-950 border border-amber-500/40 shadow-2xl',
          plate: 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 border border-amber-400 shadow-lg',
          candleBg: 'bg-gradient-to-t from-amber-500 to-yellow-200',
        };
      default:
        return {
          cakeTop: 'bg-pink-400 border-b-2 border-pink-500 shadow-md',
          cakeBase: 'bg-amber-100 border border-amber-200 shadow-lg',
          plate: 'bg-slate-200 border border-slate-300 shadow-md',
          candleBg: 'bg-amber-300',
        };
    }
  };

  const style = getCakeStyles();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Mic Blow Control Banner */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        {enableMicBlow && (
          <button
            onClick={isListeningMic ? stopMicListening : startMicListening}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-all shadow-md ${
              isListeningMic
                ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {isListeningMic ? (
              <>
                <Mic className="h-4 w-4 animate-bounce" />
                <span>Blowing Air Detection Active! (Blow into mic)</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 text-emerald-400" />
                <span>Enable Mic to Blow Out Candles 🎙️</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={blowAllCandles}
          disabled={allOut}
          className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3.5 py-1.5 font-medium text-amber-300 hover:bg-amber-500/30 disabled:opacity-40 transition-colors border border-amber-500/30"
        >
          <Flame className="h-3.5 w-3.5" />
          <span>Tap to Blow All</span>
        </button>

        {allOut && (
          <button
            onClick={relightCandles}
            className="flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1.5 font-medium text-cyan-300 hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 animate-bounce"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Relight Candles</span>
          </button>
        )}
      </div>

      {/* Blow Intensity Bar (when mic active) */}
      {isListeningMic && (
        <div className="mb-3 w-48 rounded-full bg-slate-900/80 p-1 border border-slate-700">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-75"
            style={{ width: `${blowStrength}%` }}
          />
        </div>
      )}

      {micError && (
        <p className="mb-2 text-center text-xs text-amber-400/90">{micError}</p>
      )}

      {/* Birthday Cake Visual Presentation */}
      <div className="relative mt-2 flex flex-col items-center">
        {/* CANDLES ROW */}
        <div className="z-10 flex items-end justify-center gap-2 px-4">
          {litCandles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => extinguishCandle(idx)}
              className="group relative flex cursor-pointer flex-col items-center transition-transform hover:scale-110"
              title="Click/Tap to extinguish candle"
            >
              {/* Flame or Smoke */}
              <div className="relative h-9 w-6 flex items-center justify-center">
                {isLit ? (
                  <div className="relative flex flex-col items-center">
                    {/* Outer Glow */}
                    <div className="absolute h-8 w-8 rounded-full bg-amber-400/30 blur-md animate-pulse" />
                    {/* Inner Flame */}
                    <div className="h-5 w-3 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white animate-bounce shadow-[0_0_10px_#ff0]" />
                  </div>
                ) : (
                  /* Rising Smoke Particle */
                  <div className="flex flex-col items-center animate-fade-out">
                    <div className="h-3 w-1 rounded-full bg-slate-400/70 blur-[1px] animate-ping" />
                    <span className="text-[10px] text-slate-400">💨</span>
                  </div>
                )}
              </div>

              {/* Candle Wick */}
              <div className="h-2 w-0.5 bg-slate-800" />

              {/* Candle Body */}
              <div
                className={`h-12 w-3 rounded-t-sm shadow-inner transition-colors ${style.candleBg} relative overflow-hidden`}
              >
                {/* Stripe pattern */}
                <div className="absolute inset-0 bg-white/20 transform -skew-y-12" />
              </div>
            </div>
          ))}
        </div>

        {/* CAKE LAYER 1: TOP ICING */}
        <div
          className={`relative h-14 w-60 rounded-t-3xl ${style.cakeTop} flex items-center justify-center -mt-1`}
        >
          {/* Decorative sprinkles/frosting drips */}
          <div className="absolute top-0 left-0 right-0 flex justify-around px-2">
            {litCandles.map((_, i) => (
              <div
                key={i}
                className="h-3 w-4 rounded-b-full bg-white/40 shadow-sm"
              />
            ))}
          </div>
          <span className="text-xs font-semibold tracking-wider text-slate-200/90 uppercase drop-shadow-sm flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            {allOut ? 'WISH GRANTED! 🎉' : 'MAKE A WISH'}
          </span>
        </div>

        {/* CAKE LAYER 2: MAIN BODY */}
        <div
          className={`relative h-20 w-72 rounded-b-lg ${style.cakeBase} flex items-center justify-center shadow-2xl border-t border-white/20`}
        >
          {/* Layer Cream Line */}
          <div className="absolute inset-x-0 h-2 bg-white/30 backdrop-blur-xs top-1/2 -translate-y-1/2" />
          <span className="text-sm font-extrabold tracking-widest text-amber-200/90 drop-shadow">
            {litCandles.filter(Boolean).length} {litCandles.filter(Boolean).length === 1 ? 'Candle' : 'Candles'} Lit
          </span>
        </div>

        {/* CAKE PLATE */}
        <div className={`h-4 w-80 rounded-full ${style.plate} -mt-1 shadow-2xl`} />
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        {allOut
          ? '✨ All candles extinguished! May your sweetest wish come true!'
          : enableMicBlow
          ? '💡 Tip: Blow into your microphone or tap each candle flame!'
          : '💡 Tip: Tap the candles to extinguish them!'}
      </p>
    </div>
  );
};
