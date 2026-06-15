import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getIconName } from '../../src/icons/helpers';
import { VALID_CONDITIONS } from '../../src/core/types';
import type { IconCondition } from '../../src/icons/helpers';

describe('getIconName', () => {
  it('returns the condition string', () => {
    expect(getIconName('rain')).toBe('rain');
    expect(getIconName('clear')).toBe('clear');
    expect(getIconName('freezing-rain')).toBe('freezing-rain');
  });

  it('covers all conditions without error', () => {
    for (const c of VALID_CONDITIONS as IconCondition[]) {
      expect(getIconName(c)).toBe(c);
    }
  });
});

const iconConditions: IconCondition[] = VALID_CONDITIONS;
const iconsDir = join(process.cwd(), 'src/icons');

describe('icon source files', () => {
  it('contains exactly one SVG for every condition', () => {
    const expectedFiles = iconConditions.map((condition) => `${condition}.svg`);
    const actualFiles = readdirSync(iconsDir)
      .filter((file) => file.endsWith('.svg'))
      .sort();

    expect(actualFiles).toEqual(expectedFiles.sort());
  });

  it('uses the shared 48px viewBox and CSS color variables', () => {
    for (const condition of iconConditions) {
      const file = join(iconsDir, `${condition}.svg`);
      expect(existsSync(file), file).toBe(true);

      const svg = readFileSync(file, 'utf8');
      expect(svg).toContain('viewBox="0 0 48 48"');
      expect(svg).toContain('--wi-primary');
      expect(svg).toContain('--wi-accent');
    }
  });
});
