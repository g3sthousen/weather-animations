import type { Condition, Intensity } from '../core/types';

export type IconCondition = Extract<Condition, 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'wind' | 'hail'>;

export function getIconName(condition: IconCondition, intensity: Intensity): string {
  return `${condition}-${intensity}`;
}
