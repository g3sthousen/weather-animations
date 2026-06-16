// tests/unit/atmosphere.test.ts
import { describe, it, expect } from 'vitest';
import { celestialPosition, createAtmosphereState, drawAtmosphere, fogBob, getCelestialOpacity, updateAtmosphere } from '../../src/core/atmosphere';
import { resolveConfig, type ResolvedConfig } from '../../src/core/types';

type RecordingContext = CanvasRenderingContext2D & {
  drawImages: Array<[unknown, number, number]>;
  fillRects: Array<[number, number, number, number]>;
};

function ensureOffscreenCanvas(): void {
  if ('OffscreenCanvas' in globalThis) return;

  class TestOffscreenCanvas {
    width: number;
    height: number;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
    }

    getContext(): unknown {
      const gradient = { addColorStop: () => undefined };
      return {
        arc: () => undefined,
        beginPath: () => undefined,
        createRadialGradient: () => gradient,
        fill: () => undefined,
        set fillStyle(_: unknown) {},
      };
    }
  }

  (globalThis as unknown as { OffscreenCanvas: typeof OffscreenCanvas }).OffscreenCanvas = TestOffscreenCanvas as unknown as typeof OffscreenCanvas;
}

function createRecordingContext(): RecordingContext {
  const gradient = { addColorStop: () => undefined };
  let globalAlpha = 1;
  const ctx = {
    drawImages: [] as Array<[unknown, number, number]>,
    fillRects: [] as Array<[number, number, number, number]>,
    save: () => undefined,
    restore: () => undefined,
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    drawImage(image: unknown, x: number, y: number) {
      this.drawImages.push([image, x, y]);
    },
    fillRect(x: number, y: number, width: number, height: number) {
      this.fillRects.push([x, y, width, height]);
    },
    get globalAlpha() { return globalAlpha; },
    set globalAlpha(value: number) { globalAlpha = value; },
    set fillStyle(_: unknown) {},
  };
  return ctx as unknown as RecordingContext;
}

function generatePlumes(condition: ResolvedConfig['condition'], intensity: ResolvedConfig['intensity'] = 'medium') {
  const state = createAtmosphereState();
  updateAtmosphere(state, resolveConfig({ condition, intensity }), 0);
  return state.fogPlumes ?? [];
}

describe('fogBob', () => {
  it('returns baseY at time 0 with phase 0', () => {
    expect(fogBob(0, 100, 10, 0.5, 0)).toBeCloseTo(100);
  });
  it('adds amplitude at the sine peak', () => {
    expect(fogBob(Math.PI / 2 / 0.5, 100, 10, 0.5, 0)).toBeCloseTo(110);
  });
  it('respects phase offset', () => {
    expect(fogBob(0, 100, 10, 0.5, Math.PI / 2)).toBeCloseTo(110);
  });
});

describe('haze intensity', () => {
  it('increases haze plume count and vertical coverage by intensity', () => {
    const light = createAtmosphereState();
    const medium = createAtmosphereState();
    const heavy = createAtmosphereState();

    updateAtmosphere(light, resolveConfig({ condition: 'haze', intensity: 'light' }), 0);
    updateAtmosphere(medium, resolveConfig({ condition: 'haze', intensity: 'medium' }), 0);
    updateAtmosphere(heavy, resolveConfig({ condition: 'haze', intensity: 'heavy' }), 0);

    expect(light.fogPlumes?.length).toBe(2);
    expect(medium.fogPlumes?.length).toBe(3);
    expect(heavy.fogPlumes?.length).toBe(5);
    const lastHeavy = heavy.fogPlumes?.[heavy.fogPlumes.length - 1]?.baseY ?? 0;
    const lastMedium = medium.fogPlumes?.[medium.fogPlumes.length - 1]?.baseY ?? 0;
    expect(lastHeavy).toBeGreaterThan(lastMedium);
  });

  it('rebuilds haze plumes when intensity changes', () => {
    const state = createAtmosphereState();

    updateAtmosphere(state, resolveConfig({ condition: 'haze', intensity: 'light' }), 0);
    expect(state.fogPlumes?.length).toBe(2);

    updateAtmosphere(state, resolveConfig({ condition: 'haze', intensity: 'heavy' }), 0);

    expect(state.fogPlumes?.length).toBe(5);
  });
});

