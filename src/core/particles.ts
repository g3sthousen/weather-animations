import type { Particle, ResolvedConfig } from './types';

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
