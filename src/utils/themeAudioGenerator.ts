/**
 * Procedural Audio Engine for Theme Background Music
 * Renders theme-specific looping audio tracks into WAV Blobs
 * and feeds them to standard HTML5 Audio objects (new Audio(blobUrl))
 */

import { ThemeId } from '../types/card';

// Cache generated blob URLs so they are created once per session
const audioCache = new Map<string, string>();

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Encodes an AudioBuffer into standard 16-bit PCM WAV Blob
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const numSamples = buffer.length * numChannels;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * bytesPerSample;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channel samples
  let offset = 44;
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channels[channel][i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Piano Note Synthesizer with natural acoustic harmonics
 */
function playPianoNote(
  ctx: BaseAudioContext,
  freq: number,
  time: number,
  duration: number,
  velocity: number = 0.5
) {
  // Harmonic overtone series for rich acoustic piano sound
  const harmonics = [
    { mult: 1, gain: 0.6 },
    { mult: 2, gain: 0.25 },
    { mult: 3, gain: 0.1 },
    { mult: 4, gain: 0.05 },
  ];

  harmonics.forEach(({ mult, gain: hGain }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = mult === 1 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq * mult, time);

    const peak = velocity * hGain;
    gainNode.gain.setValueAtTime(0.001, time);
    // Quick piano hammer attack
    gainNode.gain.linearRampToValueAtTime(peak, time + 0.015);
    // Natural acoustic piano exponential decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  });
}

/**
 * Retro 8-bit Synth Note for Arcade theme
 */
function playRetroSynthNote(
  ctx: BaseAudioContext,
  freq: number,
  time: number,
  duration: number,
  type: OscillatorType = 'square',
  volume: number = 0.2
) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, time);
  filter.frequency.exponentialRampToValueAtTime(800, time + duration);

  gainNode.gain.setValueAtTime(volume, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + duration);
}

/**
 * Generates an audio URL for the specified theme
 */