describe('fog intensity', () => {
  it('uses dense intensity-based plumes lower than mist', () => {
    const light = generatePlumes('fog', 'light');
    const medium = generatePlumes('fog', 'medium');
    const heavy = generatePlumes('fog', 'heavy');
    const mist = generatePlumes('mist', 'medium');

    expect(light.length).toBe(3);
    expect(medium.length).toBe(5);
    expect(heavy.length).toBe(7);
    expect(Math.min(...medium.map((plume) => plume.baseY))).toBeGreaterThan(Math.min(...mist.map((plume) => plume.baseY)));
  });
});

describe('mist intensity', () => {
  it('uses sparse intensity-based plumes higher than fog', () => {
    const light = generatePlumes('mist', 'light');
    const medium = generatePlumes('mist', 'medium');
    const heavy = generatePlumes('mist', 'heavy');
    const fog = generatePlumes('fog', 'medium');

    expect(light.length).toBe(1);
    expect(medium.length).toBe(2);
    expect(heavy.length).toBe(3);
    expect(Math.max(...medium.map((plume) => plume.baseY))).toBeLessThan(Math.max(...fog.map((plume) => plume.baseY)));
  });
});

describe('smoke intensity', () => {
  it('uses denser plume coverage than haze and scales by intensity', () => {
    const light = createAtmosphereState();
    const heavy = createAtmosphereState();
    const haze = createAtmosphereState();

    updateAtmosphere(light, resolveConfig({ condition: 'smoke', intensity: 'light' }), 0);
    updateAtmosphere(heavy, resolveConfig({ condition: 'smoke', intensity: 'heavy' }), 0);
    updateAtmosphere(haze, resolveConfig({ condition: 'haze', intensity: 'medium' }), 0);

    expect(light.fogPlumes?.length).toBe(3);
    expect(heavy.fogPlumes?.length).toBe(6);
    expect(heavy.fogPlumes?.length).toBeGreaterThan(haze.fogPlumes?.length ?? 0);
    expect(Math.min(...(heavy.fogPlumes ?? []).map((plume) => plume.speed))).toBeGreaterThan(0.01);
  });
});

describe('smog intensity', () => {
  it('uses visibility plumes between haze and smoke and scales by intensity', () => {
    const light = createAtmosphereState();
    const heavy = createAtmosphereState();
    const haze = createAtmosphereState();
    const smoke = createAtmosphereState();

    updateAtmosphere(light, resolveConfig({ condition: 'smog', intensity: 'light' }), 0);
    updateAtmosphere(heavy, resolveConfig({ condition: 'smog', intensity: 'heavy' }), 0);
    updateAtmosphere(haze, resolveConfig({ condition: 'haze', intensity: 'medium' }), 0);
    updateAtmosphere(smoke, resolveConfig({ condition: 'smoke', intensity: 'heavy' }), 0);

    expect(light.fogPlumes?.length).toBe(3);
    expect(heavy.fogPlumes?.length).toBe(5);
    expect(heavy.fogPlumes?.length).toBeGreaterThan(haze.fogPlumes?.length ?? 0);
    expect(heavy.fogPlumes?.length).toBeLessThan(smoke.fogPlumes?.length ?? 0);
    expect(Math.min(...(heavy.fogPlumes ?? []).map((plume) => plume.speed))).toBeGreaterThan(0.008);
  });
});

describe('dust intensity', () => {
  it('uses warm visibility plumes and scales coverage by intensity', () => {
    const light = createAtmosphereState();
    const heavy = createAtmosphereState();

    updateAtmosphere(light, resolveConfig({ condition: 'dust', intensity: 'light' }), 0);
    updateAtmosphere(heavy, resolveConfig({ condition: 'dust', intensity: 'heavy' }), 0);

    expect(light.fogPlumes?.length).toBe(3);
    expect(heavy.fogPlumes?.length).toBe(6);
    const firstHeavy = heavy.fogPlumes?.[0];
    expect(firstHeavy?.baseY).toBeGreaterThanOrEqual(0.18);
    expect(firstHeavy?.speed).toBeGreaterThan(0.015);
  });
});

