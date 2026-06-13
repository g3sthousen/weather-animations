# Realistic Weather Effects Upgrade — Design

**Date:** 2026-06-13
**Status:** Approved
**Scope:** All 8 conditions (incl. new `hail`), Canvas 2D only, new `fidelity` config option.

## Goal

Make every weather state look noticeably more realistic while keeping the existing
architecture (sky / clouds / particles / atmosphere modules, transition engine),
the Canvas 2D rendering path, and the small bundle size. No breaking API changes.
Also adds one new condition, `hail`, that follows the same conventions (depth,
sprite principle, fidelity gating).

## 1. API & Architecture

### `fidelity` config option

- `WeatherConfig.fidelity?: 'subtle' | 'rich'`, default `'subtle'`.
- Threaded through `ResolvedConfig` exactly like `intensity`.
- Controls two things:
  - **Particle budget:** `subtle` ≈ current spawn rates, `rich` ≈ 1.8×.
    `POOL_SIZE` grows from 600 to 900 so `rich` + `heavy` (including splash
    particles, which share the pool) never starves.
  - **Extra effects:** sun rays, lightning cloud under-lighting, star glints,
    wind leaf particles, and **hail bounce** render only at `rich`.
- Always-on regardless of fidelity (core realism, not decoration): particle
  depth, time-of-day cloud lighting, animated fog, and **rain splashes**
  (gated by intensity, not fidelity — see Rain below).

### Particle depth

- New field `depth: 0..1` on `Particle`, rolled at spawn time.
- Scales size, speed, and alpha linearly: far particles are small, slow, faint;
  near particles are large, fast, strong.
- No new subsystem — one extra field plus scaling in the spawn/draw functions.
- A second new field `bounces: number` on `Particle` (default 0) supports hail
  bounce; ignored by all other conditions.

### New condition: `hail`

- Added to the `Condition` union and `VALID_CONDITIONS` → 8 conditions, 16 states.
- No breaking API changes; behaves like any other condition.

### Cloud parallax

- Reuse the existing `LAYER_SPEEDS` mechanism; spread the speeds further apart
  and let lower layers sit deeper in the frame (clouds distributed down to
  ~45% of viewport height instead of only the top band).

### Compatibility

- Calls without `fidelity` behave as before, just better-looking.
- The transition engine is untouched; all new effects live inside the modules
  that are already crossfaded per state.

## 2. Effects per condition

### Rain
- Drops scattered in depth (far: short/slow/faint, near: long/fast/strong).
- Fall angle follows a global wind value with a slow sinusoidal gust drift so
  the whole rain field "breathes".
- **Splash on impact, gated by intensity (not fidelity):** at `medium`/`heavy`,
  drops hitting the bottom edge spawn a short-lived splash — a small expanding
  ellipse ring, ~150 ms. At `light`: no splash (too little visible rain).
  Storm rain (heavy-equivalent) gets splashes too.
- `rich` strengthens the splash: more near drops produce a ring, and rings are
  larger. `rich` does not enable splashes — intensity does.
- A raindrop splashes; it does not bounce (a velocity reflection would read as
  rubber balls). Bounce is reserved for solid hail.

### Hail
- Solid icy spheres: drawn as filled circles with a faint rim shimmer, falling
  fast and near-vertically (slight wind offset). Sparser than rain (~90·scale
  spawn rate).
- Scattered in depth like all particles (far: small/slow/faint, near:
  large/fast/bright).
- Backdrop: own dark grey-green sky palette (between `rain` and `storm`), dense
  dark clouds (~0.85 opacity), **no lightning**.
- `rich`: stones hitting the bottom edge **bounce** — `vy` reflects with damping
  (≈ −0.4), a small horizontal kick, size shrinks slightly; the stone dies after
  1–2 bounces or once the rebound velocity is negligible. At `subtle`: the stone
  disappears at the bottom edge like rain.

### Snow
- Per-flake flutter frequency and amplitude (replaces the current global
  `sin(phase * 0.8) * 18` shared by all flakes).
- Far flakes: smaller, slower, drawn as soft circles (radial falloff) instead
  of hard arcs. Near flakes tumble harder and drift with the wind value.

### Clouds
- Two shape types mixed: puffy cumulus (current) + flat stretched stratus.
- Time-of-day lighting baked into the sprite: warm bright top edge by day,
  cool faint rim light at night, darker flatter bases for rain/storm.
- Lower layers larger and faster (parallax spread).

### Fog
- Full rewrite: 4 large soft drifting plume sprites (pre-rendered overlapping
  radial gradients, built once like cloud sprites).
- Plumes drift horizontally at different speeds and bob vertically (sine).
- Density higher near the bottom. Fog must be clearly visible and alive.

### Storm
- Two-phase lightning: brief pre-flicker, then main strike.
- Bolt with 1–2 side branches.
- The area flash also brightens the sky element's gradient briefly.
- `rich`: cloud sprites are lit from within during the flash via a `lighter`
  composite overlay — the single biggest realism win.
- Storm rain gets stronger gust/angle variation than normal rain.

### Clear / Sun / Moon / Stars
- Sun: softer core, larger atmospheric halo; `rich`: subtle rotating rays.
- Moon: 2–3 darker crater spots, cooler more realistic glow.
- Stars: varied twinkle speeds (existing) + a few brighter "hero" stars with
  a cross glint at `rich`.

### Wind
- Streaks drawn as slightly curved quadratic curves instead of straight lines,
  scattered in depth.
- `rich`: a few swirling leaf particles with rotation.

## 3. Tests, performance, demo

### Visual test repair (first step)
- Current Playwright baselines are entirely blank/white — tests capture before
  the first real frame renders. Investigate and fix before anything else.
- Add a deterministic test mode to the engine: injectable RNG seed and an
  "advance N frames" hook so snapshots are reproducible instead of random.

### Unit tests
- New pure math (depth scaling, splash lifecycle, splash intensity gate, hail
  bounce lifecycle, gust drift, fog bob offsets) gets Vitest coverage alongside
  the existing `math` / `particles` / `transition` tests.

### Performance guardrails
- Sprite principle everywhere: expensive shapes (clouds, fog plumes) render
  once to OffscreenCanvas and are only blitted per frame. No new per-frame
  gradient/blur operations.
- Budget: max ~900 active particles at `rich` + `heavy`; target 60 fps on a
  mid-range laptop.

### Demo
- Fourth button row: `Subtle | Rich`.
- `Hail` button added to the condition row.
- New baselines for all 16 states, plus rich variants of the most distinctive
  ones (rain, storm, fog, hail).

### Implementation order
Each step committed and visually verified on its own:
1. Deterministic test mode & baseline fix
2. `fidelity` API
3. Particle depth (rain/snow)
4. Splashes (intensity-gated) & gust drift
5. Hail (palette, dark clouds, depth-aware stones, fidelity-gated bounce)
6. Cloud upgrade (shapes, lighting, parallax)
7. Fog rewrite
8. Storm/lightning
9. Sun/moon/stars
10. Wind
11. Final baselines
