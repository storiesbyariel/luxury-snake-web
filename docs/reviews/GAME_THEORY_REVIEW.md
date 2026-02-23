# GAME THEORY REVIEW — Luxury Snake Web

## Scope
Reviewed current gameplay logic in `js/main.js` and UX surface in `index.html`/`css/style.css` for strategic depth, risk/reward structure, and skill expression.

---

## 1) Current core loop analysis

### Core loop (current)
1. Start run at fixed speed (`tickRate = 10`).
2. Route to nearest food while avoiding wall/self collision.
3. Gain +1 score per food; snake grows.
4. Survive as long as possible; one mistake ends run.

### Decision density
- **Early game:** low. Optimal play is usually obvious (shortest safe route to food).
- **Mid game:** moderate. Body length creates path-planning and future-space decisions.
- **Late game:** high but repetitive. Most decisions become “don’t trap yourself” rather than varied strategic choices.

### Risk / reward profile
- Reward is **flat** (every food = +1, no modifiers).
- Risk is mostly **binary** (alive/dead), with little graded risk-taking.
- Because rewards are flat, safest line is often best; intentional risk rarely pays better.

### Pacing
- Pacing is clean and readable, but strategically static:
  - No speed ramp, phase shifts, or dynamic objective pressure.
  - Tension rises mainly from self-growth, not from system variation.

### Skill expression
- Present:
  - Input precision and turn timing.
  - Spatial planning / board control at higher lengths.
- Missing:
  - Meaningful style differentiation (safe optimizer vs high-risk scorer).
  - Distinct tactical choices with different payoff profiles.

**Summary:** polished baseline, but game theory is primarily single-axis survival optimization. Strong execution, limited strategic variety.

---

## 2) Missing foundational mechanics (practical + minimal)

1. **No variable-value targets**
   - All food is equivalent; no target-prioritization decisions.

2. **No short-term pressure windows**
   - Player is rarely forced to choose between immediate safety and higher payoff.

3. **No systemic score multipliers tied to behavior**
   - Skillful/creative play and conservative play are rewarded nearly the same.

4. **No adaptive pacing layer**
   - Fixed speed means mastery curve can flatten after core competence.

5. **No constrained tactical “resource” for risk management**
   - Player has movement only; no limited-use strategic tool that creates richer tradeoffs.

---

## 3) Prioritized small additions (max 6)

> Designed to stay implementable in current vanilla HTML/CSS/JS canvas architecture with minimal UI clutter.

### 1) Timed Gold Fruit (high value, expires)
**Rationale**
- Introduces explicit risk/reward target selection.
- Creates path-value comparison: safe normal food vs dangerous high-value detour.

**Expected player behavior change**
- More deliberate route planning and opportunity assessment.
- Players sometimes pass up risky targets, increasing strategic identity.

**Acceptance criteria**
- Gold fruit spawns periodically (e.g., every 20–30s) with a clear visual distinction.
- Expires after short timer (e.g., 5–7s) if not eaten.
- Gold fruit grants higher score (e.g., +3) while normal remains +1.
- HUD remains minimal (small timer ring/indicator only, no heavy panels).

---

### 2) Streak Multiplier (tight timing chain)
**Rationale**
- Rewards tempo and consistency without adding UI complexity.
- Adds graded rewards to existing core action (eating food).

**Expected player behavior change**
- Players optimize pathing to maintain streak windows.
- Better players can intentionally trade safety for multiplier retention.

**Acceptance criteria**
- Consecutive food pickups within a window (e.g., <= 4s) increase multiplier up to cap (e.g., x3).
- Missing the window resets multiplier.
- Scoring formula updates cleanly (`score += base * multiplier`).
- HUD shows subtle multiplier token only when > x1.

---

### 3) Gentle Speed Curve by Score Bands
**Rationale**
- Keeps strategic pressure rising and prevents flat pacing.
- Increases value of route efficiency as game progresses.

**Expected player behavior change**
- Earlier transition to board-control mindset.
- More meaningful long-horizon decisions as reaction budget tightens.

**Acceptance criteria**
- Tick rate increases in small bands (e.g., 10 → 11 → 12 by score thresholds).
- Cap speed to preserve premium readability; no chaotic spikes.
- Transition feedback is subtle and non-disruptive.

---

### 4) Near-Miss Bonus (optional micro-risk signal)
**Rationale**
- Rewards high-skill maneuvering with small upside.
- Creates a “style” layer without new entities.

**Expected player behavior change**
- Skilled players may route tighter around hazards for incremental gains.
- Casual players can ignore with minimal penalty.

**Acceptance criteria**
- Award small bonus (e.g., +0.25 equivalent tracked as integer points every 4 near-misses, or direct +1 at threshold) when head passes adjacent to wall/body under strict conditions.
- Trigger has cooldown to prevent farming.
- Visual feedback is subtle (brief head accent), no screen noise.

---

### 5) Single-Charge “Phase Step” (limited emergency pass-through)
**Rationale**
- Adds one constrained strategic resource.
- Improves depth by introducing timing and reserve management.

**Expected player behavior change**
- Players choose when to spend charge: greed extension vs survival bailout.
- Creates richer post-mistake recovery decisions.

**Acceptance criteria**
- One charge gained every N foods (e.g., every 8), capped at 1.
- Activation key (e.g., Shift) lets head pass through one occupied/wall tile once.
- Charge use is visually legible but restrained; accidental activation prevented.
- Optional in settings toggle if purity concerns arise.

---

### 6) Safer Food Spawn Rule (avoid immediate no-win traps)
**Rationale**
- Not “more content,” but stronger strategic fairness.
- Reduces RNG frustration that can undercut high-skill play.

**Expected player behavior change**
- More trust in risk decisions because outcomes feel earned.
- Better replay fairness, especially at medium/high lengths.

**Acceptance criteria**
- Food never spawns in cells that are technically free but instantly unreachable due to imminent enclosure (lightweight safety heuristic).
- Spawn routine remains performant at full board occupancy.
- No visible change to minimalist visual design.

---

## 4) Mini Release 2 gameplay packet (recommended)

## **Packet name: “Precision Pressure”**

### Included changes (3)
1. **Timed Gold Fruit** (+3, short expiry)
2. **Streak Multiplier** (x1→x3 via short pickup window)
3. **Gentle Speed Curve** (score-band tick increases)

### Why this packet
- Best depth-per-complexity ratio.
- Establishes three distinct strategic dimensions without clutter:
  - **Target value choice** (what to chase)
  - **Tempo discipline** (when to chain)
  - **Execution pressure** (how fast to solve routes)
- Keeps UX luxury-clean: only tiny HUD additions and subtle visual cues.
- Fully feasible in current architecture (extend existing game state, update loop, and food/spawn logic).

### Suggested implementation scope (small)
- Add state fields: `multiplier`, `streakWindowMs`, `nextGoldSpawnAt`, `goldExpiresAt`, `tickRateCurrent`.
- Extend `spawnFood()` to support `normal|gold` variant.
- Adjust `update()` scoring and timing checks.
- Add minimal HUD token for active multiplier and optional tiny gold timer indicator.

### Release acceptance (MR2)
- New players still understand game in <10 seconds.
- Advanced players can intentionally choose safer vs higher-scoring lines.
- Average run variance increases due to strategy, not visual/UI complexity.
- No material regression in responsiveness or frame stability.

---

## Final recommendation
Ship **Mini Release 2: Precision Pressure** first. It introduces foundational game-theory depth with minimal cognitive/UI overhead and preserves the premium, restrained product direction.