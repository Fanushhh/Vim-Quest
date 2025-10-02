// Sound Manager for achievement sounds
// Uses Web Audio API to generate simple sounds

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playRetroSound() {
    if (!this.enabled) return;
    this.init();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Retro 8-bit style sound
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  playEpicSound() {
    if (!this.enabled) return;
    this.init();

    // Epic orchestral-style sound (multiple tones)
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C chord
    const duration = 0.8;

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      const startTime = this.audioContext.currentTime + (index * 0.1);
      gainNode.gain.setValueAtTime(0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  playSoundForPack(soundPack) {
    switch (soundPack) {
      case 'sound_pack_retro':
        this.playRetroSound();
        break;
      case 'sound_pack_epic':
        this.playEpicSound();
        break;
      default:
        // No sound
        break;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export default new SoundManager();
