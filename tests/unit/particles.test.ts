import { describe, it, expect } from 'vitest';
import { ParticlePool, getFidelityScale, depthFactor, rainSplashes, splashRadius, splashAlpha, gustOffset, bounceVelocity, shouldStopBouncing, hailBounceConfig } from '../../src/core/particles';
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
