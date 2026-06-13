import type { CloudBlob, CloudLobe, Intensity, ResolvedConfig } from './types';
import { random } from './rng';

const LAYER_SPEEDS = [0.006, 0.022, 0.06] as const;
const LAYER_COUNTS: Record<0 | 1 | 2, number> = { 0: 4, 1: 5, 2: 6 };

// Intensity drives cloud coverage (how many) and density (how opaque), so
// light/medium/heavy read differently even when there are no particles.
const INTENSITY_COUNT: Record<Intensity, number> = { light: 0.55, medium: 1, heavy: 1.5 };
const INTENSITY_ALPHA: Record<Intensity, number> = { light: 0.75, medium: 1, heavy: 1.2 };

function cloudColor(config: ResolvedConfig, alpha: number): string {
  if (config.condition === 'storm') {
    return config.time === 'night' ? `rgba(26,26,42,${alpha})` : `rgba(42,42,58,${alpha})`;
  }
  if (config.condition === 'hail') {
    return config.time === 'night' ? `rgba(40,52,50,${alpha})` : `rgba(70,86,82,${alpha})`;
  }
  if (config.condition === 'rain') {
    return config.time === 'night' ? `rgba(58,74,90,${alpha})` : `rgba(106,122,138,${alpha})`;
  }
  if (config.time === 'night') return `rgba(58,74,106,${alpha})`;
  return `rgba(208,216,224,${alpha})`;
}

function cloudAlpha(config: ResolvedConfig, layer: 0 | 1 | 2): number {
  const base = config.condition === 'storm' ? 0.9
    : config.condition === 'hail' ? 0.85
    : config.condition === 'rain' ? 0.75
    : config.condition === 'wind' ? 0.55
    : config.condition === 'cloudy' ? 0.7
    : 0.5;
  return Math.min(0.95, base * (1 - layer * 0.12) * INTENSITY_ALPHA[config.intensity]);
}

function shouldShowClouds(condition: string): boolean {
  return condition !== 'clear' && condition !== 'fog';
}

// A cumulus cloud is a row of overlapping round lobes with a flat-ish bottom and
// a billowy top. Aligning each lobe's bottom near the cloud base (dy = 1 - r)
// makes the larger, central lobes rise higher — the classic puffy silhouette.
function generateLobes(width: number, height: number, flat: boolean): CloudLobe[] {
  const rx = width / 2;
  const ry = height / 2;
  const aspect = rx / ry;
  const count = Math.max(4, Math.min(9, Math.round(2 + aspect * 1.8)));
  const lobes: CloudLobe[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const dx = (t - 0.5) * (flat ? 2.4 : 1.8);
    const centerBias = 1 - Math.abs(t - 0.5) * 2;
    const rise = flat ? 0.18 : 0.42;
    const r = Math.min(1.05, 0.62 + centerBias * rise + (random() * 0.16 - 0.08));
    const dy = (1 - r) + random() * 0.08;
    lobes.push({ dx, dy, r });
  }
  return lobes;
}

export function initClouds(config: ResolvedConfig, width: number, height: number): CloudBlob[] {
  if (!shouldShowClouds(config.condition)) return [];
  const blobs: CloudBlob[] = [];
  const layers: (0 | 1 | 2)[] = config.condition === 'wind' ? [2] : [0, 1, 2];
  const countMul = INTENSITY_COUNT[config.intensity];
  for (const layer of layers) {
    const baseCount = config.condition === 'wind' ? 8 : LAYER_COUNTS[layer];
    const count = Math.max(2, Math.round(baseCount * countMul));
    for (let i = 0; i < count; i++) {
      const isWind = config.condition === 'wind';
      const layerScale = 1 + layer * 0.35;
      const w = isWind
        ? width * (0.15 + random() * 0.12)
        : width * (0.22 + random() * 0.18) * layerScale;
      const h = isWind ? height * 0.04 : height * (0.12 + random() * 0.08) * layerScale;
      blobs.push({
        x: (i / count) * width * 1.4 - width * 0.2,
        y: height * (0.04 + layer * 0.18 + random() * 0.08),
        width: w,
        height: h,
        alpha: cloudAlpha(config, layer),
        speed: LAYER_SPEEDS[layer] * (isWind ? 3 : 1) * width,
        layer,
        lobes: isWind ? [] : generateLobes(w, h, random() < 0.35),
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

// Cloud shapes never change, only their position — so render each one to a sprite
// once and just blit it every frame. The lobes are drawn opaque to form a clean
// silhouette (overlaps merge instead of darkening); the cloud's own translucency
// is applied at composite time via globalAlpha.
function buildSprite(b: CloudBlob, config: ResolvedConfig): OffscreenCanvas {
  const rx = b.width / 2;
  const ry = b.height / 2;
  const blurRadius = Math.max(2, ry * 0.12);
  const pad = blurRadius * 3 + ry;
  const offW = Math.ceil(b.width + pad * 2);
  const offH = Math.ceil(b.height + pad * 2);
  const off = new OffscreenCanvas(offW, offH);
  const c = off.getContext('2d')!;
  const lx = offW / 2;
  const ly = offH / 2;
  b.spriteCx = lx;
  b.spriteCy = ly;

  if (b.lobes.length === 0) {
    // Thin wind streak: a soft, wispy horizontal ellipse (scaled circular gradient).
    c.filter = `blur(${blurRadius}px)`;
    c.translate(lx, ly);
    c.scale(rx / ry, 1);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, ry);
    g.addColorStop(0, cloudColor(config, 1));
    g.addColorStop(0.4, cloudColor(config, 0.6));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, ry, 0, Math.PI * 2);
    c.fill();
    return off;
  }

  c.filter = `blur(${blurRadius}px)`;
  c.fillStyle = cloudColor(config, 1);
  for (const lobe of b.lobes) {
    const cx = lx + lobe.dx * rx;
    const cy = ly + lobe.dy * ry;
    c.beginPath();
    c.arc(cx, cy, lobe.r * ry, 0, Math.PI * 2);
    c.fill();
  }
  c.filter = 'none';

  // Vertical form shading, clipped to the cloud body: lit top, shaded base.
  c.globalCompositeOperation = 'source-atop';
  const day = config.time === 'day';
  const darkBase = config.condition === 'rain' || config.condition === 'storm' || config.condition === 'hail';
  const topLight = day ? 'rgba(255,244,214,0.22)' : 'rgba(190,205,235,0.10)';
  const baseShade = darkBase ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.16)';
  const shade = c.createLinearGradient(0, ly - ry * 1.1, 0, ly + ry * 1.1);
  shade.addColorStop(0, topLight);
  shade.addColorStop(0.5, 'rgba(255,255,255,0)');
  shade.addColorStop(1, baseShade);
  c.fillStyle = shade;
  c.fillRect(0, 0, offW, offH);
  c.globalCompositeOperation = 'source-over';

  return off;
}

export function drawClouds(
  ctx: CanvasRenderingContext2D,
  blobs: CloudBlob[],
  config: ResolvedConfig,
  alpha: number,
): void {
  if (blobs.length === 0) return;
  ctx.save();
  for (const b of blobs) {
    if (!b.sprite) b.sprite = buildSprite(b, config);
    ctx.globalAlpha = alpha * b.alpha;
    ctx.drawImage(b.sprite, b.x - (b.spriteCx ?? 0), b.y - (b.spriteCy ?? 0));
  }
  ctx.restore();
}
