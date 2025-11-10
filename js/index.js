// start.js - Lógica específica de la pantalla de inicio
const startButton = document.getElementById('startButton');

// Inicializar controlador de audio
const audioController = new AudioController('startAudio', 'playButton', 'volume');

// Intentar reproducir al cargar
audioController.play();

// Al hacer clic en Iniciar
startButton.addEventListener('click', () => {
  // Detener audio y navegar al patio
  audioController.stop();
  window.location.href = 'patio.html';
});
