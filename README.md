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
- Food spawning on empty cells, growth, score tracking
- Wall/self collision and game-over flow
- Start, pause, resume, restart, and menu overlays
- Minimal luxury HUD (Score, Best, State)
- `localStorage` persistence for best score (`luxury-snake-best`)
- Responsive layout with focus-visible control styling
- `prefers-reduced-motion` respected for UI transitions

## GitHub Pages deployment (root)

1. Push this repository to GitHub.
2. In GitHub: **Settings → Pages**.
3. Set source to **Deploy from a branch**.
4. Select branch `main`, folder `/ (root)`.
5. Save and wait for publish.

Because paths are relative (`./css/style.css`, `./js/main.js`), hosting from repo root on Pages works without path changes.

## Manual smoke-check checklist

1. Load page: overlay shows **Start Game** and controls hint.
2. Press `Enter`: game starts, state becomes **Running**.
3. Eat food: score increments, snake grows.
4. Try immediate reverse direction: should be ignored.
5. Hit wall or self: **Game Over** overlay appears.
6. Press `Enter` or click **Play Again**: restart works quickly.
7. Press `Space` while running: pause overlay appears; press again to resume.
8. Refresh browser after setting a best score: **Best** persists.
9. Resize to mobile width (~320px): board remains playable and HUD readable.
10. On touch device: swipe moves snake without requiring on-screen controls.

## Next polish ideas

- Difficulty selector (8/10/12 ticks)
- Optional sound and haptics toggle
- Optional on-screen D-pad toggle
- More refined score/new-best micro-feedback
