// tests/unit/atmosphere.test.ts
import { describe, it, expect } from 'vitest';
import { fogBob } from '../../src/core/atmosphere';

describe('fogBob', () => {
  it('returns baseY at time 0 with phase 0', () => {
    expect(fogBob(0, 100, 10, 0.5, 0)).toBeCloseTo(100);
  });
  it('adds amplitude at the sine peak', () => {
    expect(fogBob(Math.PI / 2 / 0.5, 100, 10, 0.5, 0)).toBeCloseTo(110);
  });
  it('respects phase offset', () => {
    expect(fogBob(0, 100, 10, 0.5, Math.PI / 2)).toBeCloseTo(110);
  });
});
