import { describe, it, expect } from 'vitest';
import { ParticlePool, getFidelityScale } from '../../src/core/particles';
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
