# QA Report — 2026-02-22

Repository: `storiesbyariel/luxury-snake-web`  
Branch tested: `main` (latest at time of QA)

## Scope covered
Focused manual/functional QA pass against README smoke checklist intent:

- Desktop flow sanity: start, pause/resume, game over/restart, overlay state transitions
- Keyboard controls: Enter/Space/Escape + directional inputs
- Narrow viewport sanity (~320px): no obvious clipping in core HUD/board container
- Touch-flow spot checks (coarse-pointer behavior and touch hint lifecycle)
- Gameplay systems review: scoring, streak multiplier window/reset behavior, gold-fruit timing/expiry logic
- Accessibility basics review: semantic structure, live-region/dialog usage sanity

## Issues opened
1. **Moving into vacating tail cell triggers false self-collision**  
   https://github.com/storiesbyariel/luxury-snake-web/issues/1

2. **No full-board win handling; food can fallback to occupied cell**  
   https://github.com/storiesbyariel/luxury-snake-web/issues/2

## Notes
- Filed only high-signal gameplay defects/usability-impacting edge cases.
- No code fixes were implemented in this QA task.
