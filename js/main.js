const CONFIG = {
  gridSize: 24,
  tickRate: 10,
  boardColor: '#141923',
  snakeBody: '#c4ccd8',
  snakeHead: '#f5f7fa',
  foodColor: '#d4af37',
  foodGlow: 'rgba(212, 175, 55, 0.32)',
  lineColor: 'rgba(255,255,255,0.05)',
  storageKeyBest: 'luxury-snake-best'
};

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

const state = {
  phase: 'idle',
  snake: [],
  previousSnake: [],
  direction: 'right',
  nextDirections: [],
  food: { x: 8, y: 8 },
  score: 0,
  best: Number(localStorage.getItem(CONFIG.storageKeyBest) || 0),
  impactFlashMs: 0,
  foodPulseMs: 0,
  justAte: false
};

const el = {
  canvas: document.getElementById('gameCanvas'),
  boardWrap: document.getElementById('boardWrap'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlayTitle'),
  overlayText: document.getElementById('overlayText'),
  primaryBtn: document.getElementById('primaryBtn'),
  secondaryBtn: document.getElementById('secondaryBtn'),
  score: document.getElementById('score'),
  best: document.getElementById('best'),
  state: document.getElementById('state'),
  liveRegion: document.getElementById('liveRegion')
};

const ctx = el.canvas.getContext('2d');
let dpr = Math.max(1, window.devicePixelRatio || 1);
let cellPx = 1;
let boardPx = 0;

let accumulator = 0;
let lastTs = performance.now();
const stepMs = 1000 / CONFIG.tickRate;

function announce(msg) {
  el.liveRegion.textContent = '';
  requestAnimationFrame(() => (el.liveRegion.textContent = msg));
}

function setPhase(phase) {
  state.phase = phase;
  el.state.textContent = phase[0].toUpperCase() + phase.slice(1);
}

function resetGame() {
  const c = Math.floor(CONFIG.gridSize / 2);
  state.snake = [
    { x: c, y: c },
    { x: c - 1, y: c },
    { x: c - 2, y: c }
  ];
  state.previousSnake = structuredClone(state.snake);
  state.direction = 'right';
  state.nextDirections = [];
  state.score = 0;
  state.impactFlashMs = 0;
  state.foodPulseMs = 0;
  state.justAte = false;
  spawnFood();
  syncHud();
}

function syncHud() {
  el.score.textContent = String(state.score);
  el.best.textContent = String(state.best);
}

function openOverlay(title, text, primaryLabel, secondaryLabel = 'Quit to Menu') {
  el.overlayTitle.textContent = title;
  el.overlayText.textContent = text;
  el.primaryBtn.textContent = primaryLabel;
  el.secondaryBtn.textContent = secondaryLabel;
  el.overlay.classList.add('is-visible');
  el.primaryBtn.focus();
}

function hideOverlay() {
  el.overlay.classList.remove('is-visible');
}

function startGame() {
  if (state.phase === 'running') return;
  if (state.phase === 'idle' || state.phase === 'gameover') resetGame();
  setPhase('running');
  hideOverlay();
  announce('Game started');
}

function pauseGame() {
  if (state.phase !== 'running') return;
  setPhase('paused');
  openOverlay('Paused', 'Press Space or Resume to continue.', 'Resume', 'Quit to Menu');
  announce('Paused');
}

function resumeGame() {
  if (state.phase !== 'paused') return;
  setPhase('running');
  hideOverlay();
  announce('Resumed');
}

function endGame() {
  setPhase('gameover');
  state.impactFlashMs = 120;
  if (state.score > state.best) {
    state.best = state.score;
    localStorage.setItem(CONFIG.storageKeyBest, String(state.best));
  }
  syncHud();
  const newBest = state.score === state.best && state.score > 0 ? ' New best.' : '';
  openOverlay('Game Over', `Score ${state.score}. Best ${state.best}.${newBest}`, 'Play Again', 'Quit to Menu');
  announce(`Game over. Score ${state.score}. Best ${state.best}.`);
}

function queueDirection(next) {
  if (state.phase !== 'running') return;
  const last = state.nextDirections[state.nextDirections.length - 1] || state.direction;
  if (next === last || OPPOSITE[last] === next) return;
  state.nextDirections.push(next);
}

function keyToDir(key) {
  switch (key.toLowerCase()) {
    case 'arrowup':
    case 'w': return 'up';
    case 'arrowdown':
    case 's': return 'down';
    case 'arrowleft':
    case 'a': return 'left';
    case 'arrowright':
    case 'd': return 'right';
    default: return null;
  }
}

function spawnFood() {
  const occupied = new Set(state.snake.map((s) => `${s.x},${s.y}`));
  const free = [];
  for (let y = 0; y < CONFIG.gridSize; y++) {
    for (let x = 0; x < CONFIG.gridSize; x++) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }
  state.food = free[Math.floor(Math.random() * free.length)] || { x: 0, y: 0 };
  state.foodPulseMs = 120;
}

function inBounds(p) {
  return p.x >= 0 && p.y >= 0 && p.x < CONFIG.gridSize && p.y < CONFIG.gridSize;
}

function update() {
  if (state.phase !== 'running') return;
  state.previousSnake = structuredClone(state.snake);
  const nextDir = state.nextDirections.shift();
  if (nextDir) state.direction = nextDir;

  const v = DIRS[state.direction];
  const head = state.snake[0];
  const newHead = { x: head.x + v.x, y: head.y + v.y };

  if (!inBounds(newHead)) {
    endGame();
    return;
  }

  const hitsSelf = state.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y);
  if (hitsSelf) {
    endGame();
    return;
  }

  state.snake.unshift(newHead);
  const ate = newHead.x === state.food.x && newHead.y === state.food.y;
  if (ate) {
    state.score += 1;
    state.justAte = true;
    syncHud();
    spawnFood();
  } else {
    state.snake.pop();
    state.justAte = false;
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawCell(cell, color, radius = 0.2, alpha = 1) {
  const x = cell.x * cellPx;
  const y = cell.y * cellPx;
  const r = cellPx * radius;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x + 1, y + 1, cellPx - 2, cellPx - 2, r);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function render(interp) {
  ctx.clearRect(0, 0, boardPx, boardPx);
  ctx.fillStyle = CONFIG.boardColor;
  ctx.fillRect(0, 0, boardPx, boardPx);

  ctx.strokeStyle = CONFIG.lineColor;
  ctx.lineWidth = 1;
  for (let i = 1; i < CONFIG.gridSize; i++) {
    const p = Math.round(i * cellPx) + 0.5;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, boardPx); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(boardPx, p); ctx.stroke();
  }

  const pulseScale = 1 + (state.foodPulseMs > 0 ? (state.foodPulseMs / 120) * 0.06 : 0);
  ctx.save();
  ctx.translate((state.food.x + 0.5) * cellPx, (state.food.y + 0.5) * cellPx);
  ctx.scale(pulseScale, pulseScale);
  ctx.translate(-(state.food.x + 0.5) * cellPx, -(state.food.y + 0.5) * cellPx);
  ctx.shadowBlur = 16;
  ctx.shadowColor = CONFIG.foodGlow;
  drawCell(state.food, CONFIG.foodColor, 0.5);
  ctx.restore();

  for (let i = state.snake.length - 1; i >= 0; i--) {
    const curr = state.snake[i];
    const prev = state.previousSnake[i] || curr;
    const cell = {
      x: lerp(prev.x, curr.x, interp),
      y: lerp(prev.y, curr.y, interp)
    };
    drawCell(cell, i === 0 ? CONFIG.snakeHead : CONFIG.snakeBody, i === 0 ? 0.36 : 0.24);
  }

  if (state.impactFlashMs > 0) {
    ctx.fillStyle = 'rgba(255,107,107,0.2)';
    ctx.fillRect(0, 0, boardPx, boardPx);
  }
}

function frame(ts) {
  const dt = Math.min(50, ts - lastTs);
  lastTs = ts;

  accumulator += dt;
  while (accumulator >= stepMs) {
    update();
    accumulator -= stepMs;
  }

  if (state.foodPulseMs > 0) state.foodPulseMs = Math.max(0, state.foodPulseMs - dt);
  if (state.impactFlashMs > 0) state.impactFlashMs = Math.max(0, state.impactFlashMs - dt);

  render(accumulator / stepMs);
  requestAnimationFrame(frame);
}

function resizeCanvas() {
  const rect = el.boardWrap.getBoundingClientRect();
  const size = Math.floor(Math.min(rect.width, rect.height));
  dpr = Math.max(1, window.devicePixelRatio || 1);
  el.canvas.width = size * dpr;
  el.canvas.height = size * dpr;
  el.canvas.style.width = `${size}px`;
  el.canvas.style.height = `${size}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  boardPx = size;
  cellPx = size / CONFIG.gridSize;
}

function quitToMenu() {
  setPhase('idle');
  openOverlay('Luxury Snake', 'Use Arrow Keys or WASD. Press Enter to start.', 'Start Game', 'Pause');
  announce('Ready');
}

function handlePrimaryAction() {
  if (state.phase === 'paused') return resumeGame();
  return startGame();
}

function handleSecondaryAction() {
  if (state.phase === 'paused' || state.phase === 'gameover') {
    quitToMenu();
  }
}

function setupInput() {
  window.addEventListener('keydown', (e) => {
    const dir = keyToDir(e.key);
    if (dir) {
      e.preventDefault();
      queueDirection(dir);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (state.phase === 'idle' || state.phase === 'gameover') startGame();
      else if (state.phase === 'paused') resumeGame();
    }

    if (e.key === ' ') {
      e.preventDefault();
      if (state.phase === 'running') pauseGame();
      else if (state.phase === 'paused') resumeGame();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      if (state.phase === 'running') pauseGame();
      else quitToMenu();
    }
  });

  el.primaryBtn.addEventListener('click', handlePrimaryAction);
  el.secondaryBtn.addEventListener('click', handleSecondaryAction);

  let touchStart = null;
  el.boardWrap.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  el.boardWrap.addEventListener('touchend', (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    const threshold = 24;
    if (Math.max(adx, ady) < threshold) return;
    if (adx > ady * 1.2) queueDirection(dx > 0 ? 'right' : 'left');
    else if (ady > adx * 1.2) queueDirection(dy > 0 ? 'down' : 'up');
  }, { passive: true });
}

function init() {
  resetGame();
  syncHud();
  setPhase('idle');
  openOverlay('Luxury Snake', 'Use Arrow Keys or WASD. Press Enter to start.', 'Start Game', 'Pause');
  resizeCanvas();
  setupInput();
  requestAnimationFrame(frame);
}

window.addEventListener('resize', resizeCanvas);
init();
