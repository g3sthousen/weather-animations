import type { RGBColor, ResolvedConfig, Condition, TimeOfDay } from './types';
import { hexToRgb, lerpColor, rgbToString } from './math';

interface SkyPalette {
  top: RGBColor;
  bottom: RGBColor;
}

type PaletteKey = `${Condition}:${TimeOfDay}`;

const SKY_PALETTES: Record<PaletteKey, SkyPalette> = {
  'clear:day':    { top: hexToRgb('#1a6b9e'), bottom: hexToRgb('#87ceeb') },
  'clear:night':  { top: hexToRgb('#0a0a2e'), bottom: hexToRgb('#1a1a4e') },
  'cloudy:day':   { top: hexToRgb('#6b7a8d'), bottom: hexToRgb('#b0bec5') },
  'cloudy:night': { top: hexToRgb('#1c2331'), bottom: hexToRgb('#2d3a4a') },
  'rain:day':     { top: hexToRgb('#3d5166'), bottom: hexToRgb('#607d8b') },
  'rain:night':   { top: hexToRgb('#1a202c'), bottom: hexToRgb('#2d3748') },
  'snow:day':     { top: hexToRgb('#b0bec5'), bottom: hexToRgb('#e8eef4') },
  'snow:night':   { top: hexToRgb('#1a1a3a'), bottom: hexToRgb('#2d2d50') },
  'storm:day':    { top: hexToRgb('#1a1a2e'), bottom: hexToRgb('#16213e') },
  'storm:night':  { top: hexToRgb('#0a0a0f'), bottom: hexToRgb('#11111b') },
  'fog:day':      { top: hexToRgb('#c8cdd2'), bottom: hexToRgb('#e8eaed') },
  'fog:night':    { top: hexToRgb('#374151'), bottom: hexToRgb('#4b5563') },
  'wind:day':     { top: hexToRgb('#2563a8'), bottom: hexToRgb('#93c5fd') },
  'wind:night':   { top: hexToRgb('#1e3a5f'), bottom: hexToRgb('#1e3a8a') },
  'hail:day':     { top: hexToRgb('#2f3b3a'), bottom: hexToRgb('#4a5a55') },
  'hail:night':   { top: hexToRgb('#141c1b'), bottom: hexToRgb('#212e2b') },
};

function getPalette(config: ResolvedConfig): SkyPalette {
  return SKY_PALETTES[`${config.condition}:${config.time}`];
}

export function applySky(el: HTMLElement, config: ResolvedConfig): void {
  const p = getPalette(config);
  el.style.background = `linear-gradient(to bottom, ${rgbToString(p.top)}, ${rgbToString(p.bottom)})`;
}

export function lerpSky(
  el: HTMLElement,
  from: ResolvedConfig,
  to: ResolvedConfig,
  progress: number,
): void {
  const fp = getPalette(from);
  const tp = getPalette(to);
  const top = rgbToString(lerpColor(fp.top, tp.top, progress));
  const bottom = rgbToString(lerpColor(fp.bottom, tp.bottom, progress));
  el.style.background = `linear-gradient(to bottom, ${top}, ${bottom})`;
}
