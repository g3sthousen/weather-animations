import { describe, it, expect } from 'vitest';
import {
  createTransition,
  updateTransition,
  getProgress,
  isComplete,
} from '../../src/core/transition';
import type { ResolvedConfig } from '../../src/core/types';

const cfgA: ResolvedConfig = {
  condition: 'clear',
  intensity: 'medium',
  time: 'day',
  transitionMs: 1000,
  fidelity: 'subtle',
  moonPhase: 'full',
  celestialEvent: 'none',
  celestialProgress: 0.5,
};
const cfgB: ResolvedConfig = {
  condition: 'rain',
  intensity: 'heavy',
  time: 'night',
  transitionMs: 1000,
  fidelity: 'subtle',
  moonPhase: 'full',
  celestialEvent: 'none',
  celestialProgress: 0.5,
};

describe('createTransition', () => {
  it('creates transition with elapsed 0', () => {
    const t = createTransition(cfgA, cfgB);
    expect(t.elapsed).toBe(0);
    expect(t.from).toBe(cfgA);
    expect(t.to).toBe(cfgB);
  });
});

describe('getProgress', () => {
  it('returns 0 at start', () => {
    const t = createTransition(cfgA, cfgB);
    expect(getProgress(t)).toBe(0);
  });

  it('returns eased value at 50%', () => {
    const t = createTransition(cfgA, cfgB);
    t.elapsed = 500;
    expect(getProgress(t)).toBeCloseTo(0.5);
  });

  it('returns 1 when elapsed >= duration', () => {
    const t = createTransition(cfgA, cfgB);
    t.elapsed = 1200;
    expect(getProgress(t)).toBe(1);
  });
});

describe('isComplete', () => {
  it('returns false before duration', () => {
    const t = createTransition(cfgA, cfgB);
    t.elapsed = 900;
    expect(isComplete(t)).toBe(false);
  });

  it('returns true at duration', () => {
    const t = createTransition(cfgA, cfgB);
    t.elapsed = 1000;
    expect(isComplete(t)).toBe(true);
  });
});

describe('updateTransition', () => {
  it('advances elapsed by delta ms', () => {
    const t = createTransition(cfgA, cfgB);
    const updated = updateTransition(t, 0.1);
    expect(updated.elapsed).toBeCloseTo(100);
  });

  it('caps elapsed at duration', () => {
    const t = createTransition(cfgA, cfgB);
    const updated = updateTransition(t, 2.0);
    expect(updated.elapsed).toBe(1000);
  });
});
