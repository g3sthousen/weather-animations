// tests/unit/atmosphere.test.ts
import { describe, it, expect } from 'vitest';
import { fogBob, getCelestialOpacity } from '../../src/core/atmosphere';
import { resolveConfig } from '../../src/core/types';

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

describe('getCelestialOpacity', () => {
  it('lets cloudy light and medium show celestial bodies while heavy stays covered', () => {
    expect(getCelestialOpacity(resolveConfig({ condition: 'cloudy', intensity: 'light' }))).toBeCloseTo(0.45);
    expect(getCelestialOpacity(resolveConfig({ condition: 'cloudy', intensity: 'medium' }))).toBeCloseTo(0.22);
    expect(getCelestialOpacity(resolveConfig({ condition: 'cloudy', intensity: 'heavy' }))).toBe(0);
  });

  it('keeps existing clear and wind day behavior visible at full strength', () => {
    expect(getCelestialOpacity(resolveConfig({ condition: 'clear', time: 'day' }))).toBe(1);
    expect(getCelestialOpacity(resolveConfig({ condition: 'clear', time: 'night' }))).toBe(1);
    expect(getCelestialOpacity(resolveConfig({ condition: 'wind', time: 'day' }))).toBe(1);
  });

  it('does not add celestial bodies to rainy or windy nights', () => {
    expect(getCelestialOpacity(resolveConfig({ condition: 'rain', time: 'day' }))).toBe(0);
    expect(getCelestialOpacity(resolveConfig({ condition: 'wind', time: 'night' }))).toBe(0);
  });
});
