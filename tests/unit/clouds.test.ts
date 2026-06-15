import { describe, it, expect } from 'vitest';
import { cloudSpriteMetrics, cloudVisualBounds, initClouds, updateClouds } from '../../src/core/clouds';
import { seedRng } from '../../src/core/rng';
import { resolveConfig } from '../../src/core/types';
import type { CloudBlob } from '../../src/core/types';

function makeWideCloud(): CloudBlob {
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 80,
    alpha: 1,
    speed: 0,
    layer: 1,
    lobes: [
      { dx: -1.2, dy: 0, r: 1.1 },
      { dx: 1.2, dy: 0, r: 1.1 },
    ],
  };
}

describe('cloud sprite geometry', () => {
  it('sizes sprites from visual lobe bounds instead of nominal blob size', () => {
    const cloud = makeWideCloud();
    const bounds = cloudVisualBounds(cloud);
    const metrics = cloudSpriteMetrics(cloud);

    expect(bounds.minX).toBeLessThan(-cloud.width / 2);
    expect(bounds.maxX).toBeGreaterThan(cloud.width / 2);
    expect(metrics.centerX + bounds.minX).toBeGreaterThanOrEqual(0);
    expect(metrics.centerX + bounds.maxX).toBeLessThanOrEqual(metrics.width);
    expect(metrics.centerY + bounds.minY).toBeGreaterThanOrEqual(0);
    expect(metrics.centerY + bounds.maxY).toBeLessThanOrEqual(metrics.height);
  });

  it('waits to wrap clouds until their full visual bounds leave the viewport', () => {
    const cloud = makeWideCloud();
    const bounds = cloudVisualBounds(cloud);
    cloud.x = 100 - bounds.minX - 1;

    updateClouds([cloud], 1, 100);

    expect(cloud.x).toBe(100 - bounds.minX - 1);
  });

  it('uses fewer cloudy-like clouds for wind instead of narrow wisps', () => {
    seedRng(12345);
    const windy = initClouds(resolveConfig({ condition: 'wind', intensity: 'medium' }), 1000, 500);
    seedRng(12345);
    const cloudyLight = initClouds(resolveConfig({ condition: 'cloudy', intensity: 'light' }), 1000, 500);

    expect(windy.length).toBeLessThan(cloudyLight.length);
    expect(windy.length).toBeGreaterThanOrEqual(3);
    expect(windy.every((cloud) => cloud.lobes.length >= 4)).toBe(true);
    expect(Math.min(...windy.map((cloud) => cloud.height / 500))).toBeGreaterThan(0.08);
    expect(Math.max(...windy.map((cloud) => cloud.alpha))).toBeLessThanOrEqual(
      Math.max(...cloudyLight.map((cloud) => cloud.alpha)) * 1.15,
    );
  });

  it('increases wind cloud drift speed by intensity', () => {
    const averageSpeed = (intensity: 'light' | 'medium' | 'heavy') => {
      seedRng(12345);
      const clouds = initClouds(resolveConfig({ condition: 'wind', intensity }), 1000, 500);
      return clouds.reduce((sum, cloud) => sum + cloud.speed, 0) / clouds.length;
    };

    const light = averageSpeed('light');
    const medium = averageSpeed('medium');
    const heavy = averageSpeed('heavy');

    expect(medium).toBeGreaterThan(light * 1.2);
    expect(heavy).toBeGreaterThan(medium * 1.15);
  });

  it('renders overcast as denser cloud cover than heavy cloudy', () => {
    seedRng(12345);
    const overcast = initClouds(resolveConfig({ condition: 'overcast', intensity: 'medium' }), 1000, 500);
    seedRng(12345);
    const cloudyHeavy = initClouds(resolveConfig({ condition: 'cloudy', intensity: 'heavy' }), 1000, 500);

    expect(overcast.length).toBeGreaterThanOrEqual(cloudyHeavy.length);
    expect(Math.min(...overcast.map((cloud) => cloud.width / 1000))).toBeGreaterThan(0.28);
    expect(Math.min(...overcast.map((cloud) => cloud.alpha))).toBeGreaterThan(0.68);
  });

  it('uses rain-like cloud cover for drizzle and sleet', () => {
    seedRng(12345);
    const drizzle = initClouds(resolveConfig({ condition: 'drizzle', intensity: 'light' }), 1000, 500);
    seedRng(12345);
    const sleet = initClouds(resolveConfig({ condition: 'sleet', intensity: 'medium' }), 1000, 500);

    expect(drizzle.length).toBeGreaterThan(0);
    expect(sleet.length).toBeGreaterThan(drizzle.length);
    expect(Math.max(...drizzle.map((cloud) => cloud.alpha))).toBeLessThan(0.8);
  });
});
