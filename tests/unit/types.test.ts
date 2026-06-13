import { describe, it, expect } from 'vitest';
import { resolveConfig, VALID_CONDITIONS, VALID_MOON_PHASES } from '../../src/core/types';

describe('hail condition', () => {
  it('is a valid condition', () => {
    expect(VALID_CONDITIONS).toContain('hail');
  });
  it('resolves hail unchanged', () => {
    expect(resolveConfig({ condition: 'hail' }).condition).toBe('hail');
  });
});

describe('resolveConfig fidelity', () => {
  it('defaults fidelity to subtle', () => {
    expect(resolveConfig({ condition: 'rain' }).fidelity).toBe('subtle');
  });
  it('passes through rich', () => {
    expect(resolveConfig({ condition: 'rain', fidelity: 'rich' }).fidelity).toBe('rich');
  });
});

describe('resolveConfig moonPhase', () => {
  it('defaults moonPhase to full', () => {
    expect(resolveConfig({ condition: 'clear', time: 'night' }).moonPhase).toBe('full');
  });

  it('passes through a valid moonPhase', () => {
    expect(resolveConfig({ condition: 'clear', time: 'night', moonPhase: 'waning-gibbous' }).moonPhase).toBe('waning-gibbous');
  });

  it('falls back to full for invalid moonPhase values', () => {
    expect(resolveConfig({ condition: 'clear', time: 'night', moonPhase: 'blue-moon' as never }).moonPhase).toBe('full');
  });

  it('exports the canonical eight moon phases', () => {
    expect(VALID_MOON_PHASES).toEqual([
      'new',
      'waxing-crescent',
      'first-quarter',
      'waxing-gibbous',
      'full',
      'waning-gibbous',
      'last-quarter',
      'waning-crescent',
    ]);
  });
});
