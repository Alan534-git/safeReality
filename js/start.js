// start.js - lógica para la pantalla de inicio
const startAudio = document.getElementById('startAudio');
const startButton = document.getElementById('startButton');
const volumeSlider = document.getElementById('volume');

// leer volumen guardado o usar 0.6 por defecto
const savedVol = localStorage.getItem('safeReality.volume');
if(savedVol !== null){
  volumeSlider.value = savedVol;
}

startAudio.volume = parseFloat(volumeSlider.value);

// intentar reproducir (puede bloquear hasta interacción)
startAudio.play().catch(()=>{});

volumeSlider.addEventListener('input', ()=>{
  const v = parseFloat(volumeSlider.value);
  startAudio.volume = v;
  localStorage.setItem('safeReality.volume', v);
});

startButton.addEventListener('click', ()=>{
  // guardar volumen y navegar al patio
  localStorage.setItem('safeReality.volume', parseFloat(volumeSlider.value));
  try{ startAudio.pause(); startAudio.currentTime = 0; }catch(e){}
  // navegar a la página del patio
  window.location.href = 'patio.html';
});
