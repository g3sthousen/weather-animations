import * as React from 'react';

export type WeatherIconProps = React.SVGProps<SVGSVGElement>;
export type WeatherIconComponent = React.FC<WeatherIconProps>;
export type IconCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'wind' | 'hail';
export type IconIntensity = 'light' | 'medium' | 'heavy';

export const ClearLightIcon: WeatherIconComponent;
export const ClearMediumIcon: WeatherIconComponent;
export const ClearHeavyIcon: WeatherIconComponent;
export const CloudyLightIcon: WeatherIconComponent;
export const CloudyMediumIcon: WeatherIconComponent;
export const CloudyHeavyIcon: WeatherIconComponent;
export const RainLightIcon: WeatherIconComponent;
export const RainMediumIcon: WeatherIconComponent;
export const RainHeavyIcon: WeatherIconComponent;
export const SnowLightIcon: WeatherIconComponent;
export const SnowMediumIcon: WeatherIconComponent;
export const SnowHeavyIcon: WeatherIconComponent;
export const StormLightIcon: WeatherIconComponent;
export const StormMediumIcon: WeatherIconComponent;
export const StormHeavyIcon: WeatherIconComponent;
export const FogLightIcon: WeatherIconComponent;
export const FogMediumIcon: WeatherIconComponent;
export const FogHeavyIcon: WeatherIconComponent;
export const WindLightIcon: WeatherIconComponent;
export const WindMediumIcon: WeatherIconComponent;
export const WindHeavyIcon: WeatherIconComponent;
export const HailLightIcon: WeatherIconComponent;
export const HailMediumIcon: WeatherIconComponent;
export const HailHeavyIcon: WeatherIconComponent;

export function getIconName(condition: IconCondition, intensity: IconIntensity): string;
