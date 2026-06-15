import { describe, it, expect } from 'vitest';
import { isCelestialEventVisible, isFidelityEffective, normalizeWeatherInput, resolveConfig, VALID_CELESTIAL_EVENTS, VALID_CONDITIONS, VALID_MOON_PHASES } from '../../src/core/types';

describe('hail condition', () => {
  it('is a valid condition', () => {
    expect(VALID_CONDITIONS).toContain('hail');
  });
  it('resolves hail unchanged', () => {
    expect(resolveConfig({ condition: 'hail' }).condition).toBe('hail');
  });
});

describe('expanded weather conditions', () => {
  const expanded = ['drizzle', 'overcast', 'mist', 'haze', 'sleet'] as const;

  it('exports new conditions as valid renderer conditions', () => {
    for (const condition of expanded) {
      expect(VALID_CONDITIONS).toContain(condition);
      expect(resolveConfig({ condition }).condition).toBe(condition);
    }
  });

  it('keeps celestial events unavailable for the new covered or low-visibility states', () => {
    for (const condition of expanded) {
      expect(resolveConfig({ condition, time: 'day', celestialEvent: 'sunrise' }).celestialEvent).toBe('none');
      expect(resolveConfig({ condition, time: 'night', celestialEvent: 'moonrise' }).celestialEvent).toBe('none');
    }
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

describe('isFidelityEffective', () => {
  it('is off where rich has no meaningful condition-level effect', () => {
    expect(isFidelityEffective({ condition: 'cloudy' })).toBe(false);
    expect(isFidelityEffective({ condition: 'fog' })).toBe(false);
    expect(isFidelityEffective({ condition: 'overcast' })).toBe(false);
    expect(isFidelityEffective({ condition: 'mist' })).toBe(false);
    expect(isFidelityEffective({ condition: 'haze' })).toBe(false);
  });

  it('is on for conditions with extra detail or particle behavior', () => {
    for (const condition of ['clear', 'rain', 'snow', 'storm', 'wind', 'hail', 'drizzle', 'sleet'] as const) {
      expect(isFidelityEffective({ condition })).toBe(true);
    }
  });
});

describe('resolveConfig moonPhase', () => {
  it('defaults moonPhase to full', () => {
    expect(resolveConfig({ condition: 'clear', time: 'night' }).moonPhase).toBe('full');
  });

  it('passes through a valid moonPhase', () => {
    expect(resolveConfig({ condition: 'clear', time: 'night', moonPhase: 'waning-gibbous' }).moonPhase).toBe('waning-gibbous');
  });

  it('falls back to full for invalid moonPhase values', () => {
    expect(resolveConfig({ condition: 'clear', time: 'night', moonPhase: 'blue-moon' as never }).moonPhase).toBe('full');
  });

  it('exports the canonical eight moon phases', () => {
    expect(VALID_MOON_PHASES).toEqual([
      'new',
      'waxing-crescent',
      'first-quarter',
      'waxing-gibbous',
      'full',
      'waning-gibbous',
      'last-quarter',
      'waning-crescent',
    ]);
  });
});

describe('resolveConfig celestial events', () => {
  it('defaults celestial event config', () => {
    const cfg = resolveConfig({ condition: 'clear' });

    expect(cfg.celestialEvent).toBe('none');
    expect(cfg.celestialProgress).toBe(0.5);
  });

  it('passes through valid sun events and progress during clear days', () => {
    const sunrise = resolveConfig({ condition: 'clear', time: 'day', celestialEvent: 'sunrise', celestialProgress: 0.25 });
    const sunset = resolveConfig({ condition: 'clear', time: 'day', celestialEvent: 'sunset' });

    expect(sunrise.celestialEvent).toBe('sunrise');
    expect(sunrise.celestialProgress).toBe(0.25);
    expect(sunset.celestialEvent).toBe('sunset');
  });

  it('passes through valid moon events during clear nights', () => {
    expect(resolveConfig({ condition: 'clear', time: 'night', celestialEvent: 'moonrise' }).celestialEvent).toBe('moonrise');
    expect(resolveConfig({ condition: 'clear', time: 'night', celestialEvent: 'moonset' }).celestialEvent).toBe('moonset');
  });

  it('allows matching celestial events in light and medium cloudy conditions', () => {
    expect(resolveConfig({ condition: 'cloudy', intensity: 'light', time: 'day', celestialEvent: 'sunrise' }).celestialEvent).toBe('sunrise');
    expect(resolveConfig({ condition: 'cloudy', intensity: 'medium', time: 'night', celestialEvent: 'moonset' }).celestialEvent).toBe('moonset');
  });

  it('allows matching celestial events in windy conditions', () => {
    expect(resolveConfig({ condition: 'wind', time: 'day', celestialEvent: 'sunset' }).celestialEvent).toBe('sunset');
    expect(resolveConfig({ condition: 'wind', time: 'night', celestialEvent: 'moonrise' }).celestialEvent).toBe('moonrise');
  });

  it('falls back to none when celestial events do not match visible conditions', () => {
    expect(resolveConfig({ condition: 'rain', time: 'day', celestialEvent: 'sunrise' }).celestialEvent).toBe('none');
    expect(resolveConfig({ condition: 'cloudy', intensity: 'heavy', time: 'day', celestialEvent: 'sunset' }).celestialEvent).toBe('none');
    expect(resolveConfig({ condition: 'clear', time: 'night', celestialEvent: 'sunrise' }).celestialEvent).toBe('none');
    expect(resolveConfig({ condition: 'clear', time: 'day', celestialEvent: 'moonrise' }).celestialEvent).toBe('none');
  });

  it('falls back to none for invalid celestial events', () => {
    expect(resolveConfig({ condition: 'clear', celestialEvent: 'eclipse' as never }).celestialEvent).toBe('none');
  });

  it('clamps celestial progress to the visible range', () => {
    expect(resolveConfig({ condition: 'clear', celestialProgress: -0.5 }).celestialProgress).toBe(0);
    expect(resolveConfig({ condition: 'clear', celestialProgress: 1.5 }).celestialProgress).toBe(1);
  });

  it('exports the canonical celestial events', () => {
    expect(VALID_CELESTIAL_EVENTS).toEqual(['none', 'sunrise', 'sunset', 'moonrise', 'moonset']);
  });
});

describe('isCelestialEventVisible', () => {
  it('allows none regardless of weather state', () => {
    expect(isCelestialEventVisible('none', { condition: 'storm', intensity: 'heavy', time: 'night' })).toBe(true);
  });

  it('allows sun events only in clear, wind, or light/medium cloudy days', () => {
    expect(isCelestialEventVisible('sunrise', { condition: 'clear', intensity: 'heavy', time: 'day' })).toBe(true);
    expect(isCelestialEventVisible('sunrise', { condition: 'wind', intensity: 'medium', time: 'day' })).toBe(true);
    expect(isCelestialEventVisible('sunset', { condition: 'cloudy', intensity: 'light', time: 'day' })).toBe(true);
    expect(isCelestialEventVisible('sunset', { condition: 'cloudy', intensity: 'medium', time: 'day' })).toBe(true);
    expect(isCelestialEventVisible('sunrise', { condition: 'cloudy', intensity: 'heavy', time: 'day' })).toBe(false);
    expect(isCelestialEventVisible('sunrise', { condition: 'clear', intensity: 'medium', time: 'night' })).toBe(false);
  });

  it('allows moon events only in clear, wind, or light/medium cloudy nights', () => {
    expect(isCelestialEventVisible('moonrise', { condition: 'clear', intensity: 'heavy', time: 'night' })).toBe(true);
    expect(isCelestialEventVisible('moonrise', { condition: 'wind', intensity: 'medium', time: 'night' })).toBe(true);
    expect(isCelestialEventVisible('moonset', { condition: 'cloudy', intensity: 'light', time: 'night' })).toBe(true);
    expect(isCelestialEventVisible('moonset', { condition: 'cloudy', intensity: 'medium', time: 'night' })).toBe(true);
    expect(isCelestialEventVisible('moonrise', { condition: 'cloudy', intensity: 'heavy', time: 'night' })).toBe(false);
    expect(isCelestialEventVisible('moonrise', { condition: 'fog', intensity: 'medium', time: 'night' })).toBe(false);
    expect(isCelestialEventVisible('moonrise', { condition: 'clear', intensity: 'medium', time: 'day' })).toBe(false);
  });
});

describe('normalizeWeatherInput', () => {
  it('maps precipitation types before cloud and wind signals', () => {
    expect(normalizeWeatherInput({
      precipitationType: 'drizzle',
      precipitationIntensity: 'light',
      cloudCover: 100,
      windSpeed: 80,
      time: 'day',
    })).toEqual({ condition: 'drizzle', intensity: 'light', time: 'day' });

    expect(normalizeWeatherInput({
      precipitationType: 'sleet',
      precipitationIntensity: 0.8,
      time: 'night',
    })).toEqual({ condition: 'sleet', intensity: 'heavy', time: 'night' });
  });

  it('maps thunderstorm and visibility states', () => {
    expect(normalizeWeatherInput({ thunderstorm: true, precipitationIntensity: 0.5 })).toEqual({ condition: 'storm', intensity: 'medium' });
    expect(normalizeWeatherInput({ visibility: 'mist' })).toEqual({ condition: 'mist', intensity: 'medium' });
    expect(normalizeWeatherInput({ visibility: 'haze' })).toEqual({ condition: 'haze', intensity: 'medium' });
    expect(normalizeWeatherInput({ visibility: 800 })).toEqual({ condition: 'fog', intensity: 'heavy' });
  });

  it('maps clouds and wind when no stronger phenomenon is present', () => {
    expect(normalizeWeatherInput({ cloudCover: 95 })).toEqual({ condition: 'overcast', intensity: 'heavy' });
    expect(normalizeWeatherInput({ cloudCover: 70 })).toEqual({ condition: 'cloudy', intensity: 'medium' });
    expect(normalizeWeatherInput({ windSpeed: 50 })).toEqual({ condition: 'wind', intensity: 'heavy' });
    expect(normalizeWeatherInput({ phenomenon: 'clear', cloudCover: 5 })).toEqual({ condition: 'clear', intensity: 'light' });
  });

  it('maps cloudy provider language to cloudy intensity tiers', () => {
    expect(normalizeWeatherInput({ phenomenon: 'partly-cloudy' })).toEqual({ condition: 'cloudy', intensity: 'light' });
    expect(normalizeWeatherInput({ phenomenon: 'mostly-cloudy' })).toEqual({ condition: 'cloudy', intensity: 'medium' });
  });
});
