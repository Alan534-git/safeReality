// patio.js - lógica del patio y el juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Elementos UI
const patioAudio = document.getElementById('patioAudio');
const volumeSlider = document.getElementById('volume');
const houseDialog = document.getElementById('houseDialog');
const closeDialog = document.getElementById('closeDialog');

// Player
const player = { x: 100, y: 100, r: 14, speed: 210, color: '#ffd54f' };
const keys = {};

// Patio y objetos
const trees = [];
const house = { x: 700, y: 220, w: 160, h: 120 };

// Generar algunos árboles aleatorios dentro del patio
function generateTrees(){
  trees.length = 0;
  const count = 10;
  for(let i=0;i<count;i++){
    const tx = 80 + Math.random()*(canvas.width-160);
    const ty = 120 + Math.random()*(canvas.height-240);
    trees.push({x:tx,y:ty, r: 18 + Math.random()*14, color: '#2e7d32'});
  }
}

// Dibujo de escena
function drawBackground(){
  const g = ctx.createLinearGradient(0,0,0,canvas.height);
  g.addColorStop(0,'#87c690');
  g.addColorStop(1,'#6ab06a');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(40,60,canvas.width-80,canvas.height-120);
}

function drawTrees(){
  for(const t of trees){
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(t.x-4, t.y+12, 8, 12);
    ctx.beginPath();
    ctx.fillStyle = t.color;
    ctx.ellipse(t.x, t.y, t.r*1.2, t.r, 0, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawHouse(){
  const x = house.x, y = house.y, w = house.w, h = house.h;
  ctx.fillStyle = '#efebe9';
  ctx.fillRect(x,y,w,h);
  ctx.fillStyle = '#6a4f4b';
  ctx.beginPath();
  ctx.moveTo(x-10,y);
  ctx.lineTo(x + w/2, y-60);
  ctx.lineTo(x+w+10,y);
  ctx.closePath();
  ctx.fill();

  const px = x + w/2 - 24;
  const py = y + h - 48;
  ctx.fillStyle = '#263238';
  ctx.fillRect(px, py, 48, 48);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px+8, py+10, 8, 6);
  ctx.fillRect(px+32, py+10, 8, 6);
  ctx.strokeStyle = '#90caf9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px+16,py+13);
  ctx.lineTo(px+32,py+13);
  ctx.stroke();

  ctx.fillStyle = '#4fc3f7';
  ctx.beginPath();
  ctx.moveTo(px+24, py+26);
  ctx.lineTo(px+18, py+44);
  ctx.lineTo(px+30, py+44);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#102027';
  ctx.font = '12px sans-serif';
  ctx.fillText('Agente de', x+12, y+18);
  ctx.fillText('Ciberseguridad', x+12, y+34);
}

function drawPlayer(){
  ctx.beginPath();
  ctx.fillStyle = player.color;
  ctx.arc(player.x, player.y, player.r, 0, Math.PI*2);
  ctx.fill();
}

// Movimiento y lógica
let last = performance.now();
function update(){
  const now = performance.now();
  const dt = (now - last)/1000;
  last = now;

  let dx = 0, dy = 0;
  if(keys['w']||keys['ArrowUp']) dy -= 1;
  if(keys['s']||keys['ArrowDown']) dy += 1;
  if(keys['a']||keys['ArrowLeft']) dx -= 1;
  if(keys['d']||keys['ArrowRight']) dx += 1;
  if(dx!==0||dy!==0){
    const len = Math.hypot(dx,dy)||1;
    dx = dx/len; dy = dy/len;
    player.x += dx * player.speed * dt;
    player.y += dy * player.speed * dt;
  }

  player.x = Math.max(player.r+40, Math.min(canvas.width - player.r - 40, player.x));
  player.y = Math.max(player.r+40, Math.min(canvas.height - player.r - 40, player.y));

  // Colisiones simples con árboles
  for(const t of trees){
    const vx = player.x - t.x;
    const vy = player.y - t.y;
    const dist = Math.hypot(vx, vy);
    const minDist = player.r + t.r - 4;
    if(dist > 0 && dist < minDist){
      const overlap = minDist - dist;
      player.x += (vx / dist) * overlap;
      player.y += (vy / dist) * overlap;
    }
  }
}

function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  drawTrees();
  drawHouse();
  drawPlayer();

  const cx = house.x + house.w/2;
  const cy = house.y + house.h/2;
  const dist = Math.hypot(player.x - cx, player.y - cy);
  if(dist < 120){
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(20,20,360,36);
    ctx.fillStyle = '#eaf6ff';
    ctx.font = '16px sans-serif';
    ctx.fillText('Te acercas a la casa del Agente de Ciberseguridad — Presiona E para entrar', 28, 44);
  }
}

function loop(){
  update();
  render();
  requestAnimationFrame(loop);
}

// Controles
window.addEventListener('keydown', e => {
  // tecla E para interactuar
  if(e.key === 'e' || e.key === 'E'){
    const cx = house.x + house.w/2;
    const cy = house.y + house.h/2;
    const dist = Math.hypot(player.x - cx, player.y - cy);
    if(dist < 120){
      houseDialog.style.display = 'flex';
      for(const k in keys) keys[k] = false;
    }
    return; // no marcar como movimiento
  }
  keys[e.key] = true;
});
window.addEventListener('keyup', e => { keys[e.key] = false; });

closeDialog.addEventListener('click', ()=>{ houseDialog.style.display = 'none'; });

// Volumen (leer de localStorage)
const savedVol = localStorage.getItem('safeReality.volume');
if(savedVol !== null){
  volumeSlider.value = savedVol;
}
patioAudio.volume = parseFloat(volumeSlider.value);
volumeSlider.addEventListener('input', ()=>{
  const v = parseFloat(volumeSlider.value);
  patioAudio.volume = v;
  localStorage.setItem('safeReality.volume', v);
});

// Inicialización
(function init(){
  player.x = Math.min(140, canvas.width/4);
  player.y = canvas.height/2;
  generateTrees();
  last = performance.now();
  // reproducir audio del patio (puede bloquear hasta interacción)
  patioAudio.play().catch(()=>{});
  loop();
})();
