import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getIconName } from '../../src/icons/helpers';
import type { Condition, Intensity } from '../../src/core/types';

describe('getIconName', () => {
  it('returns condition-intensity string', () => {
    expect(getIconName('rain', 'heavy')).toBe('rain-heavy');
    expect(getIconName('clear', 'light')).toBe('clear-light');
    expect(getIconName('storm', 'medium')).toBe('storm-medium');
  });

  it('covers all 24 combinations without error', () => {
    const conditions: Condition[] = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind', 'hail'];
    const intensities: Intensity[] = ['light', 'medium', 'heavy'];
    for (const c of conditions) {
      for (const i of intensities) {
        expect(getIconName(c, i)).toBe(`${c}-${i}`);
      }
    }
  });
});

const iconConditions: Condition[] = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind', 'hail'];
const iconIntensities: Intensity[] = ['light', 'medium', 'heavy'];
const iconsDir = join(process.cwd(), 'src/icons');

describe('icon source files', () => {
  it('contains exactly one SVG for every condition and intensity', () => {
    const expectedFiles = iconConditions.flatMap((condition) => (
      iconIntensities.map((intensity) => `${condition}-${intensity}.svg`)
    ));
    const actualFiles = readdirSync(iconsDir)
      .filter((file) => file.endsWith('.svg'))
      .sort();

    expect(actualFiles).toEqual(expectedFiles.sort());
  });

  it('uses the shared 48px viewBox and CSS color variables', () => {
    for (const condition of iconConditions) {
      for (const intensity of iconIntensities) {
        const file = join(iconsDir, `${condition}-${intensity}.svg`);
        expect(existsSync(file), file).toBe(true);

        const svg = readFileSync(file, 'utf8');
        expect(svg).toContain('viewBox="0 0 48 48"');
        expect(svg).toContain('--wi-primary');
        if (condition !== 'cloudy') {
          expect(svg).toContain('--wi-accent');
        }
      }
    }
  });
});
