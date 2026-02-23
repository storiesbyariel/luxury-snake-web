# UX Brief — Luxury / Minimal Snake (Web, GitHub Pages)

## 1) Product Feel & Visual Direction
**Experience target:** *quiet confidence*. The game should feel premium through restraint, precision, and smoothness—not visual noise.

### Palette (premium, high-contrast, low-saturation)
Use semantic tokens so themes can swap later.

- `--bg`: `#0E1116` (midnight charcoal)
- `--surface`: `#141923` (board container)
- `--surface-elev`: `#1A2030` (HUD / overlays)
- `--text-primary`: `#F5F7FA`
- `--text-secondary`: `#A9B2C3`
- `--accent`: `#D4AF37` (muted gold, sparingly)
- `--accent-soft`: `#8C7640`
- `--success`: `#70D6A7`
- `--danger`: `#FF6B6B`
- `--grid-line`: `rgba(255,255,255,0.05)`
- `--focus-ring`: `#9CC9FF`

**Usage rule:** Accent gold must occupy <5% of visual area at any moment.

### Typography
- Primary: `Inter` (or `system-ui`) for body/HUD
- Display numerals (score): `Space Grotesk` or `Sora` (fallback `Inter`)
- Base size: 16px
- Scale:
  - Caption: 12/16
  - Body: 14/20
  - HUD value: 20/24 (medium weight)
  - Overlay title: 32/36 (semi-bold)
- Tracking: +0.2px for small caps labels (e.g., “BEST”)

### Spacing & Layout Rhythm
Adopt an 8px grid with tight, deliberate density:
- XS 4, SM 8, MD 16, LG 24, XL 32, XXL 48
- Board should be dominant element (70–85% of viewport height on desktop)
- Keep edges breathable: min outer margin 24 desktop, 12 mobile

### Motion Style
- Motion adjective set: **glide, fade, settle**
- Avoid bounce/cartoon easing
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances, `ease-out` for micro feedback
- Duration:
  - Micro hover/focus: 120–160ms
  - Overlay in/out: 220–320ms
  - Score tick: 180ms

---

## 2) UX Principles (Luxury but Minimal)
1. **Single focal point:** board first, everything else supports it.
2. **Predictable interactions:** no surprises in controls or state changes.
3. **Fast restart loop:** death → reflection → instant retry in ≤2 actions.
4. **Delight through polish, not features:** fewer elements, better finishing.
5. **Clarity at speed:** game state always legible in peripheral vision.
6. **Quiet feedback:** subtle audiovisual responses to key events only.
7. **No cognitive clutter:** one primary CTA per screen state.

---

## 3) Interaction Design

### Start Flow
- First load shows centered overlay:
  - Title, short one-line subtitle
  - Primary CTA: **Start Game**
  - Secondary text: controls hint (`Arrow / WASD`, swipe on touch)
- Press `Enter` or click starts immediately
- On start, overlay fades out and board gains focus

### In-Game
- Inputs accepted: Arrow keys, WASD, swipe (mobile)
- Prevent 180° reversal (instant self-collision)
- `Space` toggles pause
- Minimal HUD always visible: Score + Best + Pause icon/state

### Game Over Flow
- Trigger when collision detected:
  1. Snake head impact flash (very brief)
  2. Movement freeze
  3. Overlay appears with score summary
- Overlay content:
  - `Game Over`
  - Current score
  - Best score (if new best, show understated “New Best” label)
  - Primary CTA: **Play Again**
  - Secondary: **Quit to Menu**
- Keyboard shortcuts: `Enter` = Play Again, `Esc` = Quit/Menu

### Restart Quality Bar
- Restart from game over to active play in <400ms after CTA
- Preserve board dimensions and camera framing; no layout reflow

---

## 4) Controls: Keyboard + Touch

### Keyboard
- Movement: `↑ ↓ ← →` + `W A S D`
- Pause/Resume: `Space`
- Start/Confirm: `Enter`
- Back/Menu: `Esc`

### Touch (mobile/tablet)
- Swipe anywhere on board region
- Min swipe distance: 24px; lock to cardinal axis
- Ignore ambiguous diagonal swipes
- Optional on-screen D-pad only if user enables “Touch Controls” (default off for clean UI)

### Input Feedback
- On accepted direction change: tiny head highlight pulse (80–120ms)
- On invalid reverse input: no harsh alert; tiny neutral shake or brief dim pulse

---

## 5) Animation & Micro-interactions
- Snake movement should feel crisp and clock-accurate, not interpolated mush
- Food spawn: 120ms fade + scale from 0.96→1.0
- Food eaten:
  - Particle count tiny (4–6 max), short lifespan (<250ms)
  - Score increments with soft numeric up-tick
- Buttons:
  - Hover: subtle lift (`translateY(-1px)`)
  - Active: settle back (`translateY(0)`)
  - Focus-visible: 2px ring (`--focus-ring`) with 2px offset
- Overlay transitions: opacity + 8px vertical move max

**Reduced motion mode:** remove scale/translate; keep only fades (<=150ms).

---

## 6) Sound & Haptics (Optional, Tasteful)
- Default: **sound on at low volume** (20–30%) with visible mute toggle
- Sound palette: soft synth/plucked tones, no retro beeps unless intentionally themed
- Events:
  - Food eaten: short soft tick
  - Game over: low, brief tone
  - New best: subtle two-note ascent
