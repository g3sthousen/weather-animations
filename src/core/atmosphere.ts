import type { ResolvedConfig } from './types';
import { random } from './rng';

interface FogPlume {
  baseX: number;   // 0..1 of width
  baseY: number;   // 0..1 of height
  speed: number;   // fraction of width per second
  bobAmp: number;  // px
  bobFreq: number;
  phase: number;
  sprite?: OffscreenCanvas;
  spriteR?: number;
}

export function fogBob(time: number, baseY: number, amp: number, freq: number, phase: number): number {
  return baseY + amp * Math.sin(time * freq + phase);
}

const CLOUDY_CELESTIAL_OPACITY: Record<ResolvedConfig['intensity'], number> = {
  light: 0.45,
  medium: 0.22,
  heavy: 0,
};

export function getCelestialOpacity(config: ResolvedConfig): number {
  if (config.condition === 'cloudy') {
    return CLOUDY_CELESTIAL_OPACITY[config.intensity];
  }
  if (config.time === 'day' && (config.condition === 'clear' || config.condition === 'wind')) {
    return 1;
  }
  if (config.time === 'night' && config.condition === 'clear') {
    return 1;
  }
  return 0;
}

export interface AtmosphereState {
  lightningFlash: number;
  lightningTimer: number;
  boltPoints: Array<[number, number]> | null;
  time: number;
  fogPlumes: FogPlume[] | null;
  preflicker: number;       // brief pre-strike flicker [0..1]
  boltBranches: Array<Array<[number, number]>> | null;
}

export function createAtmosphereState(): AtmosphereState {
  return { lightningFlash: 0, lightningTimer: 2000, boltPoints: null, time: 0, fogPlumes: null, preflicker: 0, boltBranches: null };
}

export function updateAtmosphere(state: AtmosphereState, config: ResolvedConfig, delta: number): void {
  state.time += delta;

  if (config.condition === 'storm') {
    state.lightningTimer -= delta * 1000;
    if (state.lightningTimer <= 0 && state.preflicker <= 0 && state.lightningFlash <= 0) {
      state.preflicker = 1; // start pre-flicker; main strike follows
    }
    if (state.preflicker > 0) {
      state.preflicker = Math.max(0, state.preflicker - delta * 12);
      if (state.preflicker <= 0) {
        // main strike
        state.lightningFlash = 1.0;
        const base = config.intensity === 'heavy' ? 1500 : config.intensity === 'medium' ? 2500 : 4000;
        state.lightningTimer = base + random() * base;
        const main = generateBolt();
        state.boltPoints = main;
        state.boltBranches = generateBranches(main);
      }
    }
    state.lightningFlash = Math.max(0, state.lightningFlash - delta * 3.5);
    if (state.lightningFlash <= 0) {
      state.boltPoints = null;
      state.boltBranches = null;
    }
  } else {
    state.lightningFlash = 0;
    state.lightningTimer = 2000;
    state.boltPoints = null;
    state.preflicker = 0;
    state.boltBranches = null;
  }

  if (config.condition === 'fog') {
    if (!state.fogPlumes) {
      state.fogPlumes = Array.from({ length: 4 }, (_, i) => ({
        baseX: random(),
        baseY: 0.45 + i * 0.14 + random() * 0.06,
        speed: 0.01 + random() * 0.02,
        bobAmp: 8 + random() * 10,
        bobFreq: 0.15 + random() * 0.15,
        phase: random() * Math.PI * 2,
      }));
    }
    for (const pl of state.fogPlumes) {
      pl.baseX += pl.speed * delta;
      if (pl.baseX > 1.3) pl.baseX -= 1.6;
    }
  } else {
    state.fogPlumes = null;
  }
}

export function drawAtmosphere(
  ctx: CanvasRenderingContext2D,
  config: ResolvedConfig,
  state: AtmosphereState,
  alpha: number,
  width: number,
  height: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;

  if (config.condition === 'fog') {
    drawFog(ctx, config, state, width, height);
  }

  const flash = Math.max(state.lightningFlash, state.preflicker * 0.4);
  if (flash > 0) {
    ctx.globalAlpha = alpha * flash * 0.45;
    ctx.fillStyle = 'rgba(200,220,255,1)';
    ctx.fillRect(0, 0, width, height);

    if (state.boltPoints && state.lightningFlash > 0) {
      drawLightningBolt(ctx, state.boltPoints, alpha * state.lightningFlash, width, height);
      if (state.boltBranches) {
        for (const br of state.boltBranches) {
          drawLightningBolt(ctx, br, alpha * state.lightningFlash * 0.7, width, height);
        }
      }
    }
  }

  if (config.fidelity === 'rich' && state.lightningFlash > 0 && config.condition === 'storm') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = alpha * state.lightningFlash * 0.5;
    const g = ctx.createLinearGradient(0, 0, 0, height * 0.5);
    g.addColorStop(0, 'rgba(150,180,255,0.6)');
    g.addColorStop(1, 'rgba(150,180,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height * 0.5);
    ctx.restore();
  }

  ctx.restore();
}

