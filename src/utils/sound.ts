// Web Audio API Synthesizer & Web Speech API for Elementary School Kids

class SoundManager {
  private ctx: AudioContext | null = null;
  public sfxEnabled: boolean = true;
  public bgmEnabled: boolean = true;
  private bgmOscs: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft bell chime for correct choices and lights (부드러운 종소리)
  public playBellChime() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Bell fundamental and harmonic
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Robot chirp for Kami
  public playRobotBeep() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // ignore
    }
  }

  // Gentle emergency signal for intro
  public playEmergencySignal() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [600, 800, 600, 800].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + i * 0.18;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch {
      // ignore
    }
  }

  // Soft footsteps / movement tap
  public playStepSound() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  // Gentle fanfare / celebration chords
  public playCelebrationFanfare() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const notes = [
        { f: 523.25, t: 0.0 }, // C5
        { f: 659.25, t: 0.15 }, // E5
        { f: 783.99, t: 0.3 }, // G5
        { f: 1046.5, t: 0.45 }, // C6
        { f: 1318.51, t: 0.65 }, // E6
      ];

      notes.forEach(({ f, t }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 1.2);
      });
    } catch {
      // ignore
    }
  }

  // Warm gentle ambient background music loop
  public startAmbientBgm() {
    if (!this.bgmEnabled || this.isBgmPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      const baseFreqs = [220, 261.63, 329.63]; // A minor chord (warm twilight)
      this.bgmOscs = baseFreqs.map((freq) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        osc.connect(this.bgmGain!);
        osc.start();
        return osc;
      });

      this.isBgmPlaying = true;
    } catch {
      // ignore
    }
  }

  public stopAmbientBgm() {
    if (!this.isBgmPlaying) return;
    try {
      this.bgmOscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.bgmOscs = [];
      this.isBgmPlaying = false;
    } catch {
      // ignore
    }
  }

  public toggleBgm(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startAmbientBgm();
    } else {
      this.stopAmbientBgm();
    }
    return this.bgmEnabled;
  }

  public toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }
}

export const sound = new SoundManager();

// Korean Text-to-Speech (TTS) Reader for 1st & 2nd grade children
export function speakKorean(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean text for natural speech (remove markdown symbols)
    const cleanText = text.replace(/[*#_~`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9; // Slightly slower, clear voice for 1st-2nd graders
    utterance.pitch = 1.1; // Gentle, friendly tone

    // Try to choose a high quality Korean voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang.startsWith('ko') && !v.name.includes('Google') === false) || voices.find((v) => v.lang.startsWith('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEnd) onEnd();
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
