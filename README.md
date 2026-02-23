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

## Features in this pass (Mini Release 2: Precision Pressure)

- Canvas-rendered 24x24 board with DPR-aware scaling
- Fixed-timestep game logic with gentle speed curve by score band (10 → 11 → 12 ticks/sec)
- Reverse-direction guard and queued input
- Subtle input acknowledgment on accepted turns + blocked reverse attempts
- **Timed Gold Fruit**: occasional +3 target with visible expiry ring and soft gold treatment
- **Streak Multiplier**: short chain window that can ramp scoring to `x3` (`x1` resets on timeout/death)
- Food spawning on empty cells, growth, score tracking
- Wall/self collision and game-over flow
- State-aware overlays for Ready / Playing / Paused / Game Over, including concise run summary line
- Refined visual polish pass: layered board ambience, smoother overlay easing, and subtler HUD typography rhythm
- Minimal luxury HUD (Score, Best, State + transient helper + active multiplier chip)
- Contextual touch hint lifecycle (coarse pointer only, auto-dismisses after first successful swipe)
- Tasteful snake head direction cue for faster recognition at speed
- Mobile grid alpha tuning at `<=480px` to preserve focal hierarchy
- `localStorage` persistence for best score (`luxury-snake-best`)
- Responsive layout and readability tuned for narrow width (including ~320px)
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

## Contribution roles and guardrails

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the agent role matrix and PR/review policy.

Key rule: **QA files issues only** (no QA report/code pushes to `main`).

## Documentation map

Planning and review docs are consolidated under `docs/`:

- PRD / planning: [`docs/prd/`](./docs/prd/)
  - [`WEB_SNAKE_PLAN.md`](./docs/prd/WEB_SNAKE_PLAN.md)
  - [`TASKS.md`](./docs/prd/TASKS.md)
  - [`UX_BRIEF_LUXURY_SNAKE.md`](./docs/prd/UX_BRIEF_LUXURY_SNAKE.md)
- Strategy: [`docs/strategy/`](./docs/strategy/)
  - [`UX_RELEASE_STRATEGY.md`](./docs/strategy/UX_RELEASE_STRATEGY.md)
- Reviews: [`docs/reviews/`](./docs/reviews/)
  - [`DESIGN_REVIEW_V1.md`](./docs/reviews/DESIGN_REVIEW_V1.md)
  - [`DESIGN_REVIEW_V2.md`](./docs/reviews/DESIGN_REVIEW_V2.md)
  - [`GAME_THEORY_REVIEW.md`](./docs/reviews/GAME_THEORY_REVIEW.md)

## GitHub Pages deployment (root)

1. Push this repository to GitHub.
2. In GitHub: **Settings → Pages**.
3. Set source to **Deploy from a branch**.
4. Select branch `main`, folder `/ (root)`.
5. Save and wait for publish.

Because paths are relative (`./css/style.css`, `./js/main.js`), hosting from repo root on Pages works without path changes.

## Manual smoke-check checklist

### Desktop (about 2–3 minutes)

1. Load page: Ready overlay has one clear primary CTA (**Start Game**) and concise hint.
2. Press `Enter`: game starts, HUD state shows **Playing** and helper copy clears automatically.
3. Collect 2–3 fruits in quick succession: verify multiplier chip appears (`x2`/`x3`) and score gain increases.
4. Wait >4 seconds before next fruit: verify multiplier resets cleanly to `x1` (chip disappears).
5. Keep playing ~20–30 seconds: verify gold fruit appears, has subtle distinct styling, and expiry ring counts down.
6. Let gold fruit expire once: verify it disappears and game continues normally; then collect one gold fruit in a later spawn and confirm higher score gain.
7. Press `Space`: pause overlay appears with valid actions only (**Resume**, **Quit to Menu**).
8. End game by collision: **Game Over** overlay shows score/best plus concise run summary line.
9. Press `Enter` on Game Over: restart is immediate and logs restart latency in console.
10. Tail-vacate case: create a tight loop and move into the cell the tail is leaving on that same tick; verify no false self-collision.
11. Near-full board case: continue until board is full; verify game ends as a win state (`Perfect Run`) and no food spawns onto occupied cells.

### Mobile / coarse pointer

1. Open on a touch device or simulator with coarse pointer enabled.
2. Confirm touch hint is shown initially.
3. Perform one successful swipe direction input on the board.
4. Confirm touch hint auto-dismisses and stays hidden for the rest of the session.

### Narrow viewport (~320px)

1. Set responsive width to ~320px (and <=480px at least once).
2. Verify Score / Best / State / helper remain readable with no clipping.
3. Confirm grid lines are quieter at <=480px while board remains readable.
4. Verify snake head direction cue remains visible but subtle at speed.

## Next polish ideas

- Difficulty selector (8/10/12 ticks)
- Optional sound and haptics toggle
- Optional on-screen D-pad toggle
- More refined score/new-best micro-feedback
