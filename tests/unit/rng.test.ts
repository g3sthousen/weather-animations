import { describe, it, expect, afterEach } from 'vitest';
import { random, seedRng, resetRng } from '../../src/core/rng';

describe('rng', () => {
  afterEach(() => resetRng());

  it('returns values in [0,1) by default', () => {
    const v = random();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });

  it('is deterministic for a given seed', () => {
    seedRng(42);
    const a = [random(), random(), random()];
    seedRng(42);
    const b = [random(), random(), random()];
    expect(a).toEqual(b);
  });

  it('produces different sequences for different seeds', () => {
    seedRng(1);
    const a = random();
    seedRng(2);
    const b = random();
    expect(a).not.toEqual(b);
  });

  it('resetRng restores non-seeded randomness', () => {
    seedRng(7);
    resetRng();
    const v = random();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });
});
