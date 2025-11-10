// audio.js - Lógica común para controlar el audio
class AudioController {
  constructor(audioId, buttonId, sliderId) {
    this.audio = document.getElementById(audioId);
    this.playButton = document.getElementById(buttonId);
    this.volumeSlider = document.getElementById(sliderId);
    this.playing = false;

    // Cargar volumen guardado
    const savedVol = localStorage.getItem('safeReality.volume') || '0.6';
    this.volumeSlider.value = savedVol;
    this.audio.volume = parseFloat(savedVol);

    // Eventos
    this.playButton.addEventListener('click', () => this.togglePlay());
    this.volumeSlider.addEventListener('input', () => this.updateVolume());
    
    // Estado visual inicial
    this.updatePlayButton();
  }

  async play() {
    try {
      await this.audio.play();
      this.playing = true;
      this.updatePlayButton();
    } catch(e) {
      console.log('Audio bloqueado, necesita interacción del usuario');
      this.playing = false;
      this.updatePlayButton();
    }
  }

  pause() {
    this.audio.pause();
    this.playing = false;
    this.updatePlayButton();
  }

  togglePlay() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateVolume() {
    const volume = parseFloat(this.volumeSlider.value);
    this.audio.volume = volume;
    localStorage.setItem('safeReality.volume', volume);
    // Si subimos el volumen de 0, intentamos reproducir
    if (volume > 0 && !this.playing) {
      this.play();
    }
  }

  updatePlayButton() {
    this.playButton.textContent = this.playing ? '⏸' : '▶';
    this.playButton.classList.toggle('muted', !this.playing);
  }

  stop() {
    this.pause();
    this.audio.currentTime = 0;
  }
}