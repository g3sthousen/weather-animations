import { useEffect, useRef } from 'react';
import { WeatherScene } from '../core/index';
import type { WeatherConfig } from '../core/index';

export interface WeatherBackgroundProps extends WeatherConfig {
  className?: string;
  style?: React.CSSProperties;
}

export function WeatherBackground({
  condition,
  intensity,
  time,
  transitionMs,
  className,
  style,
}: WeatherBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<WeatherScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    sceneRef.current = new WeatherScene(containerRef.current);
    return () => { sceneRef.current?.destroy(); sceneRef.current = null; };
  }, []);

  useEffect(() => {
    sceneRef.current?.set({ condition, intensity, time, transitionMs });
  }, [condition, intensity, time, transitionMs]);

  return <div ref={containerRef} className={className} style={style} />;
}
