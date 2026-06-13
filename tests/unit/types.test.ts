import { describe, it, expect } from 'vitest';
import { resolveConfig, VALID_CONDITIONS } from '../../src/core/types';

import { resolveConfig as resolve2 } from '../../src/core/types';

describe('hail condition', () => {
  it('is a valid condition', () => {
    expect(VALID_CONDITIONS).toContain('hail');
  });
  it('resolves hail unchanged', () => {
    expect(resolve2({ condition: 'hail' }).condition).toBe('hail');
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
