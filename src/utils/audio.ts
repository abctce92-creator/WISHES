/**
 * Web Audio API synthesizer for serene birthday chimes and sparkle sound effects.
 * 100% self-contained, offline-ready, no external MP3 dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlayingMelody: boolean = false;
  private activeTimeouts: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMelody();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlayingMelody(): boolean {
    return this.isPlayingMelody;
  }

  // Sparkling celestial bell chime on user interaction
  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * (1 + (Math.random() * 0.05)), now + idx * 0.05);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.045 / (idx + 1), now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + idx * 0.05 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.0);
      });
    } catch {
      // Audio playback safety
    }
  }

  // Soft fluttering chime when butterflies take flight
  public playFlutterChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Arpeggiated fluttering shimmer
      const chord = [1318.5, 1567.98, 1760.0, 2093.0, 2637.0]; // E6, G6, A6, C7, E7
      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + i * 0.035;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.035, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch {
      // Audio playback safety
    }
  }

  // Soft romantic music-box tone for individual note
  private playMusicBoxNote(freq: number, startTime: number, duration: number = 1.2) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    oscHarmonic.type = 'triangle';

    osc.frequency.setValueAtTime(freq, startTime);
    oscHarmonic.frequency.setValueAtTime(freq * 2, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    oscHarmonic.start(startTime);
    osc.stop(startTime + duration);
    oscHarmonic.stop(startTime + duration);
  }

  // Sweet music box rendition of Happy Birthday melody
  public playBirthdayMelody(onComplete?: () => void) {
    if (this.isMuted) return;
    this.stopMelody();
    this.initContext();
    if (!this.ctx) return;

    this.isPlayingMelody = true;

    // Frequencies (Hz): Happy Birthday in Key of F
    // C4, C4, D4, C4, F4, E4
    // C4, C4, D4, C4, G4, F4
    // C4, C4, C5, A4, F4, E4, D4
    // Bb4, Bb4, A4, F4, G4, F4
    const notes = [
      { f: 523.25, d: 0.35, pause: 0.4 },  // C5
      { f: 523.25, d: 0.35, pause: 0.4 },  // C5
      { f: 587.33, d: 0.7, pause: 0.8 },   // D5
      { f: 523.25, d: 0.7, pause: 0.8 },   // C5
      { f: 698.46, d: 0.7, pause: 0.8 },   // F5
      { f: 659.25, d: 1.2, pause: 1.4 },   // E5

      { f: 523.25, d: 0.35, pause: 0.4 },  // C5
      { f: 523.25, d: 0.35, pause: 0.4 },  // C5
      { f: 587.33, d: 0.7, pause: 0.8 },   // D5
      { f: 523.25, d: 0.7, pause: 0.8 },   // C5
      { f: 783.99, d: 0.7, pause: 0.8 },   // G5
      { f: 698.46, d: 1.2, pause: 1.4 },   // F5

      { f: 523.25, d: 0.35, pause: 0.4 },  // C5
      { f: 523.25, d: 0.35, pause: 0.4 },  // C5
      { f: 1046.50, d: 0.7, pause: 0.8 }, // C6
      { f: 880.00, d: 0.7, pause: 0.8 },  // A5
      { f: 698.46, d: 0.7, pause: 0.8 },  // F5
      { f: 659.25, d: 0.7, pause: 0.8 },  // E5
      { f: 587.33, d: 1.2, pause: 1.4 },  // D5

      { f: 932.33, d: 0.35, pause: 0.4 },  // Bb5
      { f: 932.33, d: 0.35, pause: 0.4 },  // Bb5
      { f: 880.00, d: 0.7, pause: 0.8 },   // A5
      { f: 698.46, d: 0.7, pause: 0.8 },   // F5
      { f: 783.99, d: 0.7, pause: 0.8 },   // G5
      { f: 698.46, d: 1.6, pause: 2.0 },   // F5
    ];

    let accumulatedTime = 0;
    const now = this.ctx.currentTime + 0.1;

    notes.forEach((note) => {
      const playTime = now + accumulatedTime;
      const tid = window.setTimeout(() => {
        if (!this.isMuted && this.isPlayingMelody) {
          this.playMusicBoxNote(note.f, this.ctx?.currentTime || playTime, note.d * 1.5);
        }
      }, accumulatedTime * 1000);
      this.activeTimeouts.push(tid);
      accumulatedTime += note.pause * 0.85;
    });

    const finishTid = window.setTimeout(() => {
      this.isPlayingMelody = false;
      if (onComplete) onComplete();
    }, accumulatedTime * 1000 + 500);
    this.activeTimeouts.push(finishTid);
  }

  public stopMelody() {
    this.isPlayingMelody = false;
    this.activeTimeouts.forEach((tid) => clearTimeout(tid));
    this.activeTimeouts = [];
  }
}

export const soundEngine = new SoundEngine();
