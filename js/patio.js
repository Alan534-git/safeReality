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
const houseDialog = document.getElementById('houseDialog');
const closeDialog = document.getElementById('closeDialog');

// Audio
const audioController = new AudioController('patioAudio', 'playButton', 'volume');

// Player
const player = { x: 100, y: 100, r: 18, speed: 210, color: '#ffd54f', moving: false };
const keys = {};

// Patio y objetos
const trees = [];
const house = { x: 700, y: 220, w: 160, h: 120 };

// Items and levels
const images = {
  agenteParado: null,
  agenteCorre: null,
  pendrive: null
};

const items = [];

const levels = [
  {
    id: 1,
    title: 'Calle - Pendrive encontrado',
    description: 'Ves un pendrive en el suelo. ¿Lo recoges? Podría contener malware.',
    trigger: { x: 260, y: 220, r: 80 }
  },
  {
    id: 2,
    title: 'Cafetería - Red pública',
    description: 'Estás en una cafetería y hay una red Wi‑Fi pública disponible. ¿Te conectas?',
    trigger: { x: 420, y: 160, r: 90 }
  },
  {
    id: 3,
    title: 'Oficina - USB sospechoso',
    description: 'Un USB aparece en una mesa compartida de la oficina.',
    trigger: { x: 520, y: 340, r: 80 }
  },
  {
    id: 4,
    title: 'Parada de bus - Cargador público',
    description: 'Un cargador público ofrece cargar tu móvil. ¿Lo usas?',
    trigger: { x: 120, y: 360, r: 80 }
  },
  {
    id: 5,
    title: 'Casa - Conexión doméstica',
    description: 'Has llegado a casa. Decide cómo proteger tu conexión y dispositivos.',
    trigger: { x: house.x + house.w/2, y: house.y + house.h/2, r: 140 }
  }
];

let currentLevel = 1;

// UI elements for levels (patio acts as hub; levels are separate pages)
const levelBadge = document.getElementById('levelBadge');

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
  // Draw using images if available, otherwise fallback to circle
  const w = player.r*2.2;
  const h = player.r*2.8;
  if(player.moving && images.agenteCorre){
    ctx.drawImage(images.agenteCorre, player.x - w/2, player.y - h/2, w, h);
  } else if(images.agenteParado){
    ctx.drawImage(images.agenteParado, player.x - w/2, player.y - h/2, w, h);
  } else {
    ctx.beginPath();
    ctx.fillStyle = player.color;
    ctx.arc(player.x, player.y, player.r, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawItems(){
  for(const it of items){
    if(it.type === 'pendrive'){
      if(images.pendrive){
        const s = 28;
        ctx.drawImage(images.pendrive, it.x - s/2, it.y - s/2, s, s);
      } else {
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(it.x-6, it.y-4, 12, 8);
      }
    }
  }
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
    player.moving = true;
  }
  else player.moving = false;

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
  drawItems();
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
    // First check if near house (existing behavior)
    const hx = house.x + house.w/2;
    const hy = house.y + house.h/2;
    const houseDist = Math.hypot(player.x - hx, player.y - hy);
    if(houseDist < 120){
      houseDialog.style.display = 'flex';
      for(const k in keys) keys[k] = false;
      return; // handled
    }

    // Check level triggers
    for(const lvl of levels){
      const t = lvl.trigger;
      const d = Math.hypot(player.x - t.x, player.y - t.y);
      if(d < t.r){
        // Redirect to the separate level page
        for(const k in keys) keys[k] = false;
        window.location.href = `level${lvl.id}.html`;
        return;
      }
    }
    return; // no marcar como movimiento
  }
  keys[e.key] = true;
});
window.addEventListener('keyup', e => { keys[e.key] = false; });

closeDialog.addEventListener('click', ()=>{ houseDialog.style.display = 'none'; });

// Inicialización
(function init(){
  player.x = Math.min(140, canvas.width/4);
  player.y = canvas.height/2;
  generateTrees();
  last = performance.now();
  // reproducir audio del patio
  audioController.play();
  // preload images
  preloadImages();
  setupLevelItems();
  loop();
})();

// Level / UI logic
function preloadImages(){
  const p1 = new Image(); p1.src = 'png/players/player_1/agente_parado.png';
  p1.onload = ()=> images.agenteParado = p1;
  p1.onerror = ()=> console.log('No se encontro agente_parado');

  const p2 = new Image(); p2.src = 'png/players/player_1/agente_corre.png';
  p2.onload = ()=> images.agenteCorre = p2;
  p2.onerror = ()=> console.log('No se encontro agente_corre');

  const pd = new Image(); pd.src = 'png/pendrive.png';
  pd.onload = ()=> images.pendrive = pd;
  pd.onerror = ()=> console.log('No se encontro pendrive.png');
}

function setupLevelItems(){
  // Level 1: place a pendrive roughly at the trigger
  const l1 = levels.find(l=>l.id===1);
  if(l1){
    items.push({ type: 'pendrive', x: l1.trigger.x, y: l1.trigger.y });
  }
}
// Note: level interactions now happen in separate files (level1.html .. level5.html)
