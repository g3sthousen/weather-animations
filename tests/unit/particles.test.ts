import { describe, it, expect } from 'vitest';
import { ParticlePool, getFidelityScale, depthFactor, rainSplashes, splashRadius, splashAlpha, gustOffset } from '../../src/core/particles';
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
