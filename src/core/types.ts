export type Condition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'wind' | 'hail';
export type Intensity = 'light' | 'medium' | 'heavy';
export type TimeOfDay = 'day' | 'night';
export type Fidelity = 'subtle' | 'rich';
export type CelestialEvent = 'none' | 'sunrise' | 'sunset' | 'moonrise' | 'moonset';
export type MoonPhase =
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export interface WeatherConfig {
  condition: Condition;
  intensity?: Intensity;
  time?: TimeOfDay;
  transitionMs?: number;
  fidelity?: Fidelity;
  moonPhase?: MoonPhase;
  celestialEvent?: CelestialEvent;
  celestialProgress?: number;
}

export interface ResolvedConfig {
  condition: Condition;
  intensity: Intensity;
  time: TimeOfDay;
  transitionMs: number;
  fidelity: Fidelity;
  moonPhase: MoonPhase;
  celestialEvent: CelestialEvent;
  celestialProgress: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export type ParticleKind = 'primary' | 'splash' | 'leaf' | 'droplet';

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
  alpha?: number;  // undefined = 1.0; back-lobes set ~0.45
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
  spriteKey?: string;
}

export const VALID_CONDITIONS: Condition[] = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind', 'hail'];
export const VALID_CELESTIAL_EVENTS: CelestialEvent[] = ['none', 'sunrise', 'sunset', 'moonrise', 'moonset'];
export const VALID_MOON_PHASES: MoonPhase[] = [
  'new',
  'waxing-crescent',
  'first-quarter',
  'waxing-gibbous',
  'full',
  'waning-gibbous',
  'last-quarter',
  'waning-crescent',
];

export function isCelestialEventVisible(
  event: CelestialEvent,
  config: Pick<ResolvedConfig, 'condition' | 'intensity' | 'time'>,
): boolean {
  if (event === 'none') return true;
  const skyAllowsCelestialEvent = config.condition === 'clear'
    || config.condition === 'wind'
    || (config.condition === 'cloudy' && config.intensity !== 'heavy');
  if (!skyAllowsCelestialEvent) return false;

  if (event === 'sunrise' || event === 'sunset') {
    return config.time === 'day';
  }
  return config.time === 'night';
}

export function resolveConfig(config: WeatherConfig): ResolvedConfig {
  const condition: Condition = VALID_CONDITIONS.includes(config.condition as Condition)
    ? config.condition
    : 'clear';
  const moonPhase: MoonPhase = VALID_MOON_PHASES.includes(config.moonPhase as MoonPhase)
    ? config.moonPhase as MoonPhase
    : 'full';
  const intensity = config.intensity ?? 'medium';
  const time = config.time ?? 'day';
  const requestedCelestialEvent: CelestialEvent = VALID_CELESTIAL_EVENTS.includes(config.celestialEvent as CelestialEvent)
    ? config.celestialEvent as CelestialEvent
    : 'none';
  const celestialEvent = isCelestialEventVisible(requestedCelestialEvent, { condition, intensity, time })
    ? requestedCelestialEvent
    : 'none';
  const rawCelestialProgress = config.celestialProgress ?? 0.5;
  const celestialProgress = Math.min(1, Math.max(0, Number.isFinite(rawCelestialProgress) ? rawCelestialProgress : 0.5));
  return {
    condition,
    intensity,
    time,
    transitionMs: config.transitionMs ?? 1200,
    fidelity: config.fidelity ?? 'subtle',
    moonPhase,
    celestialEvent,
    celestialProgress,
  };
}
