import type { ResolvedConfig } from './types';
import { random } from './rng';

export interface AtmosphereState {
  lightningFlash: number;
  lightningTimer: number;
  boltPoints: Array<[number, number]> | null;
  time: number;
}

export function createAtmosphereState(): AtmosphereState {
  return { lightningFlash: 0, lightningTimer: 2000, boltPoints: null, time: 0 };
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
    drawFog(ctx, config, width, height);
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

function drawFog(ctx: CanvasRenderingContext2D, config: ResolvedConfig, width: number, height: number): void {
  const fogColor = config.time === 'night' ? 'rgba(80,90,100,' : 'rgba(200,205,210,';
  const bands = 5;
  for (let i = 0; i < bands; i++) {
    const y = (height / bands) * i + height * 0.1;
    const grad = ctx.createLinearGradient(0, y, 0, y + height * 0.2);
    grad.addColorStop(0, `${fogColor}0)`);
    grad.addColorStop(0.5, `${fogColor}0.18)`);
    grad.addColorStop(1, `${fogColor}0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, width, height * 0.2);
  }
}