describe('visibility plume motion', () => {
  it('adds nonzero sway settings to haze, smog, smoke, and dust plumes', () => {
    for (const condition of ['haze', 'smog', 'smoke', 'dust'] as const) {
      const plumes = generatePlumes(condition);

      expect(plumes.length).toBeGreaterThan(0);
      expect(plumes.every((plume) => plume.swayAmp > 0)).toBe(true);
      expect(plumes.every((plume) => plume.swayFreq > 0)).toBe(true);
      expect(plumes.every((plume) => plume.swayPhase >= 0)).toBe(true);
    }
  });

  it('keeps condition-appropriate minimum drift speeds', () => {
    const hazeMin = Math.min(...generatePlumes('haze').map((plume) => plume.speed));
    const smogMin = Math.min(...generatePlumes('smog').map((plume) => plume.speed));
    const smokeMin = Math.min(...generatePlumes('smoke').map((plume) => plume.speed));
    const dustMin = Math.min(...generatePlumes('dust').map((plume) => plume.speed));

    expect(hazeMin).toBeGreaterThanOrEqual(0.008);
    expect(smogMin).toBeGreaterThanOrEqual(0.012);
    expect(smokeMin).toBeGreaterThanOrEqual(0.014);
    expect(dustMin).toBeGreaterThanOrEqual(0.022);
  });

  it('changes plume draw x as time advances through sway', () => {
    ensureOffscreenCanvas();
    const config = resolveConfig({ condition: 'haze', intensity: 'medium' });
    const state = createAtmosphereState();
    updateAtmosphere(state, config, 0);
    const plume = state.fogPlumes?.[0];
    expect(plume).toBeDefined();
    if (!plume) return;

    plume.baseX = 0.5;
    plume.baseY = 0.5;
    plume.speed = 0;
    plume.bobAmp = 0;
    plume.swayAmp = 24;
    plume.swayFreq = 1;
    plume.swayPhase = 0;

    const firstCtx = createRecordingContext();
    state.time = 0;
    drawAtmosphere(firstCtx, config, state, 1, 800, 600);

    const secondCtx = createRecordingContext();
    state.time = Math.PI / 2;
    drawAtmosphere(secondCtx, config, state, 1, 800, 600);

    expect(secondCtx.drawImages[0][1]).toBeGreaterThan(firstCtx.drawImages[0][1]);
  });
});

describe('getCelestialOpacity', () => {
  it('lets cloudy light and medium show celestial bodies while heavy stays covered', () => {
    expect(getCelestialOpacity(resolveConfig({ condition: 'cloudy', intensity: 'light' }))).toBeCloseTo(0.45);
    expect(getCelestialOpacity(resolveConfig({ condition: 'cloudy', intensity: 'medium' }))).toBeCloseTo(0.22);
    expect(getCelestialOpacity(resolveConfig({ condition: 'cloudy', intensity: 'heavy' }))).toBe(0);
  });

  it('lets light and medium haze show a muted daytime sun while heavy haze hides it', () => {
    expect(getCelestialOpacity(resolveConfig({ condition: 'haze', intensity: 'light', time: 'day' }))).toBeCloseTo(0.35);
    expect(getCelestialOpacity(resolveConfig({ condition: 'haze', intensity: 'medium', time: 'day' }))).toBeCloseTo(0.18);
    expect(getCelestialOpacity(resolveConfig({ condition: 'haze', intensity: 'heavy', time: 'day' }))).toBe(0);
  });

  it('keeps existing clear and wind day behavior visible at full strength', () => {
    expect(getCelestialOpacity(resolveConfig({ condition: 'clear', time: 'day' }))).toBe(1);
    expect(getCelestialOpacity(resolveConfig({ condition: 'clear', time: 'night' }))).toBe(1);
    expect(getCelestialOpacity(resolveConfig({ condition: 'wind', time: 'day' }))).toBe(1);
  });

  it('does not add celestial bodies to rainy or windy nights', () => {
    expect(getCelestialOpacity(resolveConfig({ condition: 'rain', time: 'day' }))).toBe(0);
    expect(getCelestialOpacity(resolveConfig({ condition: 'wind', time: 'night' }))).toBe(0);
  });

  it('does not force invalid active celestial events to full opacity', () => {
    const invalidSunrise: ResolvedConfig = {
      ...resolveConfig({ condition: 'rain', time: 'day' }),
      celestialEvent: 'sunrise',
    };
    const wrongTimeMoonrise: ResolvedConfig = {
      ...resolveConfig({ condition: 'clear', time: 'day' }),
      celestialEvent: 'moonrise',
    };

    expect(getCelestialOpacity(invalidSunrise)).toBe(0);
    expect(getCelestialOpacity(wrongTimeMoonrise)).toBe(0);
  });
});

