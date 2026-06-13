import type { Particle, ResolvedConfig } from './types';
import { random } from './rng';

export class ParticlePool {
  readonly particles: Particle[];
  private cursor = 0;

  constructor(size: number) {
    this.particles = Array.from({ length: size }, () => ({
      x: 0, y: 0, vx: 0, vy: 0,
      alpha: 0, size: 1, length: 1, phase: 0,
      active: false,
    }));
  }

  spawn(): Particle | null {
    const start = this.cursor;
    do {
      const p = this.particles[this.cursor];
      this.cursor = (this.cursor + 1) % this.particles.length;
      if (!p.active) {
        p.active = true;
        return p;
      }
    } while (this.cursor !== start);
    return null;
  }

  reset(): void {
    for (const p of this.particles) p.active = false;
    this.cursor = 0;
  }
}

const INTENSITY_SCALE = { light: 0.3, medium: 0.65, heavy: 1.0 } as const;

export function getIntensityScale(config: ResolvedConfig): number {
  return INTENSITY_SCALE[config.intensity];
}

// --- Particle System ---

const POOL_SIZE = 600;

export class ParticleSystem {
  private pool: ParticlePool;
  private spawnAccum = 0;
  private time = 0;
  private config: ResolvedConfig | null = null;
  private width = 0;
  private height = 0;

  constructor() {
    this.pool = new ParticlePool(POOL_SIZE);
  }

  init(config: ResolvedConfig, width: number, height: number): void {
    this.config = config;
    this.width = width;
    this.height = height;
    this.pool.reset();
    this.spawnAccum = 0;
    this.time = 0;

    if (config.condition === 'clear' && config.time === 'night') {
      const count = Math.floor(120 * getIntensityScale(config));
      for (let i = 0; i < count; i++) spawnStar(this.pool, width, height);
    }
  }

  update(delta: number): void {
    if (!this.config) return;
    this.time += delta;
    const cfg = this.config;
    const scale = getIntensityScale(cfg);
    const w = this.width;
    const h = this.height;

    for (const p of this.pool.particles) {
      if (!p.active) continue;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.phase += delta;

      if (cfg.condition === 'snow') {
        p.vx = Math.sin(p.phase * 0.8) * 18;
      }
      if (cfg.condition === 'clear' && cfg.time === 'night') {
        p.alpha = 0.5 + 0.5 * Math.sin(p.phase * 2.5 + p.size);
      }

      if (p.y > h + 20 || p.x < -20 || p.x > w + 20 || p.y < -20) {
        p.active = false;
      }
    }

    const rates: Partial<Record<string, number>> = {
      rain: 120 * scale,
      'storm-rain': 280 * scale,
      snow: 30 * scale,
      wind: 60 * scale,
    };
    const condKey = cfg.condition === 'storm' ? 'storm-rain' : cfg.condition;
    const rate = rates[condKey];

    if (rate) {
      this.spawnAccum += rate * delta;
      while (this.spawnAccum >= 1) {
        this.spawnAccum -= 1;
        if (cfg.condition === 'rain') spawnRain(this.pool, w);
        else if (cfg.condition === 'storm') spawnStormRain(this.pool, w);
        else if (cfg.condition === 'snow') spawnSnow(this.pool, w);
        else if (cfg.condition === 'wind') spawnWind(this.pool, w, h);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, alpha: number, config?: ResolvedConfig): void {
    const cfg = config ?? this.config;
    if (!cfg) return;
    ctx.save();
    for (const p of this.pool.particles) {
      if (!p.active) continue;
      drawParticle(ctx, p, cfg, alpha);
    }
    ctx.restore();
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, cfg: ResolvedConfig, systemAlpha: number): void {
  ctx.globalAlpha = systemAlpha * p.alpha;

  if (cfg.condition === 'rain' || cfg.condition === 'storm') {
    ctx.strokeStyle = cfg.condition === 'storm' ? 'rgba(180,200,220,0.8)' : 'rgba(160,190,220,0.7)';
    ctx.lineWidth = cfg.condition === 'storm' ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.vx * 0.04, p.y + p.length);
    ctx.stroke();
  } else if (cfg.condition === 'snow') {
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (cfg.condition === 'clear' && cfg.time === 'night') {
    ctx.fillStyle = `rgba(255,255,240,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (cfg.condition === 'wind') {
    ctx.strokeStyle = `rgba(180,210,240,${p.alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.length, p.y);
    ctx.stroke();
  }
}

function spawnRain(pool: ParticlePool, w: number): void {
  const p = pool.spawn();
  if (!p) return;
  p.x = random() * (w + 100) - 50;
  p.y = -10;
  p.vx = -20;
  p.vy = 650 + random() * 200;
  p.alpha = 0.4 + random() * 0.4;
  p.size = 1;
  p.length = 14 + random() * 10;
  p.phase = 0;
}

function spawnStormRain(pool: ParticlePool, w: number): void {
  const p = pool.spawn();
  if (!p) return;
  p.x = random() * (w + 100) - 50;
  p.y = -10;
  p.vx = -35;
  p.vy = 900 + random() * 300;
  p.alpha = 0.5 + random() * 0.4;
  p.size = 1;
  p.length = 20 + random() * 14;
  p.phase = 0;
}

function spawnSnow(pool: ParticlePool, w: number): void {
  const p = pool.spawn();
  if (!p) return;
  p.x = random() * w;
  p.y = -10;
  p.vx = 0;
  p.vy = 40 + random() * 50;
  p.alpha = 0.6 + random() * 0.4;
  p.size = 1.5 + random() * 3;
  p.length = 0;
  p.phase = random() * Math.PI * 2;
}

function spawnStar(pool: ParticlePool, w: number, h: number): void {
  const p = pool.spawn();
  if (!p) return;
  p.x = random() * w;
  p.y = random() * h * 0.7;
  p.vx = 0;
  p.vy = 0;
  p.alpha = 0.3 + random() * 0.7;
  p.size = 0.5 + random() * 1.5;
  p.length = 0;
  p.phase = random() * Math.PI * 2;
}

function spawnWind(pool: ParticlePool, w: number, h: number): void {
  const p = pool.spawn();
  if (!p) return;
  p.x = -20;
  p.y = random() * h;
  p.vx = 300 + random() * 200;
  p.vy = 0;
  p.alpha = 0.2 + random() * 0.5;
  p.size = 1;
  p.length = 30 + random() * 60;
  p.phase = 0;
}
