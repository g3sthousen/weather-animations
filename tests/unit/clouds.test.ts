import { describe, it, expect } from 'vitest';
import { cloudSpriteMetrics, cloudVisualBounds, updateClouds } from '../../src/core/clouds';
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
});
