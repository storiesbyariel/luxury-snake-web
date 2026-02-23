# WEB_SNAKE_PLAN.md

## 1) Product Vision

**Working title:** Luxury Snake Web  
**Goal:** Deliver a modern, elegant Snake game that feels premium and intentional, while staying lightweight enough to host on GitHub Pages with no build step.

### Design Principles (Luxury / Clean / Premium)
- **Minimal by default:** fewer UI elements, stronger hierarchy, generous spacing.
- **Smoothness over gimmicks:** polished transitions, subtle motion, no visual noise.
- **Legibility first:** high contrast, clear typography, predictable controls.
- **Focused loop:** gameplay starts fast; menus are shallow and purposeful.
- **Cohesive visual language:** consistent border radii, shadows, and accent colors.

---

## 2) Technical Architecture

### Stack
- **Frontend only:** HTML + CSS + vanilla JavaScript (ES modules)
- **No backend**
- **No framework** (scope is small; framework overhead is unnecessary)
- **Storage:** `localStorage` for high score and lightweight preferences

### Rendering Decision
- **Use HTML5 Canvas for gameplay rendering**
  - Better control of frame rendering, animation smoothness, and visual effects
  - Simpler than DOM-grid updates at higher tick rates
  - Keeps game logic and rendering clearly separated

### Core Technical Decisions
- **Game loop model:** fixed-timestep simulation + requestAnimationFrame render
  - Simulation tick: **10 steps/second** for MVP
  - Adjustable later (difficulty levels e.g., 8/10/12)
- **Grid size:** default logical grid **24 x 24** (MVP)
- **Input model:** queued direction changes with opposite-direction guard
  - Keyboard: Arrow keys + WASD
  - Mobile: swipe gestures + optional on-screen directional pad
- **Collision:** wall collision ends run (MVP); self-collision ends run
- **Food placement:** random empty cell, guaranteed not to overlap snake body
- **Scoring:** +1 per food; high score persisted to `localStorage`
- **Responsive scaling:** canvas scales to viewport while preserving integer cell geometry
  - Maintain square playfield
  - DevicePixelRatio-aware rendering for crisp lines

### Proposed File Structure
```text
luxury-snake-web/
  index.html
  css/
    reset.css
    variables.css
    base.css
    layout.css
    components.css
    game.css
  js/
    main.js
    config.js
    game/
      state.js
      loop.js
      input.js
      snake.js
      food.js
      collision.js
      renderer.js
      ui.js
    utils/
      random.js
      storage.js
      math.js
  assets/
    icons/
    fonts/
    social/
  docs/
    WEB_SNAKE_PLAN.md
    TASKS.md
  README.md
```

### Asset Strategy
- Prefer **system font stack** for MVP (speed + consistency)
- Optional premium webfont only in polish phase if performance budget remains healthy
- SVG icons for scalability and low size
- Keep static assets small and cache-friendly

---

## 3) Milestone Plan

## Milestone A: MVP (Playable Core)
**Objective:** Solid, reliable Snake game with clean baseline styling.

### Scope
- Core game state and movement
- Food spawning and growth
- Collision and game-over flow
- Score + high score persistence
- Keyboard controls
- Responsive desktop/tablet layout

### Acceptance Criteria
- Game starts and is fully playable without console errors
- Input feels responsive and deterministic
- High score survives browser refresh
- Layout works at common widths (mobile portrait excluded from strict MVP)
- Lighthouse Performance >= 90 on local run (indicative target)

## Milestone B: Polish (Premium Feel)
**Objective:** Raise visual and interaction quality.

### Scope
- Refined UI styles (luxury palette, spacing, subtle glow/shadow)
- Smooth transitions for start/pause/game-over overlays
- Optional sound toggle (lightweight effects)
- Difficulty selector (speed presets)
- Mobile-friendly control layer (swipe + buttons)

### Acceptance Criteria
- Visual design is coherent and intentionally “premium”
- Controls work on touch devices without accidental scroll interference
- Animations remain smooth under normal load
- No major accessibility regressions from MVP

## Milestone C: Release (GitHub Pages-ready)
**Objective:** Ship a stable public version.

### Scope
- Final QA pass
- README with usage + controls + deployment notes
- Social preview image (optional but recommended)
- Semantic version tag v1.0.0

### Acceptance Criteria
- Deploys successfully on GitHub Pages
- Public URL playable on latest Chrome/Safari/Firefox
- Known-issues section documented
- Release checklist fully complete

---

## 4) GitHub Pages Hosting Plan

### Repository Strategy
- Create dedicated repo: **luxury-snake-web**
- Use **main** as default branch
- Build-free deployment (no CI build required)

### Pages Configuration (recommended)
- GitHub Pages source: **Deploy from a branch**
- Branch: `main`
- Folder: `/ (root)`

### Why this strategy
- Simplest deployment for static site
- Minimal maintenance burden
- Transparent file structure for collaborators

### Optional Alternative
- If wanting separation of source/deploy later: use `/docs` as Pages source
- Not needed for MVP, but supported by current plan structure

---

## 5) Performance & Accessibility Plan

### Performance
- Keep JavaScript modules small and focused
- Avoid layout thrashing; isolate canvas redraw work
- Use fixed-step logic to avoid speed variance across devices
- Use `requestAnimationFrame` for rendering synchronization
- Minimize asset weight and external dependencies

### Accessibility
- Ensure sufficient color contrast (WCAG AA target)
- Provide visible focus states for controls and buttons
- Keyboard-first operation supported from MVP
- Add ARIA labels for control buttons and overlays
- Respect `prefers-reduced-motion` (reduce nonessential animation)

---

## 6) Test & QA Checklist

## Functional
- [ ] Snake moves correctly and cannot reverse instantly into itself
- [ ] Food always spawns on empty cell
- [ ] Score increments correctly per food
- [ ] Game-over triggers correctly on wall/self collision
- [ ] Restart resets state correctly
- [ ] Pause/resume works (if implemented in milestone)

## Input
- [ ] Arrow keys work
- [ ] WASD works
- [ ] Rapid direction changes behave predictably
- [ ] Touch controls work on iOS Safari + Android Chrome (Polish)

## Responsive/UI
- [ ] Game remains playable at 320px width
- [ ] Canvas remains sharp on retina/high-DPI screens
- [ ] Overlay text remains readable on small screens

## Persistence
- [ ] High score saves across reload
- [ ] Preferences (e.g., difficulty/sound) persist if enabled

## Browser Coverage
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)

## Deployment
- [ ] GitHub Pages configured to main/root
- [ ] `index.html` loads without broken asset paths
- [ ] Public URL tested after deployment

---

## 7) Scope Guardrails (v1)
- No backend, accounts, leaderboards, or multiplayer
- No heavy framework or build tooling
- Keep first release focused on polished single-player core gameplay
