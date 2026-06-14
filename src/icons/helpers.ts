import type { Condition, Intensity } from '../core/types';

export function getIconName(condition: Condition, intensity: Intensity): string {
  return `${condition}-${intensity}`;
}
