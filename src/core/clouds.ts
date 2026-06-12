import type { CloudBlob, ResolvedConfig } from './types';

const LAYER_SPEEDS = [0.008, 0.025, 0.055] as const;
const LAYER_COUNTS: Record<0 | 1 | 2, number> = { 0: 4, 1: 5, 2: 6 };

function cloudColor(config: ResolvedConfig, alpha: number): string {
  if (config.condition === 'storm') {
    return config.time === 'night' ? `rgba(26,26,42,${alpha})` : `rgba(42,42,58,${alpha})`;
  }
  if (config.condition === 'rain') {
    return config.time === 'night' ? `rgba(58,74,90,${alpha})` : `rgba(106,122,138,${alpha})`;
  }
  if (config.time === 'night') return `rgba(58,74,106,${alpha})`;
  return `rgba(208,216,224,${alpha})`;
}

function cloudAlpha(config: ResolvedConfig, layer: 0 | 1 | 2): number {
  const base = config.condition === 'storm' ? 0.9
    : config.condition === 'rain' ? 0.75
    : config.condition === 'wind' ? 0.55
    : config.condition === 'cloudy' ? 0.7
    : 0.5;
  return base * (1 - layer * 0.12);
}

function shouldShowClouds(condition: string): boolean {
  return condition !== 'clear' && condition !== 'fog';
}

export function initClouds(config: ResolvedConfig, width: number, height: number): CloudBlob[] {
  if (!shouldShowClouds(config.condition)) return [];
  const blobs: CloudBlob[] = [];
  const layers: (0 | 1 | 2)[] = config.condition === 'wind' ? [2] : [0, 1, 2];
  for (const layer of layers) {
    const count = config.condition === 'wind' ? 8 : LAYER_COUNTS[layer];
    for (let i = 0; i < count; i++) {
      const isWind = config.condition === 'wind';
      blobs.push({
        x: (i / count) * width * 1.4 - width * 0.2,
        y: height * (0.05 + layer * 0.12 + Math.random() * 0.08),
        width: isWind ? width * (0.15 + Math.random() * 0.12) : width * (0.22 + Math.random() * 0.18),
        height: isWind ? height * 0.04 : height * (0.12 + Math.random() * 0.08),
        alpha: cloudAlpha(config, layer),
        speed: LAYER_SPEEDS[layer] * (isWind ? 3 : 1) * width,
        layer,
      });
    }
  }
  return blobs;
}

export function updateClouds(blobs: CloudBlob[], delta: number, width: number): void {
  for (const b of blobs) {
    b.x += b.speed * delta;
    if (b.x > width + b.width / 2) b.x = -b.width / 2;
  }
}

export function drawClouds(
  ctx: CanvasRenderingContext2D,
  blobs: CloudBlob[],
  config: ResolvedConfig,
  alpha: number,
): void {
  if (blobs.length === 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  for (const b of blobs) {
    ctx.save();
    ctx.filter = `blur(${b.height * 0.4}px)`;
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, Math.max(b.width, b.height) * 0.6);
    grad.addColorStop(0, cloudColor(config, b.alpha));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.width / 2, b.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = 'none';
    ctx.restore();
  }
  ctx.restore();
}
