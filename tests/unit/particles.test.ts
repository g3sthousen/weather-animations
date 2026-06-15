import { describe, it, expect } from 'vitest';
import { ParticlePool, ParticleSystem, getFidelityScale, depthFactor, rainSplashes, splashRadius, splashAlpha, gustOffset, bounceVelocity, shouldStopBouncing, hailBounceConfig, windGustSpeedMultiplier } from '../../src/core/particles';
import { seedRng } from '../../src/core/rng';
import { resolveConfig } from '../../src/core/types';

describe('ParticlePool', () => {
  it('creates pool with given size', () => {
    const pool = new ParticlePool(10);
    expect(pool.particles.length).toBe(10);
  });

  it('all particles inactive on creation', () => {
    const pool = new ParticlePool(5);
    expect(pool.particles.every(p => !p.active)).toBe(true);
  });

  it('spawn returns an inactive particle and marks it active', () => {
    const pool = new ParticlePool(5);
    const p = pool.spawn();
    expect(p).not.toBeNull();
    expect(p!.active).toBe(true);
  });

  it('spawn returns different particles each call', () => {
    const pool = new ParticlePool(5);
    const a = pool.spawn();
    const b = pool.spawn();
    expect(a).not.toBe(b);
  });

  it('spawn returns null when pool exhausted', () => {
    const pool = new ParticlePool(2);
    pool.spawn();
    pool.spawn();
    expect(pool.spawn()).toBeNull();
  });

  it('reset marks all particles inactive', () => {
    const pool = new ParticlePool(5);
    pool.spawn();
    pool.spawn();
    pool.reset();
    expect(pool.particles.every(p => !p.active)).toBe(true);
  });

  it('can spawn again after reset', () => {
    const pool = new ParticlePool(2);
    pool.spawn();
    pool.spawn();
    pool.reset();
    expect(pool.spawn()).not.toBeNull();
  });
});

describe('getFidelityScale', () => {
  it('is 1 at subtle', () => {
    expect(getFidelityScale(resolveConfig({ condition: 'rain' }))).toBe(1);
  });
  it('is 1.8 at rich', () => {
    expect(getFidelityScale(resolveConfig({ condition: 'rain', fidelity: 'rich' }))).toBeCloseTo(1.8);
  });
});

describe('depthFactor', () => {
  it('returns far value at depth 0', () => {
    expect(depthFactor(0, 0.4, 1)).toBeCloseTo(0.4);
  });
  it('returns near value at depth 1', () => {
    expect(depthFactor(1, 0.4, 1)).toBeCloseTo(1);
  });
  it('interpolates linearly at depth 0.5', () => {
    expect(depthFactor(0.5, 0.4, 1)).toBeCloseTo(0.7);
  });
});

describe('rainSplashes gate', () => {
  it('off at light', () => expect(rainSplashes('light')).toBe(false));
  it('on at medium', () => expect(rainSplashes('medium')).toBe(true));
  it('on at heavy', () => expect(rainSplashes('heavy')).toBe(true));
});

describe('splash lifecycle', () => {
  it('radius grows from 0 to max over life', () => {
    expect(splashRadius(0, 10, 0.15)).toBeCloseTo(0);
    expect(splashRadius(0.15, 10, 0.15)).toBeCloseTo(10);
    expect(splashRadius(0.075, 10, 0.15)).toBeCloseTo(5);
  });
  it('radius clamps past life', () => {
    expect(splashRadius(1, 10, 0.15)).toBeCloseTo(10);
  });
  it('alpha fades from 1 to 0 over life', () => {
    expect(splashAlpha(0, 0.15)).toBeCloseTo(1);
    expect(splashAlpha(0.15, 0.15)).toBeCloseTo(0);
  });
});

describe('gustOffset', () => {
  it('returns base at sin=0', () => {
    expect(gustOffset(0, -20, 10, 0.5)).toBeCloseTo(-20);
  });
  it('oscillates within base ± amp', () => {
    const v = gustOffset(Math.PI / 2 / 0.5, -20, 10, 0.5);
    expect(v).toBeCloseTo(-10);
  });
});

