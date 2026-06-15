import type { Condition } from '../core/types';

export type IconCondition = Condition;

export function getIconName(condition: IconCondition): string {
  return condition;
}
