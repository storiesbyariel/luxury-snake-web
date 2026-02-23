const CONFIG = {
  gridSize: 24,
  baseTickRate: 10,
  maxTickRate: 12,
  speedBands: [
    { score: 0, tickRate: 10 },
    { score: 12, tickRate: 11 },
    { score: 28, tickRate: 12 }
  ],
  boardColor: '#141923',
  boardTintTop: 'rgba(212,175,55,0.045)',
  boardTintBottom: 'rgba(255,255,255,0.03)',
  snakeBody: '#c4ccd8',
  snakeHead: '#f5f7fa',
  snakeHeadCue: 'rgba(20, 25, 35, 0.82)',
  foodColor: '#d4af37',
  foodGlow: 'rgba(212, 175, 55, 0.32)',
  goldFoodColor: '#f2d67a',
  goldFoodGlow: 'rgba(242, 214, 122, 0.46)',
  goldSpawnMinMs: 20000,
  goldSpawnMaxMs: 30000,
  goldLifetimeMs: 6500,
  streakWindowMs: 4000,
  streakMax: 3,
  storageKeyBest: 'luxury-snake-best'
};

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
const PHASE_LABELS = {
  idle: 'Ready',
  running: 'Playing',
  paused: 'Paused',
  gameover: 'Game Over'
};

const pointerCoarse = window.matchMedia('(pointer: coarse)');

const state = {
  phase: 'idle',
  snake: [],
  previousSnake: [],
  direction: 'right',
  nextDirections: [],
  food: { x: 8, y: 8, kind: 'normal' },
  score: 0,
  best: Number(localStorage.getItem(CONFIG.storageKeyBest) || 0),
  bestBeforeRun: Number(localStorage.getItem(CONFIG.storageKeyBest) || 0),
  multiplier: 1,
  streakDeadlineAt: 0,
  nextGoldSpawnAt: 0,
  goldExpiresAt: 0,
  runSummary: '',
  helperTimeoutId: null,
  hasDismissedTouchHint: false,
  gridLineColor: 'rgba(255,255,255,0.05)',
  currentTickRate: CONFIG.baseTickRate,
  impactFlashMs: 0,
  foodPulseMs: 0,
  inputPulseMs: 0,
  blockedPulseMs: 0,
  justAte: false,
  metrics: {
    ttfpStartAt: null,
    restartStartAt: null,
    ttfpPending: false,
    restartPending: false
  }
};