export function drawCelestial(
  ctx: CanvasRenderingContext2D,
  config: ResolvedConfig,
  state: AtmosphereState,
  alpha: number,
  width: number,
  height: number,
): void {
  const opacity = getCelestialOpacity(config);
  if (opacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha * opacity;
  if (config.time === 'day') {
    drawSun(ctx, config, state, width, height);
  } else {
    drawMoon(ctx, width, height);
  }
  ctx.restore();
}

function generateBolt(): Array<[number, number]> {
  const startX = 0.2 + random() * 0.6;
  const points: Array<[number, number]> = [[startX, 0.08]];
  let cx = startX;
  for (let i = 1; i <= 8; i++) {
    cx += (random() - 0.5) * 0.13;
    cx = Math.max(0.05, Math.min(0.95, cx));
    points.push([cx, 0.08 + (0.52 * i) / 8]);
  }
  return points;
}

function generateBranches(main: Array<[number, number]>): Array<Array<[number, number]>> {
  const branches: Array<Array<[number, number]>> = [];
  const n = 1 + Math.floor(random() * 2); // 1–2 branches
  for (let b = 0; b < n; b++) {
    const startIdx = 2 + Math.floor(random() * (main.length - 3));
    const [sx, sy] = main[startIdx];
    let cx = sx;
    let cy = sy;
    const pts: Array<[number, number]> = [[cx, cy]];
    const dir = random() < 0.5 ? -1 : 1;
    for (let i = 0; i < 3; i++) {
      cx = Math.max(0.02, Math.min(0.98, cx + dir * (0.04 + random() * 0.05)));
      cy = Math.min(0.95, cy + 0.06 + random() * 0.05);
      pts.push([cx, cy]);
    }
    branches.push(pts);
  }
  return branches;
}

function drawLightningBolt(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  alpha: number,
  width: number,
  height: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const path = () => {
    ctx.beginPath();
    ctx.moveTo(points[0][0] * width, points[0][1] * height);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0] * width, points[i][1] * height);
    }
  };

  path();
  ctx.strokeStyle = 'rgba(140,180,255,0.5)';
  ctx.lineWidth = 10;
  ctx.shadowColor = '#90b8ff';
  ctx.shadowBlur = 30;
  ctx.stroke();

  path();
  ctx.strokeStyle = 'rgba(200,220,255,0.85)';
  ctx.lineWidth = 3.5;
  ctx.shadowBlur = 12;
  ctx.stroke();

  path();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 0;
  ctx.stroke();

  ctx.restore();
}

function drawSun(ctx: CanvasRenderingContext2D, config: ResolvedConfig, state: AtmosphereState, width: number, height: number): void {
  const x = width * 0.75;
  const y = height * 0.18;
  const r = Math.min(width, height) * 0.08;

  // softer, larger atmospheric halo
  const outerGrad = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 4);
  outerGrad.addColorStop(0, 'rgba(255,240,180,0.45)');
  outerGrad.addColorStop(0.5, 'rgba(255,240,180,0.12)');
  outerGrad.addColorStop(1, 'rgba(255,240,180,0)');
  ctx.fillStyle = outerGrad;
  ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);

  if (config.fidelity === 'rich') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(state.time * 0.05);
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = 'rgba(255,245,200,1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 1.3, Math.sin(a) * r * 1.3);
      ctx.lineTo(Math.cos(a) * r * 2.6, Math.sin(a) * r * 2.6);
      ctx.stroke();
    }
    ctx.restore();
  }

  const innerGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
  innerGrad.addColorStop(0, '#fffde7');
  innerGrad.addColorStop(1, '#ffe082');
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoon(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const x = width * 0.75;
  const y = height * 0.18;
  const r = Math.min(width, height) * 0.06;

  const grad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
  grad.addColorStop(0, '#fffde7');
  grad.addColorStop(0.6, '#fff8e1');
  grad.addColorStop(1, '#ffecb3');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // cooler glow
  const glow = ctx.createRadialGradient(x, y, r, x, y, r * 2.6);
  glow.addColorStop(0, 'rgba(220,230,245,0.22)');
  glow.addColorStop(1, 'rgba(220,230,245,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
  ctx.fill();

  // 2–3 darker crater spots
  ctx.fillStyle = 'rgba(180,185,200,0.35)';
  const craters: Array<[number, number, number]> = [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.13], [0.05, 0.35, 0.1]];
  for (const [dx, dy, cr] of craters) {
    ctx.beginPath();
    ctx.arc(x + dx * r, y + dy * r, cr * r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function buildPlumeSprite(radius: number, night: boolean): OffscreenCanvas {
  const size = Math.ceil(radius * 2);
  const off = new OffscreenCanvas(size, size);
  const c = off.getContext('2d')!;
  const rgb = night ? '90,100,112' : '205,210,216';
  const g = c.createRadialGradient(radius, radius, 0, radius, radius, radius);
  g.addColorStop(0, `rgba(${rgb},0.5)`);
  g.addColorStop(0.5, `rgba(${rgb},0.22)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = g;
  c.beginPath();
  c.arc(radius, radius, radius, 0, Math.PI * 2);
  c.fill();
  return off;
}

function drawFog(
  ctx: CanvasRenderingContext2D,
  config: ResolvedConfig,
  state: AtmosphereState,
  width: number,
  height: number,
): void {
  if (!state.fogPlumes) return;
  const night = config.time === 'night';
  const radius = width * 0.4;
  for (const pl of state.fogPlumes) {
    if (!pl.sprite || pl.spriteR !== radius) {
      pl.sprite = buildPlumeSprite(radius, night);
      pl.spriteR = radius;
    }
    const x = pl.baseX * width - radius;
    const y = fogBob(state.time, pl.baseY * height, pl.bobAmp, pl.bobFreq, pl.phase) - radius;
    ctx.drawImage(pl.sprite, x, y);
    // wrap copy so the plume re-enters from the left seamlessly
    if (pl.baseX * width - radius > width - radius * 2) {
      ctx.drawImage(pl.sprite, x - width - radius * 2, y);
    }
  }
}
