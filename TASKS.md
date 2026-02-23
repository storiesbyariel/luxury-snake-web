# TASKS.md

Prioritized checklist for execution agent.

## P0 — Project Setup & Structure
- [ ] Initialize repo scaffold (`index.html`, `css/`, `js/`, `assets/`, `docs/`)
- [ ] Move planning docs into `docs/` and keep root aliases if desired
- [ ] Add baseline `README.md` with project goal and controls
- [ ] Add `.gitignore` (OS/editor noise)
- [ ] Define color tokens and typography scale in `css/variables.css`

## P0 — Core Game Engine (MVP)
- [ ] Implement config constants (`grid`, `tickRate`, colors, sizing)
- [ ] Implement game state model (`idle`, `running`, `paused`, `gameover`)
- [ ] Build fixed-step loop (10 updates/sec) + `requestAnimationFrame` render
- [ ] Implement snake model (body array, growth, movement)
- [ ] Implement direction queue and opposite-direction validation
- [ ] Implement food spawn on empty cells
- [ ] Implement collision detection (wall + self)
- [ ] Implement score system and game-over handling

## P0 — Rendering & UI (MVP)
- [ ] Create canvas renderer with DPR scaling
- [ ] Draw board, snake, food, and simple HUD (score/high score)
- [ ] Implement start/restart interactions
- [ ] Add keyboard input (Arrow + WASD)
- [ ] Persist high score in `localStorage`

## P1 — Responsive & Touch Support
- [ ] Implement responsive container preserving square playfield
- [ ] Add swipe input with threshold tuning
- [ ] Add optional on-screen D-pad buttons
- [ ] Prevent page scroll conflicts during gameplay on touch devices

## P1 — Premium Visual Polish
- [ ] Refine layout spacing, alignment, and visual hierarchy
- [ ] Add subtle transitions for overlays and buttons
- [ ] Apply luxury palette and shadows/glow conservatively
- [ ] Add difficulty selector (8/10/12 ticks)
- [ ] (Optional) Add lightweight sound effects with mute toggle

## P1 — Accessibility
- [ ] Ensure keyboard-only full play path
- [ ] Add focus-visible states for interactive controls
- [ ] Verify color contrast (AA target)
- [ ] Add ARIA labels/roles for buttons and status UI
- [ ] Respect `prefers-reduced-motion`

## P2 — QA & Release Readiness
- [ ] Run functional checklist from `WEB_SNAKE_PLAN.md`
- [ ] Manual test on Chrome, Safari, Firefox
- [ ] Test mobile Safari + Android Chrome touch controls
- [ ] Validate asset paths and no console errors
- [ ] Update README with deployment and play instructions
- [ ] Tag `v1.0.0`

## P2 — GitHub Pages Deployment
- [ ] Confirm default branch is `main`
- [ ] Enable GitHub Pages: branch `main`, folder `/ (root)`
- [ ] Verify live URL loads and game runs
- [ ] Add repo URL + live URL to README

---

## Non-Goals for v1
- [ ] No backend/API integration
- [ ] No online leaderboard
- [ ] No multiplayer
- [ ] No framework migration unless concrete need emerges