const el = {
  canvas: document.getElementById('gameCanvas'),
  boardWrap: document.getElementById('boardWrap'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlayTitle'),
  overlayText: document.getElementById('overlayText'),
  overlayHint: document.querySelector('.overlay-hint'),
  primaryBtn: document.getElementById('primaryBtn'),
  secondaryBtn: document.getElementById('secondaryBtn'),
  score: document.getElementById('score'),
  best: document.getElementById('best'),
  state: document.getElementById('state'),
  stateHelper: document.getElementById('stateHelper'),
  multiplier: document.getElementById('multiplier'),
  touchHint: document.getElementById('touchHint'),
  liveRegion: document.getElementById('liveRegion')
};

const ctx = el.canvas.getContext('2d');
let dpr = Math.max(1, window.devicePixelRatio || 1);
let cellPx = 1;
let boardPx = 0;

let accumulator = 0;
let lastTs = performance.now();

function nowMs() {
  return performance.now();
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function nextGoldSpawnTime() {
  return nowMs() + randomRange(CONFIG.goldSpawnMinMs, CONFIG.goldSpawnMaxMs);
}

function announce(msg) {
  el.liveRegion.textContent = '';
  requestAnimationFrame(() => (el.liveRegion.textContent = msg));
}

function setPhase(phase) {
  state.phase = phase;
  el.state.textContent = PHASE_LABELS[phase] || 'Ready';
}

function syncTickRate() {
  let rate = CONFIG.baseTickRate;
  for (const band of CONFIG.speedBands) {
    if (state.score >= band.score) rate = band.tickRate;
  }
  state.currentTickRate = Math.min(CONFIG.maxTickRate, rate);
}

function resetStreak(reason = '') {
  state.multiplier = 1;
  state.streakDeadlineAt = 0;
  syncHud();
  if (reason) showHelper(reason, 1500);
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
  state.bestBeforeRun = state.best;
  state.multiplier = 1;
  state.streakDeadlineAt = 0;
  state.nextGoldSpawnAt = nextGoldSpawnTime();
  state.goldExpiresAt = 0;
  state.runSummary = '';
  state.currentTickRate = CONFIG.baseTickRate;
  state.impactFlashMs = 0;
  state.foodPulseMs = 0;
  state.inputPulseMs = 0;
  state.blockedPulseMs = 0;
  state.justAte = false;
  hideHelper();
  spawnFood('normal');
  syncHud();
}

function syncHud() {
  el.score.textContent = String(state.score);
  el.best.textContent = String(state.best);
  const showMult = state.multiplier > 1;
  el.multiplier.hidden = !showMult;
  if (showMult) el.multiplier.textContent = `x${state.multiplier}`;
}

function showHelper(msg, durationMs = 1700) {
  if (!el.stateHelper) return;
  clearTimeout(state.helperTimeoutId);
  el.stateHelper.textContent = msg;
  el.stateHelper.hidden = false;
  state.helperTimeoutId = setTimeout(() => {
    el.stateHelper.hidden = true;
  }, durationMs);
}

function hideHelper() {
  clearTimeout(state.helperTimeoutId);
  if (el.stateHelper) {
    el.stateHelper.hidden = true;
    el.stateHelper.textContent = '';
  }
}

function openOverlay({ title, text, summary = '', primaryLabel, secondaryLabel = '', showSecondary = false }) {
  el.overlayTitle.textContent = title;
  el.overlayText.textContent = text;
  el.overlayHint.textContent = summary || 'Enter to start · Space to pause';
  el.primaryBtn.textContent = primaryLabel;

  if (showSecondary && secondaryLabel) {
    el.secondaryBtn.textContent = secondaryLabel;
    el.secondaryBtn.hidden = false;
  } else {
    el.secondaryBtn.hidden = true;
  }

  el.overlay.classList.add('is-visible');
  el.primaryBtn.focus();
}

function hideOverlay() {
  el.overlay.classList.remove('is-visible');
}

function startGame() {
  if (state.phase === 'running') return;

  if (state.phase === 'idle') {
    resetGame();
    state.metrics.ttfpStartAt = nowMs();
    state.metrics.ttfpPending = true;
  } else if (state.phase === 'gameover') {
    state.metrics.restartStartAt = nowMs();
    state.metrics.restartPending = true;
    resetGame();
  }

  setPhase('running');
  hideOverlay();
  showHelper('Plan 3 moves ahead', 1600);
  announce('Game started');
}

function pauseGame() {
  if (state.phase !== 'running') return;
  setPhase('paused');
  openOverlay({
    title: 'Paused',
    text: 'Take a breath. Press Space to continue.',
    primaryLabel: 'Resume',
    secondaryLabel: 'Quit to Menu',
    showSecondary: true,
    summary: `Score ${state.score} · Length ${state.snake.length}`
  });
  hideHelper();
  announce('Paused');
}

function resumeGame() {
  if (state.phase !== 'paused') return;
  setPhase('running');
  hideOverlay();
  showHelper('Steady line, clean turns', 1400);
  announce('Resumed');
}

function buildRunSummary() {
  const parts = [`Mistake at length ${state.snake.length}.`];
  if (state.multiplier > 1) parts.push(`Chain broke at x${state.multiplier}.`);
  return parts.join(' ');
}

function endGame() {
  setPhase('gameover');
  state.impactFlashMs = 120;
  if (state.score > state.best) {
    state.best = state.score;
    localStorage.setItem(CONFIG.storageKeyBest, String(state.best));
  }
  state.runSummary = buildRunSummary();
  resetStreak();
  syncHud();
  const newBest = state.score > state.bestBeforeRun ? ' New best.' : '';
  openOverlay({
    title: 'Game Over',
    text: `Score ${state.score}. Best ${state.best}.${newBest}`,
    summary: state.runSummary,
    primaryLabel: 'Play Again',
    secondaryLabel: 'Quit to Menu',
    showSecondary: true
  });
  hideHelper();
  announce(`Game over. Score ${state.score}. Best ${state.best}.`);
}

function queueDirection(next, source = 'keyboard') {
  if (state.phase !== 'running') return false;
  const last = state.nextDirections[state.nextDirections.length - 1] || state.direction;
  if (next === last) return false;

  if (OPPOSITE[last] === next) {
    state.blockedPulseMs = 90;
    return false;
  }

  state.nextDirections.push(next);
  state.inputPulseMs = 110;

  if (source === 'touch' && !state.hasDismissedTouchHint) {
    state.hasDismissedTouchHint = true;
    updateTouchHintVisibility();
  }

  return true;
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

function spawnFood(kind = 'normal') {
  const occupied = new Set(state.snake.map((s) => `${s.x},${s.y}`));
  if (state.food && state.food.x !== undefined) occupied.add(`${state.food.x},${state.food.y}`);

  const free = [];
  for (let y = 0; y < CONFIG.gridSize; y++) {
    for (let x = 0; x < CONFIG.gridSize; x++) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }

  const slot = free[Math.floor(Math.random() * free.length)] || { x: 0, y: 0 };
  state.food = { ...slot, kind };
  if (kind === 'gold') state.goldExpiresAt = nowMs() + CONFIG.goldLifetimeMs;
  else state.goldExpiresAt = 0;

  state.foodPulseMs = 120;
}

function maybeSpawnGold() {
  if (state.phase !== 'running') return;
  if (state.food.kind === 'gold') return;
  if (nowMs() < state.nextGoldSpawnAt) return;

  spawnFood('gold');
  showHelper('Risk window open', 1700);
  announce('Gold fruit appeared.');
}

function updateTimedSystems() {
  if (state.phase !== 'running') return;

  maybeSpawnGold();

  if (state.food.kind === 'gold' && nowMs() >= state.goldExpiresAt) {
    spawnFood('normal');
    state.nextGoldSpawnAt = nextGoldSpawnTime();
    showHelper('Risk window closed', 1600);
  }

  if (state.streakDeadlineAt > 0 && nowMs() > state.streakDeadlineAt && state.multiplier > 1) {
    resetStreak('Chain reset');
  }
}

function inBounds(p) {
  return p.x >= 0 && p.y >= 0 && p.x < CONFIG.gridSize && p.y < CONFIG.gridSize;
}

function commitUxMetricsIfPending() {
  if (state.metrics.ttfpPending && state.metrics.ttfpStartAt !== null) {
    const ms = nowMs() - state.metrics.ttfpStartAt;
    state.metrics.ttfpPending = false;
    performance.mark('snake:first-play');
    performance.measure('snake:ttfp', {
      start: 'snake:init',
      end: 'snake:first-play'
    });
    console.info(`[UX] Time-to-first-play: ${ms.toFixed(1)}ms`);
  }

  if (state.metrics.restartPending && state.metrics.restartStartAt !== null) {
    const ms = nowMs() - state.metrics.restartStartAt;
    state.metrics.restartPending = false;
    console.info(`[UX] Restart latency: ${ms.toFixed(1)}ms`);
  }
}

function applyScoreForPickup(base) {
  if (state.streakDeadlineAt > 0 && nowMs() <= state.streakDeadlineAt) {
    state.multiplier = Math.min(CONFIG.streakMax, state.multiplier + 1);
  } else {
    state.multiplier = 1;
  }

  state.streakDeadlineAt = nowMs() + CONFIG.streakWindowMs;
  state.score += base * state.multiplier;
  syncTickRate();
  syncHud();

  if (state.multiplier > 1) showHelper(`Chain x${state.multiplier}`, 950);
}

function update() {
  if (state.phase !== 'running') return;
  updateTimedSystems();

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
    const isGold = state.food.kind === 'gold';
    applyScoreForPickup(isGold ? 3 : 1);
    state.justAte = true;

    if (isGold) {
      state.nextGoldSpawnAt = nextGoldSpawnTime();
      showHelper('High-value secured', 1300);
    }

    spawnFood('normal');
  } else {
    state.snake.pop();
    state.justAte = false;
  }

  commitUxMetricsIfPending();
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

function drawHeadCue(headCell) {
  const cx = (headCell.x + 0.5) * cellPx;
  const cy = (headCell.y + 0.5) * cellPx;
  const offset = cellPx * 0.18;
  let ox = 0;
  let oy = 0;

  if (state.direction === 'up') oy = -offset;
  if (state.direction === 'down') oy = offset;
  if (state.direction === 'left') ox = -offset;
  if (state.direction === 'right') ox = offset;

  ctx.fillStyle = CONFIG.snakeHeadCue;
  ctx.beginPath();
  ctx.arc(cx + ox, cy + oy, Math.max(1.5, cellPx * 0.08), 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.shadowBlur = Math.max(6, cellPx * 0.3);
  ctx.shadowColor = 'rgba(245,247,250,0.5)';
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(3.5, cellPx * 0.18), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(245,247,250,0.42)';
  ctx.fill();
  ctx.restore();
}

function render(interp) {
  ctx.clearRect(0, 0, boardPx, boardPx);
  ctx.fillStyle = CONFIG.boardColor;
  ctx.fillRect(0, 0, boardPx, boardPx);

  const boardGrad = ctx.createLinearGradient(0, 0, 0, boardPx);
  boardGrad.addColorStop(0, CONFIG.boardTintTop);
  boardGrad.addColorStop(1, CONFIG.boardTintBottom);
  ctx.fillStyle = boardGrad;
  ctx.fillRect(0, 0, boardPx, boardPx);

  ctx.strokeStyle = state.gridLineColor;
  ctx.lineWidth = 1;
  for (let i = 1; i < CONFIG.gridSize; i++) {
    const p = Math.round(i * cellPx) + 0.5;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, boardPx); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(boardPx, p); ctx.stroke();
  }

  const pulseScale = 1 + (state.foodPulseMs > 0 ? (state.foodPulseMs / 120) * 0.06 : 0);
  const isGold = state.food.kind === 'gold';
  const foodColor = isGold ? CONFIG.goldFoodColor : CONFIG.foodColor;
  const foodGlow = isGold ? CONFIG.goldFoodGlow : CONFIG.foodGlow;
  const foodPhase = (nowMs() % 1200) / 1200;

  ctx.save();
  ctx.translate((state.food.x + 0.5) * cellPx, (state.food.y + 0.5) * cellPx);
  ctx.scale(pulseScale, pulseScale);
  ctx.translate(-(state.food.x + 0.5) * cellPx, -(state.food.y + 0.5) * cellPx);
  ctx.shadowBlur = isGold ? 22 : 16;
  ctx.shadowColor = foodGlow;
  drawCell(state.food, foodColor, 0.5);
  ctx.restore();

  ctx.save();
  const foodCx = (state.food.x + 0.5) * cellPx;
  const foodCy = (state.food.y + 0.5) * cellPx;
  const haloRadius = cellPx * (0.34 + foodPhase * 0.18);
  ctx.globalAlpha = isGold ? 0.24 * (1 - foodPhase) : 0.14 * (1 - foodPhase);
  ctx.strokeStyle = isGold ? 'rgba(242,214,122,0.9)' : 'rgba(212,175,55,0.75)';
  ctx.lineWidth = Math.max(1, cellPx * 0.045);
  ctx.beginPath();
  ctx.arc(foodCx, foodCy, haloRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  if (isGold && state.goldExpiresAt > 0) {
    const remain = Math.max(0, state.goldExpiresAt - nowMs());
    const pct = remain / CONFIG.goldLifetimeMs;
    const cx = (state.food.x + 0.5) * cellPx;
    const cy = (state.food.y + 0.5) * cellPx;
    const radius = cellPx * 0.42;
    ctx.strokeStyle = 'rgba(242,214,122,0.82)';
    ctx.lineWidth = Math.max(1.5, cellPx * 0.08);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * pct));
    ctx.stroke();
  }

  const acceptedStrength = state.inputPulseMs > 0 ? state.inputPulseMs / 110 : 0;
  const blockedStrength = state.blockedPulseMs > 0 ? state.blockedPulseMs / 90 : 0;

  for (let i = state.snake.length - 1; i >= 0; i--) {
    const curr = state.snake[i];
    const prev = state.previousSnake[i] || curr;
    const cell = {
      x: lerp(prev.x, curr.x, interp),
      y: lerp(prev.y, curr.y, interp)
    };

    const isHeadSeg = i === 0;
    let alpha = 1;
    if (isHeadSeg && acceptedStrength > 0) alpha = 1 - acceptedStrength * 0.12;
    if (isHeadSeg && blockedStrength > 0) alpha = 1 - blockedStrength * 0.2;

    drawCell(cell, isHeadSeg ? CONFIG.snakeHead : CONFIG.snakeBody, isHeadSeg ? 0.36 : 0.24, alpha);

    if (isHeadSeg) drawHeadCue(cell);
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
  const stepMs = 1000 / state.currentTickRate;
  while (accumulator >= stepMs) {
    update();
    accumulator -= stepMs;
  }

  if (state.foodPulseMs > 0) state.foodPulseMs = Math.max(0, state.foodPulseMs - dt);
  if (state.impactFlashMs > 0) state.impactFlashMs = Math.max(0, state.impactFlashMs - dt);
  if (state.inputPulseMs > 0) state.inputPulseMs = Math.max(0, state.inputPulseMs - dt);
  if (state.blockedPulseMs > 0) state.blockedPulseMs = Math.max(0, state.blockedPulseMs - dt);

  render(accumulator / stepMs);
  requestAnimationFrame(frame);
}

function updateGridLineColor() {
  const css = getComputedStyle(document.documentElement);
  state.gridLineColor = css.getPropertyValue('--grid-line').trim() || 'rgba(255,255,255,0.05)';
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
  updateGridLineColor();
}

function quitToMenu() {
  setPhase('idle');
  resetStreak();
  openOverlay({
    title: 'Luxury Snake',
    text: 'Arrow keys or WASD to move.',
    primaryLabel: 'Start Game',
    showSecondary: false,
    summary: 'Enter to start · Space to pause'
  });
  hideHelper();
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

function updateTouchHintVisibility() {
  if (!el.touchHint) return;
  const shouldShow = pointerCoarse.matches && !state.hasDismissedTouchHint;
  el.touchHint.hidden = !shouldShow;
}

function setupInput() {
  window.addEventListener('keydown', (e) => {
    const dir = keyToDir(e.key);
    if (dir) {
      e.preventDefault();
      queueDirection(dir, 'keyboard');
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
    if (adx > ady * 1.2) queueDirection(dx > 0 ? 'right' : 'left', 'touch');
    else if (ady > adx * 1.2) queueDirection(dy > 0 ? 'down' : 'up', 'touch');
  }, { passive: true });

  pointerCoarse.addEventListener('change', updateTouchHintVisibility);
}

function init() {
  performance.mark('snake:init');
  resetGame();
  syncHud();
  setPhase('idle');
  openOverlay({
    title: 'Luxury Snake',
    text: 'Arrow keys or WASD to move.',
    primaryLabel: 'Start Game',
    showSecondary: false,
    summary: 'Enter to start · Space to pause'
  });
  updateTouchHintVisibility();
  resizeCanvas();
  setupInput();
  requestAnimationFrame(frame);
}

window.addEventListener('resize', resizeCanvas);
init();