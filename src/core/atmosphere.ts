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

export interface AtmosphereState {
  lightningFlash: number;
  lightningTimer: number;
  boltPoints: Array<[number, number]> | null;
  time: number;
  fogPlumes: FogPlume[] | null;
}

export function createAtmosphereState(): AtmosphereState {
  return { lightningFlash: 0, lightningTimer: 2000, boltPoints: null, time: 0, fogPlumes: null };
}

export function updateAtmosphere(state: AtmosphereState, config: ResolvedConfig, delta: number): void {
  state.time += delta;

  if (config.condition === 'storm') {
    state.lightningTimer -= delta * 1000;
    if (state.lightningTimer <= 0) {
      state.lightningFlash = 1.0;
      const base = config.intensity === 'heavy' ? 1500 : config.intensity === 'medium' ? 2500 : 4000;
      state.lightningTimer = base + random() * base;
      state.boltPoints = generateBolt();
    }
    state.lightningFlash = Math.max(0, state.lightningFlash - delta * 3.5);
    if (state.lightningFlash <= 0) state.boltPoints = null;
  } else {
    state.lightningFlash = 0;
    state.lightningTimer = 2000;
    state.boltPoints = null;
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

  if (config.time === 'day' && (config.condition === 'clear' || config.condition === 'wind')) {
    drawSun(ctx, width, height);
  }

  if (config.time === 'night' && config.condition === 'clear') {
    drawMoon(ctx, width, height);
  }

  if (config.condition === 'fog') {
    drawFog(ctx, config, state, width, height);
  }

  if (state.lightningFlash > 0) {
    ctx.globalAlpha = alpha * state.lightningFlash * 0.45;
    ctx.fillStyle = 'rgba(200,220,255,1)';
    ctx.fillRect(0, 0, width, height);

    if (state.boltPoints) {
      drawLightningBolt(ctx, state.boltPoints, alpha * state.lightningFlash, width, height);
    }
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

function drawSun(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const x = width * 0.75;
  const y = height * 0.18;
  const r = Math.min(width, height) * 0.08;

  const outerGrad = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3);
  outerGrad.addColorStop(0, 'rgba(255,240,180,0.4)');
  outerGrad.addColorStop(1, 'rgba(255,240,180,0)');
  ctx.fillStyle = outerGrad;
  ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);

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

  const glow = ctx.createRadialGradient(x, y, r, x, y, r * 2.5);
  glow.addColorStop(0, 'rgba(255,248,220,0.2)');
  glow.addColorStop(1, 'rgba(255,248,220,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
  ctx.fill();
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
