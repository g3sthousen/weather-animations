export type Condition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'wind';
export type Intensity = 'light' | 'medium' | 'heavy';
export type TimeOfDay = 'day' | 'night';

export interface WeatherConfig {
  condition: Condition;
  intensity?: Intensity;
  time?: TimeOfDay;
  transitionMs?: number;
}

export interface ResolvedConfig {
  condition: Condition;
  intensity: Intensity;
  time: TimeOfDay;
  transitionMs: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  length: number;
  phase: number;
  active: boolean;
}

export interface CloudBlob {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
  speed: number;
  layer: 0 | 1 | 2;
}

export const VALID_CONDITIONS: Condition[] = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind'];

export function resolveConfig(config: WeatherConfig): ResolvedConfig {
  const condition: Condition = VALID_CONDITIONS.includes(config.condition as Condition)
    ? config.condition
    : 'clear';
  return {
    condition,
    intensity: config.intensity ?? 'medium',
    time: config.time ?? 'day',
    transitionMs: config.transitionMs ?? 1200,
  };
}
