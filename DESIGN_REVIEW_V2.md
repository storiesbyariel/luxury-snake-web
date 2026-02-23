# DESIGN REVIEW V2 — Luxury Snake Web (Post Mini Release 1)

Reviewed against commit: `2498d62` (Mini Release 1)

## 1) What improved in Mini Release 1

Mini Release 1 successfully shipped the highest-impact clarity fixes from V1:

1. **Start/pause/game-over overlay semantics are now correct**
   - Idle overlay has one clear primary action.
   - Secondary action only appears in states where it is valid (Paused/Game Over).

2. **HUD state language moved from implementation labels to player language**
   - `Ready / Playing / Paused / Game Over` now reads product-grade, not debug-grade.

3. **Input confidence improved with micro-feedback**
   - Accepted turns and blocked reverse turns now produce distinct, subtle head feedback.
   - This reduces the “did it register?” feeling under fast inputs.

4. **Instrumentation added for UX timing quality**
   - TTFP and restart latency are logged in devtools, enabling objective iteration.

5. **Legibility baseline is stronger at narrow widths**
   - HUD wraps to two rows cleanly on small screens with no obvious clipping.

Overall: Mini Release 1 materially improved first impression and control trust without feature bloat.

---

## 2) Remaining UX quality gaps

1. **No explicit “new best” visual treatment in HUD loop**
   - New best is currently text-only inside game-over copy.
   - Missing subtle in-HUD confirmation during replay loops.

2. **Touch hint remains persistent once shown**
   - On coarse-pointer devices, hint stays visible even after user demonstrates understanding.
   - Adds avoidable permanent chrome.

3. **Head direction readability can still be clearer at speed**
   - Head/body contrast exists, but peripheral readability during high-density board states can improve.

4. **Grid prominence on mobile slightly competes with snake/food**
   - A minor alpha reduction at narrow widths would improve calmness and focal hierarchy.

5. **Restart flow lacks concise progression microcopy for upcoming strategy systems**
   - As gameplay-depth/game-theory updates arrive, users will need tiny, contextual guidance.
   - Current UI has no reserved language pattern for “risk/reward now active” moments.

---

## 3) Compact backlog (max 6, small + testable)

| # | Item | Why now | Small/Testable acceptance criteria | Pair with game-theory packet? |
|---|---|---|---|---|
| 1 | **Contextual touch hint lifecycle** | Removes persistent clutter on mobile after onboarding | (a) Show hint only on `(pointer: coarse)`; (b) fade out after first successful swipe/start in session; (c) remains hidden until reload | **No** |
| 2 | **New-best HUD chip micro-feedback** | Improves reward clarity in fast replay loop | On score surpassing previous best, show `NEW BEST` chip near Best metric for 1.2s max; no layout shift; reduced-motion uses fade only | **Yes** (align with any scoring-rule changes) |
| 3 | **Snake head recognition pass** | Better peripheral direction recognition = fewer perceived control errors | Add one monochrome cue (thin outline or notch) that remains tasteful; 3-test-run check: head direction instantly identifiable | **No** |
| 4 | **Mobile grid alpha tuning** | Re-centers focus on snake + food in dense visual conditions | At `<=480px`, reduce grid alpha (e.g., .05→.03); verify board geometry still readable | **No** |
| 5 | **State-aware “Run Summary” line on Game Over overlay** | Preps UI for strategy depth without adding clutter | Add 1 compact line under score: default `"Mistake at length {n}."`; updates per run, max one line | **Yes** (attach to risk/depth metrics when available) |
| 6 | **HUD helper slot for dynamic strategy status** | Creates a stable place for future game-theory prompts | Add optional single-line helper below State metric, hidden by default; when enabled, max 28 chars, auto-clears in 2.0s | **Yes** (primary coupling point for packet mechanics) |

---

## 4) Concrete copy + interaction specs (new overlays/HUD text)

### A) `NEW BEST` HUD chip (Item 2)

**Placement**
- Inside Best metric block, adjacent to value (or directly beneath value on narrow layouts).

**Copy**
- Label: `NEW BEST`

**Behavior**
- Trigger: first frame where `score > previousBest` in active run.
- Motion: 120ms fade-in, 1200ms hold, 140ms fade-out.
- Reduced motion: fade only; no movement/scale.
- Cooldown: one appearance per run.

**A11y**
- Live region (polite): `"New best score."`

---

### B) Game Over run-summary line (Item 5)

**Placement**
- Overlay text block, one line under `Score X. Best Y.`

**Default copy (pre game-theory packet)**
- `Mistake at length {length}.`

**Copy variants (when game-theory packet is active)**
- Conservative fail: `Safe lane closed too late.`
- Risk fail: `High-risk route collapsed.`
- Efficiency fail: `Pathing window missed.`

**Behavior**
- Always max one concise sentence.
- No punctuation stacking, no emoji.
- If no metric signal exists, hide line entirely (do not show filler).

**A11y**
- Included in existing game-over polite announcement.

---

### C) HUD helper slot for strategy status (Item 6)

**Placement**
- Under State value (`Playing/Paused/...`) as subdued secondary text.

**Copy set (for game-theory packet hooks)**
- Neutral prep: `Plan 3 moves ahead`
- Risk enabled: `Risk window open`
- Risk cooling: `Risk window closed`
- Efficiency reward: `Clean route bonus ready`
- Recovery: `Stabilize to preserve lead`

**Interaction rules**
- Only shown while `state = Playing`.
- Duration: 1.6–2.0s per message, then auto-hide.
- Priority: critical gameplay state > advisory hint.
- Never queue more than 1 pending message (drop stale hints).

**A11y**
- Do not announce every helper message in live region (avoid verbosity).
- Announce only critical transitions (e.g., `Risk window open/closed`).

---

## 5) Recommended next slice (small, high-quality)

**Ship next as a polish slice:**
1) Contextual touch hint lifecycle (Item 1)  
2) Snake head recognition pass (Item 3)  
3) Mobile grid alpha tuning (Item 4)

Why this slice: it is compact, low-risk, clearly testable, and improves perceived luxury quality immediately without waiting on deeper gameplay systems.

**Then pair with gameplay-depth packet:** Items 2/5/6 as one microcopy+feedback packet so new strategy mechanics ship with matching UX language from day one.
