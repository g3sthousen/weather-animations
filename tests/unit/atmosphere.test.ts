// tests/unit/atmosphere.test.ts
import { describe, it, expect } from 'vitest';
import { celestialPosition, createAtmosphereState, drawAtmosphere, fogBob, getCelestialOpacity } from '../../src/core/atmosphere';
import { resolveConfig, type ResolvedConfig } from '../../src/core/types';

function createRecordingContext(): CanvasRenderingContext2D & { fillRects: Array<[number, number, number, number]> } {
  const gradient = { addColorStop: () => undefined };
  const ctx = {
    fillRects: [] as Array<[number, number, number, number]>,
    save: () => undefined,
    restore: () => undefined,
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    fillRect(x: number, y: number, width: number, height: number) {
      this.fillRects.push([x, y, width, height]);
    },
    set globalAlpha(_: number) {},
    set fillStyle(_: unknown) {},
  };
  return ctx as unknown as CanvasRenderingContext2D & { fillRects: Array<[number, number, number, number]> };
}

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

  it('does not force invalid active celestial events to full opacity', () => {
    const invalidSunrise: ResolvedConfig = {
      ...resolveConfig({ condition: 'rain', time: 'day' }),
      celestialEvent: 'sunrise',
    };
    const wrongTimeMoonrise: ResolvedConfig = {
      ...resolveConfig({ condition: 'clear', time: 'day' }),
      celestialEvent: 'moonrise',
    };

    expect(getCelestialOpacity(invalidSunrise)).toBe(0);
    expect(getCelestialOpacity(wrongTimeMoonrise)).toBe(0);
  });
});

describe('celestialPosition', () => {
  it('keeps none events at the normal sky position', () => {
    expect(celestialPosition('none', 0)).toEqual({ x: 0.75, y: 0.18 });
    expect(celestialPosition('none', 1)).toEqual({ x: 0.75, y: 0.18 });
  });

  it('moves sunrise and moonrise from the left horizon to the top of the arc', () => {
    const sunriseStart = celestialPosition('sunrise', 0);
    const sunriseMid = celestialPosition('sunrise', 0.5);
    const sunriseEnd = celestialPosition('sunrise', 1);
    const moonriseStart = celestialPosition('moonrise', 0);
    const moonriseMid = celestialPosition('moonrise', 0.5);
    const moonriseEnd = celestialPosition('moonrise', 1);

    expect(sunriseStart.y).toBeGreaterThan(sunriseEnd.y);
    expect(moonriseStart.y).toBeGreaterThan(moonriseEnd.y);
    expect(sunriseStart.x).toBeLessThan(sunriseMid.x);
    expect(sunriseMid.x).toBeLessThan(sunriseEnd.x);
    expect(moonriseStart.x).toBeLessThan(moonriseMid.x);
    expect(moonriseMid.x).toBeLessThan(moonriseEnd.x);
    expect(sunriseStart).toEqual({ x: 0.18, y: 0.68 });
    expect(sunriseEnd).toEqual({ x: 0.5, y: 0.18 });
    expect(moonriseStart).toEqual(sunriseStart);
    expect(moonriseEnd).toEqual(sunriseEnd);
  });

  it('moves sunset and moonset from the top of the arc to the right horizon', () => {
    const sunsetStart = celestialPosition('sunset', 0);
    const sunsetMid = celestialPosition('sunset', 0.5);
    const sunsetEnd = celestialPosition('sunset', 1);
    const moonsetStart = celestialPosition('moonset', 0);
    const moonsetMid = celestialPosition('moonset', 0.5);
    const moonsetEnd = celestialPosition('moonset', 1);

    expect(sunsetStart.y).toBeLessThan(sunsetEnd.y);
    expect(moonsetStart.y).toBeLessThan(moonsetEnd.y);
    expect(sunsetStart.x).toBeLessThan(sunsetMid.x);
    expect(sunsetMid.x).toBeLessThan(sunsetEnd.x);
    expect(moonsetStart.x).toBeLessThan(moonsetMid.x);
    expect(moonsetMid.x).toBeLessThan(moonsetEnd.x);
    expect(sunsetStart).toEqual({ x: 0.5, y: 0.18 });
    expect(sunsetEnd).toEqual({ x: 0.82, y: 0.68 });
    expect(moonsetStart).toEqual(sunsetStart);
    expect(moonsetEnd).toEqual(sunsetEnd);
  });
});

describe('drawAtmosphere', () => {
  it('does not clip the moon horizon glow at the middle of the viewport', () => {
    const ctx = createRecordingContext();

    drawAtmosphere(
      ctx,
      resolveConfig({ condition: 'clear', time: 'night', celestialEvent: 'moonrise' }),
      createAtmosphereState(),
      1,
      800,
      600,
    );

    expect(ctx.fillRects).not.toContainEqual([0, 300, 800, 300]);
  });
});
