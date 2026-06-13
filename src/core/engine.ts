import type { ResolvedConfig, CloudBlob } from './types';
import { applySky, lerpSky } from './sky';
import { initClouds, updateClouds, drawClouds } from './clouds';
import { drawAtmosphere, updateAtmosphere, createAtmosphereState } from './atmosphere';
import type { AtmosphereState } from './atmosphere';
import { ParticleSystem } from './particles';
import { createTransition, updateTransition, getProgress, isComplete } from './transition';
import type { Transition } from './transition';

export interface EngineState {
  current: ResolvedConfig;
  currentClouds: CloudBlob[];
  currentPS: ParticleSystem;
  currentAtmo: AtmosphereState;
  transition: Transition | null;
  transClouds: CloudBlob[] | null;
  transPS: ParticleSystem | null;
  transAtmo: AtmosphereState | null;
}

export function createEngineState(config: ResolvedConfig, width: number, height: number): EngineState {
  const ps = new ParticleSystem();
  ps.init(config, width, height);
  return {
    current: config,
    currentClouds: initClouds(config, width, height),
    currentPS: ps,
    currentAtmo: createAtmosphereState(),
    transition: null,
    transClouds: null,
    transPS: null,
    transAtmo: null,
  };
}

export function startTransition(state: EngineState, to: ResolvedConfig, width: number, height: number): EngineState {
  const from = state.current;
  const newPS = new ParticleSystem();
  newPS.init(to, width, height);
  return {
    ...state,
    transition: createTransition(from, to),
    transClouds: initClouds(to, width, height),
    transPS: newPS,
    transAtmo: createAtmosphereState(),
  };
}

export function tickEngine(
  state: EngineState,
  delta: number,
  width: number,
  height: number,
): EngineState {
  let next = { ...state };

  updateAtmosphere(next.currentAtmo, next.current, delta);
  next.currentPS.update(delta);
  updateClouds(next.currentClouds, delta, width);

  if (next.transition) {
    const t = updateTransition(next.transition, delta);
    next.transition = t;

    if (next.transAtmo) updateAtmosphere(next.transAtmo, t.to, delta);
    if (next.transPS) next.transPS.update(delta);
    if (next.transClouds) updateClouds(next.transClouds, delta, width);

    if (isComplete(t)) {
      next = {
        current: t.to,
        currentClouds: next.transClouds!,
        currentPS: next.transPS!,
        currentAtmo: next.transAtmo!,
        transition: null,
        transClouds: null,
        transPS: null,
        transAtmo: null,
      };
    }
  }

  return next;
}

export function renderEngine(
  state: EngineState,
  skyEl: HTMLElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  ctx.clearRect(0, 0, width, height);

  if (state.transition) {
    const progress = getProgress(state.transition);
    const from = state.transition.from;
    const to = state.transition.to;

    lerpSky(skyEl, from, to, progress);

    const fromAlpha = 1 - progress;
    drawClouds(ctx, state.currentClouds, from, fromAlpha);
    drawAtmosphere(ctx, from, state.currentAtmo, fromAlpha, width, height);
    state.currentPS.draw(ctx, fromAlpha, from);

    if (state.transClouds) drawClouds(ctx, state.transClouds, to, progress);
    if (state.transAtmo) drawAtmosphere(ctx, to, state.transAtmo, progress, width, height);
    if (state.transPS) state.transPS.draw(ctx, progress, to);
  } else {
    applySky(skyEl, state.current, state.currentAtmo.lightningFlash);
    drawClouds(ctx, state.currentClouds, state.current, 1);
    drawAtmosphere(ctx, state.current, state.currentAtmo, 1, width, height);
    state.currentPS.draw(ctx, 1, state.current);
  }
}
