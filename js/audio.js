// audio.js - Lógica común para controlar el audio
class AudioController {
  constructor(audioId, buttonId, sliderId) {
    this.audio = document.getElementById(audioId) || null;
    this.playButton = document.getElementById(buttonId) || document.createElement('button');
    this.volumeSlider = document.getElementById(sliderId) || document.createElement('input');
    this.playing = false;

    // Cargar volumen guardado
    const savedVol = localStorage.getItem('safeReality.volume') || '0.6';
    try{
      this.volumeSlider.value = savedVol;
    }catch(e){}
    if(this.audio) this.audio.volume = parseFloat(savedVol);

    // Eventos
  if(this.playButton) this.playButton.addEventListener('click', () => this.togglePlay());
  if(this.volumeSlider) this.volumeSlider.addEventListener('input', () => this.updateVolume());
    
    // Estado visual inicial
    this.updatePlayButton();
  }

  async play() {
    try {
      if(!this.audio) throw new Error('No audio element');
      if(!this.audio.src) throw new Error('Audio src empty');
      await this.audio.play();
      this.playing = true;
      this.updatePlayButton();
    } catch(e) {
      // Fail quietly and update UI; useful in file:// or missing resource scenarios
      // Log helpful message for debugging
      console.log('Audio: reproducción no disponible o bloqueada —', e && e.message ? e.message : e);
      this.playing = false;
      this.updatePlayButton();
    }
  }

  pause() {
    if(this.audio) this.audio.pause();
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
    if(this.audio) this.audio.volume = volume;
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
    if(this.audio) this.audio.currentTime = 0;
  }
}