- Never stack loud/long effects; prioritize silence between events

### Haptics (mobile if supported)
- Food eaten: light impact
- Game over: medium impact
- Respect reduced motion / battery saver signals; allow haptics off

---

## 7) Accessibility Requirements

### Contrast
- Text/UI minimum WCAG AA:
  - Body text: 4.5:1
  - Large text: 3:1
  - UI boundaries/focus indicators: 3:1 against adjacent colors

### Keyboard & Focus
- Full game and menus operable by keyboard only
- Visible `:focus-visible` states on all actionable controls
- Initial focus order on overlay: Title (read) → Start button → secondary action

### Reduced Motion
- Honor `prefers-reduced-motion: reduce`
- Disable non-essential transforms, particles, and shake

### Color-blind Safety
- Do not encode critical state by color alone
- Snake head/body should differ by shape/contrast, not only hue
- If “new best” indicated, pair color with icon/text label

### Screen Reader Basics
- Use ARIA live region (polite) for key state changes:
  - “Game started”, “Paused”, “Game over. Score X. Best Y.”
- Buttons/controls must have explicit labels

---

## 8) Responsive Behavior (Desktop First, Graceful Mobile)

### Desktop (primary)
- Center board with fixed aspect ratio container
- HUD top-aligned, compact horizontal row
- Overlay centered with max width 480px

### Tablet/Mobile
- Board scales to viewport width with safe margins
- HUD compresses to two-row layout when needed
- Touch gestures enabled; avoid permanent button clutter
- Respect notch/safe-area insets (`env(safe-area-inset-*)`)

### Minimum Viable Sizes
- Min playable board render area: 280x280
- Touch targets: min 44x44px

---

## 9) Anti-Clutter Rules (What NOT to Add)
- No persistent background music by default
- No heavy particle systems or confetti floods
- No more than 3 simultaneous HUD metrics (Score, Best, State)
- No multi-color gradients across entire background
- No flashing animations >3Hz
- No modal stacking (one overlay max)
- No feature creep (skins/shop/achievements) in initial UX scope

---

## 10) Definition of Done (UX Quality)
A build is UX-done when all are true:
1. New user can start first game in under 5 seconds without instructions.
2. Death-to-restart loop is frictionless (≤2 actions, <400ms restart latency after trigger).
3. UI remains visually calm at all times (no competing focal points).
4. Keyboard-only flow is complete and comfortable.
5. Mobile touch play is reliable with low false-direction events.
6. Accessibility checks pass (contrast, focus visibility, reduced motion support).
7. Animation quality feels intentional; no jank at target FPS.
8. HUD and overlays remain legible on 320px wide viewport.

---

## 11) Implementation-Ready Design Tokens & Component Specs

### Core Tokens (CSS Custom Properties)
```css
:root {
  --bg: #0E1116;
  --surface: #141923;
  --surface-elev: #1A2030;
  --text-primary: #F5F7FA;
  --text-secondary: #A9B2C3;
  --accent: #D4AF37;
  --accent-soft: #8C7640;
  --success: #70D6A7;
  --danger: #FF6B6B;
  --grid-line: rgba(255,255,255,0.05);
  --focus-ring: #9CC9FF;

  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  --shadow-soft: 0 6px 24px rgba(0,0,0,0.28);
  --dur-fast: 140ms;
  --dur-med: 240ms;
  --ease-lux: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### Component: HUD
- Height: 56px desktop, 64px mobile wrapped
- Layout: left `Score`, right `Best` + `State`
- Background: `--surface-elev` @ 80–90% opacity + blur (optional, subtle)
- Typography:
  - Label 12px uppercase, secondary color
  - Value 20px medium, primary color

### Component: Board
- Container: rounded `--radius-lg`, background `--surface`, shadow `--shadow-soft`
- Grid line visibility low (`--grid-line`)
- Snake:
  - Head visually distinct (shape/brightness + small eye/notch optional)
  - Body uniform blocks with slight luminance variation allowed
- Food uses `--accent` (or accessible alternative in high-contrast mode)

### Component: Overlays (Start / Pause / Game Over)
- Max width: 480px desktop, 92vw mobile
- Padding: 24px desktop, 16px mobile
- Surface: `--surface-elev`, border 1px rgba(255,255,255,0.08)
- Entrance: fade + y-translate(8px→0)
- Primary button first in tab order

### Component: Buttons
- Size: height 44px min
- Horizontal padding: 16–20px
- Primary: accent fill + dark text if contrast passes; otherwise outline-accent variant
- Secondary: ghost/outline on `--surface-elev`
- States:
  - Hover: slight lift + brightness +2%
  - Active: neutral settle
  - Focus-visible: 2px `--focus-ring`
  - Disabled: 45% opacity, no motion

---

## Top Recommendation Summary (for implementation priority)
1. Nail the **restart loop speed and clarity** first.
2. Enforce **strict visual restraint** (accent scarcity + minimal HUD).
3. Implement **keyboard and touch parity** with reliable direction handling.
4. Ship with **accessibility defaults** (contrast, focus, reduced motion) from day one.
5. Keep motion and sound **subtle, short, and optional** to preserve premium tone.
