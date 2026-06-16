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

describe('icon accent spacing', () => {
  it('keeps sleet cloud unchanged while separating the non-cloud elements', () => {
    const svg = readFileSync(join(iconsDir, 'sleet.svg'), 'utf8');

    expect(svg).toContain('<circle cx="17" cy="17" r="5" fill="var(--wi-primary,#78909C)"/>');
    expect(svg).toContain('<circle cx="24" cy="13" r="7" fill="var(--wi-primary,#78909C)"/>');
    expect(svg).toContain('<circle cx="31" cy="17" r="5" fill="var(--wi-primary,#78909C)"/>');
    expect(svg).toContain('<rect x="12" y="17" width="24" height="5" rx="2.5" fill="var(--wi-primary,#78909C)"/>');

    expect(svg).toContain('<line x1="15.5" y1="28" x2="12.5" y2="36" stroke="var(--wi-accent,#4FC3F7)" stroke-width="2.5" stroke-linecap="round"/>');
    expect(svg).toContain('<line x1="32.5" y1="28" x2="35.5" y2="36" stroke="var(--wi-accent,#4FC3F7)" stroke-width="2.5" stroke-linecap="round"/>');
    expect(svg).toContain('<line x1="24" y1="29.5" x2="24" y2="36.5"/>');
    expect(svg).toContain('<line x1="21" y1="31.25" x2="27" y2="34.75"/>');
    expect(svg).toContain('<line x1="21" y1="34.75" x2="27" y2="31.25"/>');
  });

  it('keeps blizzard cloud unchanged while separating the non-cloud elements', () => {
    const svg = readFileSync(join(iconsDir, 'blizzard.svg'), 'utf8');

    expect(svg).toContain('<circle cx="17" cy="17" r="5" fill="var(--wi-primary,#90A4AE)"/>');
    expect(svg).toContain('<circle cx="24" cy="13" r="7" fill="var(--wi-primary,#90A4AE)"/>');
    expect(svg).toContain('<circle cx="31" cy="17" r="5" fill="var(--wi-primary,#90A4AE)"/>');
    expect(svg).toContain('<rect x="12" y="17" width="24" height="5" rx="2.5" fill="var(--wi-primary,#90A4AE)"/>');

    expect(svg).toContain('<line x1="17.5" y1="27" x2="12" y2="30.5"/>');
    expect(svg).toContain('<line x1="29" y1="27" x2="24" y2="30.5"/>');
    expect(svg).toContain('<line x1="38" y1="28" x2="34" y2="31"/>');
    expect(svg).toContain('<line x1="20" y1="34" x2="14" y2="38"/>');
    expect(svg).toContain('<line x1="35" y1="35" x2="29" y2="39"/>');
  });
});
