// Sound Manager for achievement sounds
// Uses Web Audio API to generate simple sounds

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext initialized, state:', this.audioContext.state);
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
      }
    }
  }

  // Call this method on user interaction to ensure audio context is ready
  async ensureAudioContext() {
    this.init();
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('AudioContext resumed, state:', this.audioContext.state);
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
      }
    }
  }

  async playRetroSound() {
    if (!this.enabled) return;
    this.init();

    try {
      // Resume audio context if suspended (needed for autoplay policies)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Retro 8-bit style sound - play 3 ascending notes
      oscillator.type = 'square';
      const now = this.audioContext.currentTime;

      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      oscillator.start(now);
      oscillator.stop(now + 0.4);
    } catch (error) {
      console.error('Error playing retro sound:', error);
    }
  }

  async playEpicSound() {
    if (!this.enabled) return;
    this.init();

    try {
      // Resume audio context if suspended (needed for autoplay policies)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Epic orchestral-style sound (multiple tones)
      const frequencies = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C chord
      const duration = 0.8;
      const now = this.audioContext.currentTime;

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        const startTime = now + (index * 0.1);
        gainNode.gain.setValueAtTime(0.075, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      console.error('Error playing epic sound:', error);
    }
  }

  async playSoundForPack(soundPack) {
    if (!soundPack) return;

    console.log('Playing sound for pack:', soundPack);

    switch (soundPack) {
      case 'sound_pack_retro':
        await this.playRetroSound();
        break;
      case 'sound_pack_epic':
        await this.playEpicSound();
        break;
      default:
        console.warn('Unknown sound pack:', soundPack);
        break;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export default new SoundManager();