describe('hail bounce', () => {
  it('disables bounces at light intensity even in rich fidelity', () => {
    expect(hailBounceConfig('light', false).enabled).toBe(false);
    expect(hailBounceConfig('light', true).enabled).toBe(false);
  });

  it('enables a smaller bounce at medium intensity than heavy intensity', () => {
    const medium = hailBounceConfig('medium', false);
    const heavy = hailBounceConfig('heavy', false);

    expect(medium.enabled).toBe(true);
    expect(heavy.enabled).toBe(true);
    expect(medium.maxBounces).toBe(1);
    expect(medium.damping).toBeCloseTo(0.32);
    expect(medium.minVelocity).toBe(90);
    expect(heavy.maxBounces).toBe(2);
    expect(heavy.damping).toBeCloseTo(0.42);
    expect(heavy.minVelocity).toBe(80);
  });

  it('rich fidelity strengthens medium and heavy hail bounces without enabling light', () => {
    const medium = hailBounceConfig('medium', false);
    const mediumRich = hailBounceConfig('medium', true);
    const heavy = hailBounceConfig('heavy', false);
    const heavyRich = hailBounceConfig('heavy', true);

    expect(hailBounceConfig('light', true).enabled).toBe(false);
    expect(mediumRich.maxBounces).toBeGreaterThan(medium.maxBounces);
    expect(heavyRich.maxBounces).toBeGreaterThan(heavy.maxBounces);
    expect(mediumRich.lateralJitter).toBeGreaterThan(medium.lateralJitter);
    expect(heavyRich.lateralJitter).toBeGreaterThan(heavy.lateralJitter);
  });

  it('reflects and damps vertical velocity', () => {
    expect(bounceVelocity(900, 0.4)).toBeCloseTo(-360);
  });
  it('stops after max bounces', () => {
    expect(shouldStopBouncing(-300, 2, 2, 80)).toBe(true);
  });
  it('stops when rebound velocity is negligible', () => {
    expect(shouldStopBouncing(-50, 0, 2, 80)).toBe(true);
  });
  it('keeps bouncing while energetic and under the cap', () => {
    expect(shouldStopBouncing(-300, 1, 2, 80)).toBe(false);
  });
});

describe('wind particles', () => {
  it('increases gust speed by intensity', () => {
    expect(windGustSpeedMultiplier('light')).toBeLessThan(windGustSpeedMultiplier('medium'));
    expect(windGustSpeedMultiplier('medium')).toBeLessThan(windGustSpeedMultiplier('heavy'));
    expect(windGustSpeedMultiplier('medium')).toBe(1);
  });

  it('spawns subtle gust strokes without leaf particles in rich fidelity', () => {
    seedRng(12345);
    const system = new ParticleSystem();
    system.init(resolveConfig({ condition: 'wind', intensity: 'medium', fidelity: 'rich' }), 800, 400);

    for (let i = 0; i < 20; i++) system.update(0.1);

    const particles = (system as any).pool.particles.filter((p: any) => p.active);
    const gusts = particles.filter((p: any) => p.kind === 'primary');

    expect(particles.every((p: any) => p.kind === 'primary')).toBe(true);
    expect(gusts.length).toBeGreaterThan(20);
    expect(Math.max(...gusts.map((p: any) => p.alpha))).toBeLessThanOrEqual(0.42);
    expect(Math.max(...gusts.map((p: any) => p.length))).toBeLessThanOrEqual(82);
  });

  it('keeps a gust alive while any part of the stroke is still visible', () => {
    const system = new ParticleSystem();
    system.init(resolveConfig({ condition: 'wind' }), 100, 100);
    const particle = (system as any).pool.particles[0];
    Object.assign(particle, {
      active: true,
      kind: 'primary',
      x: -50,
      y: 50,
      vx: 0,
      vy: 0,
      alpha: 0.3,
      size: 1,
      length: 80,
      phase: 0,
      depth: 0.5,
      bounces: 0,
    });

    system.update(0);

    expect(particle.active).toBe(true);
  });
});

describe('expanded condition particles', () => {
  it('spawns drizzle as fewer and finer rain strokes', () => {
    seedRng(12345);
    const drizzle = new ParticleSystem();
    drizzle.init(resolveConfig({ condition: 'drizzle', intensity: 'medium' }), 800, 400);
    for (let i = 0; i < 20; i++) drizzle.update(0.1);

    seedRng(12345);
    const rain = new ParticleSystem();
    rain.init(resolveConfig({ condition: 'rain', intensity: 'medium' }), 800, 400);
    for (let i = 0; i < 20; i++) rain.update(0.1);

    const drizzleParticles = (drizzle as any).pool.particles.filter((p: any) => p.active && p.kind === 'primary');
    const rainParticles = (rain as any).pool.particles.filter((p: any) => p.active && p.kind === 'primary');

    expect(drizzleParticles.length).toBeGreaterThan(10);
    expect(drizzleParticles.length).toBeLessThan(rainParticles.length);
    expect(Math.max(...drizzleParticles.map((p: any) => p.length))).toBeLessThan(14);
    expect(Math.max(...drizzleParticles.map((p: any) => p.alpha))).toBeLessThan(0.55);
  });

  it('spawns sleet as both rain streaks and snow-like pellets', () => {
    seedRng(12345);
    const system = new ParticleSystem();
    system.init(resolveConfig({ condition: 'sleet', intensity: 'heavy' }), 800, 400);
    for (let i = 0; i < 20; i++) system.update(0.1);

    const particles = (system as any).pool.particles.filter((p: any) => p.active && p.kind === 'primary');
    const streaks = particles.filter((p: any) => p.length > 0);
    const pellets = particles.filter((p: any) => p.length === 0);

    expect(streaks.length).toBeGreaterThan(10);
    expect(pellets.length).toBeGreaterThan(5);
  });
});
