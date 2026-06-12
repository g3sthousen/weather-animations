import { describe, it, expect } from 'vitest';
import { lerp, clamp, easeInOutCubic, lerpColor, hexToRgb, rgbToString } from '../../src/core/math';

describe('lerp', () => {
  it('returns a at t=0', () => expect(lerp(0, 100, 0)).toBe(0));
  it('returns b at t=1', () => expect(lerp(0, 100, 1)).toBe(100));
  it('returns midpoint at t=0.5', () => expect(lerp(0, 100, 0.5)).toBe(50));
  it('clamps t below 0', () => expect(lerp(0, 100, -1)).toBe(0));
  it('clamps t above 1', () => expect(lerp(0, 100, 2)).toBe(100));
});

describe('clamp', () => {
  it('returns value when in range', () => expect(clamp(5, 0, 10)).toBe(5));
  it('clamps to min', () => expect(clamp(-5, 0, 10)).toBe(0));
  it('clamps to max', () => expect(clamp(15, 0, 10)).toBe(10));
});

describe('easeInOutCubic', () => {
  it('returns 0 at t=0', () => expect(easeInOutCubic(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutCubic(1)).toBe(1));
  it('returns 0.5 at t=0.5', () => expect(easeInOutCubic(0.5)).toBe(0.5));
  it('is slower at edges (value < t for t < 0.5)', () => {
    expect(easeInOutCubic(0.25)).toBeLessThan(0.25);
  });
  it('is faster in middle (value > t for t slightly above 0.5)', () => {
    expect(easeInOutCubic(0.6)).toBeGreaterThan(0.6);
  });
});

describe('hexToRgb', () => {
  it('converts 6-digit hex to RGB', () => {
    expect(hexToRgb('#ff8800')).toEqual({ r: 255, g: 136, b: 0 });
  });
  it('is case insensitive', () => {
    expect(hexToRgb('#FF8800')).toEqual({ r: 255, g: 136, b: 0 });
  });
});

describe('lerpColor', () => {
  it('returns from at t=0', () => {
    const a = { r: 0, g: 0, b: 0 };
    const b = { r: 100, g: 200, b: 50 };
    expect(lerpColor(a, b, 0)).toEqual({ r: 0, g: 0, b: 0 });
  });
  it('returns to at t=1', () => {
    const a = { r: 0, g: 0, b: 0 };
    const b = { r: 100, g: 200, b: 50 };
    expect(lerpColor(a, b, 1)).toEqual({ r: 100, g: 200, b: 50 });
  });
  it('returns midpoint at t=0.5', () => {
    const a = { r: 0, g: 0, b: 0 };
    const b = { r: 100, g: 200, b: 50 };
    expect(lerpColor(a, b, 0.5)).toEqual({ r: 50, g: 100, b: 25 });
  });
});

describe('rgbToString', () => {
  it('produces valid rgb() string', () => {
    expect(rgbToString({ r: 255, g: 128, b: 0 })).toBe('rgb(255,128,0)');
  });
});
