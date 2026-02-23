# UX Release Strategy — Luxury Snake Web

## Objective
Ship quality in small, dependable increments that increase perceived premium feel without expanding feature surface area.

Principle: **polish over novelty**. Every release must improve clarity, speed-to-play, and confidence.

---

## Release Cadence Proposal (3 Mini Releases)

- **Cadence:** 1 mini release every 3–4 days (or 2 per week if bandwidth allows)
- **Release size:** 2–4 tightly scoped UX changes each
- **Gate:** ship only when manual smoke checks pass and no visual regressions on desktop + mobile

### Mini Release 1 — “Fast Start + Legibility Baseline”
Focus: first impression, immediate understanding, zero-friction entry.

### Mini Release 2 — “Restart Loop Excellence”
Focus: game-over clarity, restart speed, and reduced interaction friction.

### Mini Release 3 — “Premium Feel Calibration”
Focus: subtle motion quality, micro-feedback consistency, and visual restraint hardening.

---

## Quality Bar per Release

### Universal quality bar (applies to all releases)
1. **No added cognitive load:** no extra persistent HUD clutter or secondary CTAs.
2. **Interaction predictability:** keyboard/touch controls remain consistent; no surprise remaps.
3. **Performance stability:** no visible jank at normal play speed; no console errors.
4. **Accessibility intact:** focus-visible and reduced-motion behavior remain functional.
5. **Cross-viewport confidence:** clear and playable at 320px width and standard desktop.

### Release-specific quality bars

#### Mini Release 1 quality bar
- First playable action discoverable immediately from initial overlay.
- Overlay copy readable at a glance (clear hierarchy and spacing).
- Board remains dominant focal point with accent usage restrained.

#### Mini Release 2 quality bar
- Restart flow is clearly prioritized (single primary action).
- Death → replay loop feels instant and uninterrupted.
- Best/new-best messaging is legible but understated.

#### Mini Release 3 quality bar
- Motion feels cohesive (same easing family, disciplined durations).
- Micro-feedback is subtle and brief; never noisy or cartoony.
- Final visual rhythm feels “quiet premium” with no competing focal points.

---

## Measurable UX Success Signals

Track these manually first (devtools + test script), then automate where practical.

### 1) Time-to-First-Play (TTFP)
- **Definition:** page load complete → first movement tick after start action.
- **Target by Release 1:** median ≤ 5.0s for new user run-through.
- **Stretch target:** ≤ 3.5s with keyboard-first user.

### 2) Restart Friction
- **Definition:** game over shown → active movement resumed after replay action.
- **Target by Release 2:** ≤ 400ms after CTA/Enter.
- **Secondary signal:** restart succeeds in one attempt >95% of runs.

### 3) Readability & Visual Clarity
- **Definition:** ability to identify score, best, and state within 1s glance.
- **Target by Release 1:** all three elements pass 320px viewport check with no overlap/truncation.
- **Secondary signal:** overlay CTA hierarchy judged clear in quick hallway test (3/3 users).

### 4) Input Confidence
- **Definition:** intended direction accepted without accidental reverse/diagonal ambiguity.
- **Target by Release 2:** reverse-direction guard always works; touch false-direction incidents are rare (<1 per 3-minute session in manual test).

### 5) Premium Perception (qualitative)
- **Definition:** perceived “calm, premium, intentional” feel from testers.
- **Target by Release 3:** majority feedback uses positive descriptors (calm/smooth/clean/clear) with no “busy/noisy” comments.

---

## Rollback & Safety Notes for Visual Changes

1. **Token-first edits only**
   - Make visual changes through CSS variables/tokens where possible.
   - Avoid scattered hard-coded color/spacing edits that are hard to undo.

2. **Small, reversible PR scope**
   - One visual concern per commit batch (typography, spacing, or motion), not all at once.
   - Keep diffs easy to revert cleanly.

3. **Screenshot checkpoints**
   - Before/after screenshots at desktop and 320px mobile width.
   - Compare overlay legibility, HUD spacing, board prominence, and focus ring visibility.

4. **Reduced-motion safety check**
   - Any animation change must include a reduced-motion pass.
   - If motion regresses comfort, revert animation layer first before other visual tweaks.

5. **Fast rollback trigger conditions**
   - Revert immediately if any of the following occurs:
     - restart delay worsens,
     - readability at 320px degrades,
     - focus-visible becomes unclear,
     - visual noise increases (multiple competing accents/effects).

6. **Git rollback path**
   - Use targeted `git revert <commit>` for problematic polish commit(s), then regroup into narrower iteration.

---

## Next Release Packet (execute now)

### Packet Goal
Deliver **Mini Release 1: Fast Start + Legibility Baseline** with tight scope.

### Scoped tasks (2–3)

1. **Start overlay clarity pass**
   - Tighten title/subtitle/controls hierarchy and spacing for immediate comprehension.
   - Ensure one unmistakable primary CTA (“Start Game”) with keyboard hint visible but quiet.
   - Acceptance: new user can identify how to start in under 2 seconds.

2. **HUD readability at small viewport**
   - Tune typography, spacing, and wrapping so Score/Best/State remain legible at 320px width.
   - Preserve board as visual focal point; avoid HUD dominance.
   - Acceptance: no clipping/overlap/truncation at 320px; glance readability under 1 second.

3. **Lightweight UX instrumentation + smoke script update**
   - Add minimal timing hooks (console/debug only) for TTFP and restart latency.
   - Extend README/manual checklist with exact measurement steps and target thresholds.
   - Acceptance: can record TTFP + restart timing in one local run without guesswork.

---

## Definition of “Ready for Next Packet”
Mini Release 1 is complete when all three scoped tasks are done, smoke checks pass, and no regressions appear in reduced-motion, keyboard flow, or mobile readability.