export async function getThemeAudioUrl(theme: ThemeId | string): Promise<string> {
  if (audioCache.has(theme)) {
    return audioCache.get(theme)!;
  }

  const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!OfflineCtx) {
    return '';
  }

  const sampleRate = 44100;
  let duration = 6.4; // seconds of seamless loop

  if (theme === 'romantic') {
    // ROMANTIC THEME: Emotional Piano Arpeggio & Strings Progression
    duration = 8.0;
    const offlineCtx = new OfflineCtx(2, sampleRate * duration, sampleRate);

    // Warm Ambient String Pad (C - Am - F - G)
    const padChords = [
      { time: 0.0, freqs: [130.81, 164.81, 196.0, 246.94] }, // Cmaj7
      { time: 2.0, freqs: [110.0, 130.81, 164.81, 220.0] },  // Am7
      { time: 4.0, freqs: [87.31, 130.81, 174.61, 220.0] },  // Fmaj7
      { time: 6.0, freqs: [98.0, 146.83, 196.0, 246.94] },   // Gsus4
    ];

    padChords.forEach(({ time, freqs }) => {
      freqs.forEach((f) => {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.04, time + 0.5);
        gain.gain.linearRampToValueAtTime(0.03, time + 1.6);
        gain.gain.linearRampToValueAtTime(0.001, time + 2.0);

        osc.connect(gain);
        gain.connect(offlineCtx.destination);
        osc.start(time);
        osc.stop(time + 2.0);
      });
    });

    // Romantic Grand Piano Arpeggiated Notes (Heartfelt, melodic Chopin/Ludovico style)
    const pianoNotes = [
      // Bar 1: C - E - G - B - C - E
      { time: 0.0, freq: 261.63, dur: 1.4, vel: 0.35 },
      { time: 0.35, freq: 329.63, dur: 1.2, vel: 0.3 },
      { time: 0.7, freq: 392.0, dur: 1.0, vel: 0.32 },
      { time: 1.05, freq: 493.88, dur: 0.9, vel: 0.38 },
      { time: 1.4, freq: 523.25, dur: 0.8, vel: 0.4 },
      { time: 1.75, freq: 659.25, dur: 0.7, vel: 0.32 },

      // Bar 2: A - C - E - G - A - C
      { time: 2.0, freq: 220.0, dur: 1.4, vel: 0.35 },
      { time: 2.35, freq: 261.63, dur: 1.2, vel: 0.3 },
      { time: 2.7, freq: 329.63, dur: 1.0, vel: 0.32 },
      { time: 3.05, freq: 392.0, dur: 0.9, vel: 0.38 },
      { time: 3.4, freq: 440.0, dur: 0.8, vel: 0.4 },
      { time: 3.75, freq: 523.25, dur: 0.7, vel: 0.32 },

      // Bar 3: F - A - C - E - F - A
      { time: 4.0, freq: 174.61, dur: 1.4, vel: 0.35 },
      { time: 4.35, freq: 220.0, dur: 1.2, vel: 0.3 },
      { time: 4.7, freq: 261.63, dur: 1.0, vel: 0.32 },
      { time: 5.05, freq: 329.63, dur: 0.9, vel: 0.38 },
      { time: 5.4, freq: 349.23, dur: 0.8, vel: 0.4 },
      { time: 5.75, freq: 440.0, dur: 0.7, vel: 0.32 },

      // Bar 4: G - B - D - F - G - B
      { time: 6.0, freq: 196.0, dur: 1.4, vel: 0.35 },
      { time: 6.35, freq: 246.94, dur: 1.2, vel: 0.3 },
      { time: 6.7, freq: 293.66, dur: 1.0, vel: 0.32 },
      { time: 7.05, freq: 349.23, dur: 0.9, vel: 0.36 },
      { time: 7.4, freq: 392.0, dur: 0.8, vel: 0.38 },
      { time: 7.75, freq: 493.88, dur: 0.7, vel: 0.3 },
    ];

    pianoNotes.forEach((n) => {
      playPianoNote(offlineCtx, n.freq, n.time, n.dur, n.vel);
    });

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBlob = audioBufferToWav(renderedBuffer);
    const blobUrl = URL.createObjectURL(wavBlob);
    audioCache.set(theme, blobUrl);
    return blobUrl;
  } else if (theme === 'arcade') {
    // ARCADE THEME: Classic 8-Bit Chiptune Retro Synth Loop (130 BPM)
    duration = 5.9;
    const offlineCtx = new OfflineCtx(2, sampleRate * duration, sampleRate);

    // Chiptune Square Lead Melody
    const synthMelody = [
      { t: 0.0, f: 523.25, d: 0.16 }, // C5
      { t: 0.18, f: 523.25, d: 0.16 },
      { t: 0.36, f: 659.25, d: 0.16 }, // E5
      { t: 0.54, f: 783.99, d: 0.22 }, // G5
      { t: 0.82, f: 659.25, d: 0.16 },
      { t: 1.0, f: 783.99, d: 0.16 },
      { t: 1.18, f: 1046.5, d: 0.3 }, // C6

      { t: 1.5, f: 880.0, d: 0.16 },  // A5
      { t: 1.68, f: 659.25, d: 0.16 },
      { t: 1.86, f: 783.99, d: 0.22 },
      { t: 2.14, f: 587.33, d: 0.16 },
      { t: 2.32, f: 523.25, d: 0.24 },

      { t: 2.7, f: 587.33, d: 0.16 }, // D5
      { t: 2.88, f: 659.25, d: 0.16 },
      { t: 3.06, f: 698.46, d: 0.22 }, // F5
      { t: 3.34, f: 783.99, d: 0.28 }, // G5
      { t: 3.7, f: 880.0, d: 0.16 },
      { t: 3.88, f: 987.77, d: 0.2 },
      { t: 4.15, f: 1046.5, d: 0.4 },

      { t: 4.7, f: 783.99, d: 0.2 },
      { t: 5.0, f: 659.25, d: 0.2 },
      { t: 5.3, f: 523.25, d: 0.35 },
    ];

    synthMelody.forEach((m) => {
      playRetroSynthNote(offlineCtx, m.f, m.t, m.d, 'square', 0.12);
    });

    // 8-Bit Bouncy Bassline (Triangle)
    const bassline = [
      { t: 0.0, f: 130.81, d: 0.2 },
      { t: 0.36, f: 130.81, d: 0.18 },
      { t: 0.72, f: 164.81, d: 0.2 },
      { t: 1.08, f: 196.0, d: 0.2 },
      { t: 1.44, f: 110.0, d: 0.2 },
      { t: 1.8, f: 110.0, d: 0.18 },
      { t: 2.16, f: 130.81, d: 0.2 },
      { t: 2.52, f: 164.81, d: 0.2 },
      { t: 2.88, f: 146.83, d: 0.2 },
      { t: 3.24, f: 146.83, d: 0.18 },
      { t: 3.6, f: 196.0, d: 0.2 },
      { t: 3.96, f: 246.94, d: 0.2 },
      { t: 4.32, f: 130.81, d: 0.2 },
      { t: 4.68, f: 196.0, d: 0.2 },
      { t: 5.04, f: 261.63, d: 0.3 },
    ];

    bassline.forEach((b) => {
      playRetroSynthNote(offlineCtx, b.f, b.t, b.d, 'triangle', 0.2);
    });

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBlob = audioBufferToWav(renderedBuffer);
    const blobUrl = URL.createObjectURL(wavBlob);
    audioCache.set(theme, blobUrl);
    return blobUrl;
  } else {
    // DEFAULT / AMBIENT CELEBRATION (Galaxy, Cyberpunk, Luxury, Pastel)
    duration = 6.4;
    const offlineCtx = new OfflineCtx(2, sampleRate * duration, sampleRate);

    // Warm chord progression
    const generalNotes = [
      { time: 0.0, freq: 329.63, dur: 1.8, vel: 0.3 },
      { time: 0.8, freq: 392.0, dur: 1.6, vel: 0.3 },
      { time: 1.6, freq: 523.25, dur: 2.0, vel: 0.35 },
      { time: 3.2, freq: 440.0, dur: 1.8, vel: 0.3 },
      { time: 4.0, freq: 392.0, dur: 1.6, vel: 0.3 },
      { time: 4.8, freq: 329.63, dur: 1.8, vel: 0.3 },
    ];

    generalNotes.forEach((n) => {
      playPianoNote(offlineCtx, n.freq, n.time, n.dur, n.vel);
    });

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBlob = audioBufferToWav(renderedBuffer);
    const blobUrl = URL.createObjectURL(wavBlob);
    audioCache.set(theme, blobUrl);
    return blobUrl;
  }
}

export function getThemeTrackTitle(theme: ThemeId | string): { title: string; icon: string } {
  switch (theme) {
    case 'romantic':
      return { title: 'Nocturne Piano Romance', icon: '🎹' };
    case 'arcade':
      return { title: '8-Bit Retro Synth Chiptune', icon: '👾' };
    case 'cyberpunk':
      return { title: 'Neon Darksynth Pulse', icon: '⚡' };
    case 'galaxy':
      return { title: 'Celestial Star Ambient', icon: '✨' };
    case 'pastel':
      return { title: 'Lo-Fi Chill Warmth', icon: '☕' };
    case 'luxury':
      return { title: 'Grand Royal Waltz', icon: '🎻' };
    default:
      return { title: 'Celebration Harmony', icon: '🎵' };
  }
}
