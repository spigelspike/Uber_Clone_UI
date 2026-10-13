// Pure Web Audio API chime generator for Uber actions
// Zero external files, zero latency, works across all browsers
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = typeof window !== 'undefined'
      ? localStorage.getItem('uber-sound-enabled') !== 'false'
      : true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  get isEnabled() {
    return this.enabled;
  }

  setEnabled(val) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('uber-sound-enabled', val ? 'true' : 'false');
    }
  }

  toggleSound() {
    this.setEnabled(!this.enabled);
    if (this.enabled) {
      this.playChime('tap');
    }
    return this.enabled;
  }

  playChime(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (type === 'confirm') {
        // Mellow ascending two-tone C5 -> G5
        this._playTone(523.25, now, 0.28, 'sine', 0.2);
        this._playTone(783.99, now + 0.16, 0.45, 'sine', 0.25);
      } else if (type === 'arrived') {
        // High pleasant arrival alert E5 -> B5 -> E6
        this._playTone(659.25, now, 0.12, 'sine', 0.25);
        this._playTone(987.77, now + 0.14, 0.16, 'sine', 0.25);
        this._playTone(1318.51, now + 0.32, 0.55, 'sine', 0.28);
      } else if (type === 'complete') {
        // Major celebratory chord resolution
        this._playTone(440.0, now, 0.35, 'sine', 0.18);
        this._playTone(554.37, now + 0.08, 0.42, 'sine', 0.2);
        this._playTone(659.25, now + 0.18, 0.52, 'sine', 0.22);
        this._playTone(880.0, now + 0.28, 0.75, 'sine', 0.25);
      } else if (type === 'tap') {
        // Crisp subtle click
        this._playTone(880, now, 0.04, 'triangle', 0.08);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  _playTone(freq, startTime, duration, type = 'sine', volume = 0.2) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}

export const sound = new SoundEngine();
