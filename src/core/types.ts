export type Condition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'wind' | 'hail';
export type Intensity = 'light' | 'medium' | 'heavy';
export type TimeOfDay = 'day' | 'night';
export type Fidelity = 'subtle' | 'rich';

export interface WeatherConfig {
  condition: Condition;
  intensity?: Intensity;
  time?: TimeOfDay;
  transitionMs?: number;
  fidelity?: Fidelity;
}

export interface ResolvedConfig {
  condition: Condition;
  intensity: Intensity;
  time: TimeOfDay;
  transitionMs: number;
  fidelity: Fidelity;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export type ParticleKind = 'primary' | 'splash' | 'leaf';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  length: number;
  phase: number;
  depth: number;     // 0 = far (small/slow/faint), 1 = near (large/fast/strong)
  bounces: number;   // hail bounce count; ignored by other kinds
  kind: ParticleKind;
  active: boolean;
}

export interface CloudLobe {
  dx: number;
  dy: number;
  r: number;
}

export interface CloudBlob {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
  speed: number;
  layer: 0 | 1 | 2;
  lobes: CloudLobe[];
  sprite?: OffscreenCanvas;
  spriteCx?: number;
  spriteCy?: number;
}

export const VALID_CONDITIONS: Condition[] = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind', 'hail'];

export function resolveConfig(config: WeatherConfig): ResolvedConfig {
  const condition: Condition = VALID_CONDITIONS.includes(config.condition as Condition)
    ? config.condition
    : 'clear';
  return {
    condition,
    intensity: config.intensity ?? 'medium',
    time: config.time ?? 'day',
    transitionMs: config.transitionMs ?? 1200,
    fidelity: config.fidelity ?? 'subtle',
  };
}
