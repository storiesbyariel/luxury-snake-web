# Luxury Snake Web

Premium-minimal Snake built with vanilla HTML/CSS/JavaScript and Canvas. No backend, no framework, and ready for GitHub Pages root hosting.

## Run locally

Option 1 (quick): open `index.html` directly in your browser.

Option 2 (recommended local server):

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Controls

- Move: Arrow keys or `W A S D`
- Start / confirm: `Enter`
- Pause / resume: `Space`
- Menu / back: `Esc`
- Touch: swipe on the board (min 24px, axis-locked)

## Features in this pass

- Canvas-rendered 24x24 board with DPR-aware scaling
- Fixed-timestep game logic (10 ticks/sec) + smooth requestAnimationFrame rendering
- Reverse-direction guard and queued input
- Subtle input acknowledgment on accepted turns + blocked reverse attempts
- Food spawning on empty cells, growth, score tracking
- Wall/self collision and game-over flow
- State-aware overlays for Ready / Playing / Paused / Game Over
- Minimal luxury HUD (Score, Best, State) with user-facing state labels
- `localStorage` persistence for best score (`luxury-snake-best`)
- Responsive layout and HUD readability tuned for narrow width (including ~320px)
- `prefers-reduced-motion` respected for UI transitions

## UX instrumentation (devtools)

This release includes lightweight console timing markers:

- **Time-to-first-play (TTFP):** page init → first movement tick after starting from Ready
- **Restart latency:** Play Again/Enter after Game Over → first movement tick

### How to inspect

1. Open DevTools Console.
2. Reload the page.
3. Press `Enter` to start once.
4. Look for:
   - `[UX] Time-to-first-play: ...ms`
5. Force a game over, then press `Enter` (or click **Play Again**).
6. Look for:
   - `[UX] Restart latency: ...ms`

Target guidance from release strategy:

- TTFP median target: `<= 5000ms` (stretch `<= 3500ms`)
- Restart latency target: `<= 400ms`

## GitHub Pages deployment (root)

1. Push this repository to GitHub.
2. In GitHub: **Settings → Pages**.
3. Set source to **Deploy from a branch**.
4. Select branch `main`, folder `/ (root)`.
5. Save and wait for publish.

Because paths are relative (`./css/style.css`, `./js/main.js`), hosting from repo root on Pages works without path changes.

## Manual smoke-check checklist

### Desktop (about 2 minutes)

1. Load page: Ready overlay has one clear primary CTA (**Start Game**) and quiet control hint.
2. Press `Enter`: game starts, HUD state shows **Playing**.
3. Press rapid valid direction changes: notice subtle head acknowledgment.
4. Try immediate reverse direction: move is blocked with subtle non-intrusive feedback.
5. Press `Space`: pause overlay appears with valid actions only (**Resume**, **Quit to Menu**).
6. End game by collision: **Game Over** overlay appears with **Play Again** + **Quit to Menu**.
7. Press `Enter` on Game Over: restart is immediate and logs restart latency in console.

### Narrow viewport (~320px)

1. Set responsive width to ~320px.
2. Verify Score / Best / State remain readable with no clipping or overlap.
3. Confirm board remains dominant visual element and fully playable.
4. Verify overlay copy and CTA remain readable and centered.

## Next polish ideas

- Difficulty selector (8/10/12 ticks)
- Optional sound and haptics toggle
- Optional on-screen D-pad toggle
- More refined score/new-best micro-feedback
