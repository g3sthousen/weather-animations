import * as React from 'react';

export type WeatherIconProps = React.SVGProps<SVGSVGElement>;
export type WeatherIconComponent = React.FC<WeatherIconProps>;
export type IconCondition =
  | 'clear'
  | 'cloudy'
  | 'overcast'
  | 'rain'
  | 'drizzle'
  | 'showers'
  | 'freezing-rain'
  | 'sleet'
  | 'snow'
  | 'flurries'
  | 'blizzard'
  | 'storm'
  | 'hail'
  | 'fog'
  | 'mist'
  | 'haze'
  | 'smoke'
  | 'dust'
  | 'wind';

export const ClearIcon: WeatherIconComponent;
export const CloudyIcon: WeatherIconComponent;
export const OvercastIcon: WeatherIconComponent;
export const RainIcon: WeatherIconComponent;
export const DrizzleIcon: WeatherIconComponent;
export const ShowersIcon: WeatherIconComponent;
export const FreezingRainIcon: WeatherIconComponent;
export const SleetIcon: WeatherIconComponent;
export const SnowIcon: WeatherIconComponent;
export const FlurriesIcon: WeatherIconComponent;
export const BlizzardIcon: WeatherIconComponent;
export const StormIcon: WeatherIconComponent;
export const HailIcon: WeatherIconComponent;
export const FogIcon: WeatherIconComponent;
export const MistIcon: WeatherIconComponent;
export const HazeIcon: WeatherIconComponent;
export const SmokeIcon: WeatherIconComponent;
export const DustIcon: WeatherIconComponent;
export const WindIcon: WeatherIconComponent;

export function getIconName(condition: IconCondition): string;
