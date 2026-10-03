/**
 * Web Audio API Audio Synthesizer
 * Generates custom synthesized chiptune & celebratory background tracks + SFX
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicLoopTimer: number | null = null;
  private activeTheme: string = 'none';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMusic();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  /** Subtle Balloon Tap / Touch SFX: Gentle rubbery acoustic pop-tap */
  public playBalloonTapSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Gentle tonal rubber resonance (sine wave pitch envelope)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      oscGain.gain.setValueAtTime(0.2, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);

      // 2. Subtle soft air puff / latex click
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.1, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {
      console.error(e);
    }
  }

  /** Balloon Pop SFX: Sudden pitch drop burst + noise */
  public playPopSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.error(e);
    }
  }

  /** Candle Blow Smoke Whoosh SFX */
  public playWhooshSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.error(e);
    }
  }

  /** Celebration Level Up / All Candles Blown Fanfare */
  public playCheerFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.1);

        gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + index * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + index * 0.1);
        osc.stop(this.ctx!.currentTime + index * 0.1 + 0.3);
      });
    } catch (e) {
      console.error(e);
    }
  }

  /** Unbox Gift Magic Chime */
  public playUnboxChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const freqs = [587.33, 739.99, 880, 1174.66, 1479.98];
      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + i * 0.06);

        gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + i * 0.06);
        osc.stop(this.ctx!.currentTime + i * 0.06 + 0.4);
      });
    } catch (e) {
      console.error(e);
    }
  }

  /** Scratch Card Foil Sound */
  public playScratchSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150 + Math.random() * 100, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.error(e);
    }
  }

  // --- BACKGROUND SYNTH MUSIC LOOPS ---

  public playMusicTrack(track: string) {
    this.stopMusic();
    if (this.isMuted || track === 'none') return;
    this.initCtx();
    if (!this.ctx) return;

    this.activeTheme = track;

    if (track === 'arcade') {
      this.startArcadeLoop();
    } else if (track === 'romantic') {
      this.startRomanticLoop();
    } else if (track === 'party') {
      this.startPartyLoop();
    } else if (track === 'cosmic') {
      this.startCosmicLoop();
    } else if (track === 'lofi') {
      this.startLofiLoop();
    }
  }

  public stopMusic() {
    if (this.musicLoopTimer) {
      window.clearInterval(this.musicLoopTimer);
      this.musicLoopTimer = null;
    }
    this.activeTheme = 'none';
  }

  private startArcadeLoop() {
    // 8-bit catchy arpeggio sequence
    const notes = [
      261.63, 329.63, 392.00, 523.25,
      349.23, 440.00, 523.25, 698.46,
      392.00, 493.88, 587.33, 783.99,
      523.25, 392.00, 329.63, 261.63
    ];
    let step = 0;

    const playNote = () => {
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(notes[step % notes.length], this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);

      step++;
    };

    playNote();
    this.musicLoopTimer = window.setInterval(playNote, 150);
  }

  private startRomanticLoop() {
    // Soft acoustic sine arpeggio
    const chordSeq = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G7
    ];
    let chordIdx = 0;
    let noteIdx = 0;

    const playStep = () => {
      if (!this.ctx || this.isMuted) return;
      const chord = chordSeq[chordIdx % chordSeq.length];
      const freq = chord[noteIdx % chord.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);

      noteIdx++;
      if (noteIdx >= chord.length * 2) {
        noteIdx = 0;
        chordIdx++;
      }
    };

    playStep();
    this.musicLoopTimer = window.setInterval(playStep, 220);
  }

  private startPartyLoop() {
    // Cheerful upbeat party synth
    const melody = [523.25, 523.25, 659.25, 523.25, 783.99, 659.25, 523.25, 587.33];
    let step = 0;

    const playStep = () => {
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(melody[step % melody.length], this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);

      step++;
    };

    playStep();
    this.musicLoopTimer = window.setInterval(playStep, 180);
  }

  private startCosmicLoop() {
    // Deep ethereal space pad
    const freqs = [146.83, 220.00, 293.66, 440.00, 587.33];
    let idx = 0;

    const playPad = () => {
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freqs[idx % freqs.length], this.ctx.currentTime);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.8);

      idx++;
    };

    playPad();
    this.musicLoopTimer = window.setInterval(playPad, 900);
  }

  private startLofiLoop() {
    // Relaxed warm lofi keys
    const chords = [
      [261.63, 329.63, 392.00],
      [293.66, 349.23, 440.00],
      [220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66]
    ];
    let cIdx = 0;

    const playLofi = () => {
      if (!this.ctx || this.isMuted) return;
      const currentChord = chords[cIdx % chords.length];

      currentChord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        gain.gain.setValueAtTime(0.04, this.ctx!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start();
        osc.stop(this.ctx!.currentTime + 0.6);
      });

      cIdx++;
    };

    playLofi();
    this.musicLoopTimer = window.setInterval(playLofi, 600);
  }
}

export const soundEngine = new SoundEngine();
