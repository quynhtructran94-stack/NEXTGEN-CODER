
class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private isMusicStarted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1, fadeOut: boolean = true) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    if (fadeOut) {
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(800, 'sine', 0.05, 0.04);
  }

  playSuccess() {
    // Âm thanh thành công vui vẻ
    this.playTone(523.25, 'square', 0.1, 0.04); // C5
    setTimeout(() => this.playTone(659.25, 'square', 0.1, 0.04), 80); // E5
    setTimeout(() => this.playTone(783.99, 'square', 0.1, 0.04), 160); // G5
    setTimeout(() => this.playTone(1046.50, 'square', 0.2, 0.04), 240); // C6
  }

  playVictory() {
    // Fanfare chiến thắng rực rỡ
    const melody = [523.25, 523.25, 523.25, 698.46, 880.00]; // C5, C5, C5, F5, A5
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'square', 0.3, 0.06), i * 150);
    });
  }

  playError() {
    this.playTone(220, 'sawtooth', 0.2, 0.06);
    setTimeout(() => this.playTone(110, 'sawtooth', 0.3, 0.06), 100);
  }

  playLevelUp() {
    const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    scale.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.15, 0.05), i * 100);
    });
  }

  startMusic() {
    this.init();
    if (this.isMusicStarted) return;
    this.isMusicStarted = true;

    if (!this.ctx) return;
    
    // Nhịp điệu vui tươi sống động (C-Major Pentatonic)
    const melodyNotes = [523.25, 587.33, 659.25, 783.99, 880.00];
    const bassNotes = [130.81, 146.83, 164.81, 196.00];
    let step = 0;

    this.musicInterval = window.setInterval(() => {
      if (this.ctx?.state === 'suspended') return;
      
      // Trống kick ảo
      if (step % 4 === 0) {
        this.playTone(60, 'sine', 0.2, 0.03, true);
      }
      
      // Bassline
      if (step % 2 === 0) {
        const bass = bassNotes[Math.floor(step / 4) % bassNotes.length];
        this.playTone(bass, 'triangle', 0.3, 0.02, true);
      }
      
      // Melody sống động
      if (Math.random() > 0.4) {
        const freq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
        this.playTone(freq, 'sine', 0.2, 0.015, true);
      }
      
      step++;
    }, 250); // Nhịp độ nhanh hơn (240 BPM / 4)
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
      this.isMusicStarted = false;
    }
  }

  toggleMusic(active: boolean) {
    if (active) this.startMusic();
    else this.stopMusic();
  }
}

export const sound = new SoundEngine();