describe('celestialPosition', () => {
  it('keeps none events at the normal sky position', () => {
    expect(celestialPosition('none', 0)).toEqual({ x: 0.75, y: 0.18 });
    expect(celestialPosition('none', 1)).toEqual({ x: 0.75, y: 0.18 });
  });

  it('moves sunrise and moonrise from the left horizon to the top of the arc', () => {
    const sunriseStart = celestialPosition('sunrise', 0);
    const sunriseMid = celestialPosition('sunrise', 0.5);
    const sunriseEnd = celestialPosition('sunrise', 1);
    const moonriseStart = celestialPosition('moonrise', 0);
    const moonriseMid = celestialPosition('moonrise', 0.5);
    const moonriseEnd = celestialPosition('moonrise', 1);

    expect(sunriseStart.y).toBeGreaterThan(sunriseEnd.y);
    expect(moonriseStart.y).toBeGreaterThan(moonriseEnd.y);
    expect(sunriseStart.x).toBeLessThan(sunriseMid.x);
    expect(sunriseMid.x).toBeLessThan(sunriseEnd.x);
    expect(moonriseStart.x).toBeLessThan(moonriseMid.x);
    expect(moonriseMid.x).toBeLessThan(moonriseEnd.x);
    expect(sunriseStart).toEqual({ x: 0.18, y: 0.68 });
    expect(sunriseEnd).toEqual({ x: 0.5, y: 0.18 });
    expect(moonriseStart).toEqual(sunriseStart);
    expect(moonriseEnd).toEqual(sunriseEnd);
  });

  it('moves sunset and moonset from the top of the arc to the right horizon', () => {
    const sunsetStart = celestialPosition('sunset', 0);
    const sunsetMid = celestialPosition('sunset', 0.5);
    const sunsetEnd = celestialPosition('sunset', 1);
    const moonsetStart = celestialPosition('moonset', 0);
    const moonsetMid = celestialPosition('moonset', 0.5);
    const moonsetEnd = celestialPosition('moonset', 1);

    expect(sunsetStart.y).toBeLessThan(sunsetEnd.y);
    expect(moonsetStart.y).toBeLessThan(moonsetEnd.y);
    expect(sunsetStart.x).toBeLessThan(sunsetMid.x);
    expect(sunsetMid.x).toBeLessThan(sunsetEnd.x);
    expect(moonsetStart.x).toBeLessThan(moonsetMid.x);
    expect(moonsetMid.x).toBeLessThan(moonsetEnd.x);
    expect(sunsetStart).toEqual({ x: 0.5, y: 0.18 });
    expect(sunsetEnd).toEqual({ x: 0.82, y: 0.68 });
    expect(moonsetStart).toEqual(sunsetStart);
    expect(moonsetEnd).toEqual(sunsetEnd);
  });
});

describe('drawAtmosphere', () => {
  it('does not clip the moon horizon glow at the middle of the viewport', () => {
    const ctx = createRecordingContext();

    drawAtmosphere(
      ctx,
      resolveConfig({ condition: 'clear', time: 'night', celestialEvent: 'moonrise' }),
      createAtmosphereState(),
      1,
      800,
      600,
    );

    expect(ctx.fillRects).not.toContainEqual([0, 300, 800, 300]);
  });
});
