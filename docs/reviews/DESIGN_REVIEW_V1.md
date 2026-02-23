# DESIGN REVIEW V1 — Luxury Snake Web

## Scope reviewed
- Current implementation in `index.html`, `css/style.css`, `js/main.js`
- Product target from `../prd/UX_BRIEF_LUXURY_SNAKE.md`
- Baseline commit in repo is `de79b29` (current main state at review time)

---

## What’s working well

1. **Strong luxury baseline visual system**
   - Tokenized palette, restrained contrast, good typographic hierarchy, and premium motion curves are already in place.
   - Surface layering and shadows feel intentional rather than noisy.

2. **Single focal point is respected**
   - Board dominance is good; HUD remains compact and does not fight for attention.
   - Overlay behavior (fade + subtle vertical settle) aligns well with “quiet confidence.”

3. **Input model is clean and reliable**
   - Keyboard support includes arrows + WASD, plus Enter/Space/Esc states.
   - Touch swipe threshold + axis lock logic is practical and avoids many accidental diagonals.

4. **Core UX state machine is understandable**
   - Idle / Running / Paused / Game Over are explicit and synchronized to HUD + overlay.
   - Live region announcements for major states are present.

5. **Performance-conscious rendering choices**
   - Fixed-timestep update with interpolated rendering is smooth.
   - Canvas resize logic respects DPR and keeps visuals crisp.

---

## Top UX gaps hurting perceived quality

1. **Overlay secondary action creates semantic noise on first load**
   - Initial screen shows a “Pause” secondary button when pause is not a valid action yet.
   - This introduces avoidable cognitive friction and slightly cheapens the premium clarity.

2. **Direction input can feel “lost” under rapid turns (especially touch)**
   - Queue exists, but no feedback for accepted input vs invalid reverse input.
   - Luxury feel depends on confidence; silent rejection can feel like control lag.

3. **HUD state naming is technically accurate but emotionally flat**
   - “State: Running/Idle/Gameover” reads debug-like rather than product-grade microcopy.
   - Premium products use human language (“Playing”, “Ready”, “Game Over”).

4. **Visual identity of snake head vs body is subtle but not quite iconic**
   - Contrast and radius differences exist, but at speed/peripheral vision, distinction is weak.
   - This impacts clarity and polish perception.

5. **Game-over transition is functional but not yet “finished”**
   - Red impact flash appears, but sequence could feel cleaner with tighter timing and deliberate freeze cadence.
   - Current transition is good MVP quality, not yet luxury-finished.

6. **Touch affordance is static and always visible**
   - Persistent “Swipe on the board…” text adds mild clutter on desktop and repeated sessions.
   - Better as context-aware, fade-on-first-play guidance.

---

## Prioritized small-change backlog (max 8)

> All items below are intentionally small, shippable, and testable in the current vanilla HTML/CSS/JS canvas architecture.

### 1) [SHIP NEXT] Fix overlay action semantics per state
**Why high impact / low risk:** Removes immediate clarity debt on first screen with tiny code/UI change.

**Change**
- Idle/start overlay secondary action should be **"How to Play"** text-link style or hidden entirely (recommended: hidden).
- Keep secondary button only for states where a real secondary decision exists (Paused/Game Over).

**Visual/interaction details**
- Idle: one primary CTA centered (“Start Game”).
- Paused/Game Over: two-button layout stays as-is.
- Preserve current focus-visible and motion styles.

**Acceptance criteria**
- On first load, only one actionable button is displayed.
- No “Pause” action is shown unless game can actually be paused.
- Keyboard Enter on idle still starts game in one action.

---

### 2) [SHIP NEXT] Upgrade HUD microcopy and state language
**Why high impact / low risk:** Significant perceived quality lift from tiny text-only change.

**Change**
- Replace internal-state labels with player-facing terms:
  - `idle` → “Ready”
  - `running` → “Playing”
  - `paused` → “Paused”
  - `gameover` → “Game Over”
- Keep status length short and title-cased.

**Visual/interaction details**
- Maintain accent color only for active state value.
- No layout resize/jump when labels change.

**Acceptance criteria**
- HUD never shows implementation terms like “idle” or “gameover”.
- State text remains legible and does not wrap at 320px width.

---

### 3) [SHIP NEXT] Add subtle input acknowledgment (accepted vs blocked turn)
**Why high impact / low risk:** Makes controls feel premium-responsive without adding complexity.

**Change**
- On accepted direction queue: trigger 80–120ms head highlight pulse.
- On invalid reverse attempt: trigger very subtle neutral pulse on head (or tiny board edge dim), no alert text.

**Visual/interaction details**
- Keep feedback understated (opacity-only or tiny luminance delta).
- Do not add particle effects or shake.

**Acceptance criteria**
- Repeated quick valid turns give visible but subtle confirmation.
- Reverse input produces a distinct, non-disruptive “not accepted” signal.
- No measurable FPS drop on desktop/mobile.

---

### 4) Strengthen snake head recognition at speed
**Change**
- Increase head-body distinction with one extra cue:
  - Slightly brighter head fill + micro notch/eye mark, or
  - Head outline stroke at low opacity.

**Visual/interaction details**
- Keep monochrome family; avoid extra hues.
- Ensure distinction still works in grayscale perception.

**Acceptance criteria**
- At normal speed, users can instantly identify head direction in peripheral vision.
- Head remains tasteful, not cartoonish.

---

### 5) Make touch hint contextual and dismissive
**Change**
- Show touch hint only on coarse pointers (`(pointer: coarse)`).
- Fade hint after first successful swipe/start in session.

**Visual/interaction details**
- 140–200ms fade; no movement.
- Keep existing tone and typography.

**Acceptance criteria**
- Desktop users never see touch hint.
- Mobile users see hint initially, then it auto-hides after first meaningful interaction.

---

### 6) Tighten game-over transition timing polish
**Change**
- Standardize sequence timing:
  1. Collision freeze immediate
  2. Impact flash 90–120ms
  3. Overlay appears after ~120ms

**Visual/interaction details**
- No dramatic scale/bounce.
- Keep same overlay animation curve.

**Acceptance criteria**
- Transition feels deliberate and clean, with no timing jitter.
- Restart remains immediate after CTA.

---

### 7) Reduce grid prominence on small screens
**Change**
- Slightly reduce grid line alpha on narrow viewports (`<= 480px`).

**Visual/interaction details**
- Example: from `0.05` to `0.03` alpha equivalent.
- Preserve board geometry readability.

**Acceptance criteria**
- Snake + food remain the visual priority on mobile.
- Grid is still present but recedes perceptually.

---

### 8) Improve typography finish for HUD numerals
**Change**
- Apply numeral styling for score/best values (e.g., `font-variant-numeric: tabular-nums;` and slightly increased weight consistency).

**Visual/interaction details**
- Keep current size scale; avoid dramatic font change.
- Ensure no layout jitter when score increments.

**Acceptance criteria**
- Score changes do not visually “wobble” in width.
- Numeric rhythm feels precise and premium.

---

## Ship-next picks (very high impact, low risk)

1. **Fix overlay action semantics per state** (Item 1)
2. **Upgrade HUD microcopy and state language** (Item 2)
3. **Add subtle input acknowledgment for accepted/blocked turns** (Item 3)

These three create the largest immediate jump in perceived quality while requiring minimal architectural or rendering changes.
