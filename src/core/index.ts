import type { WeatherConfig } from './types';
import { resolveConfig } from './types';
import { createEngineState, startTransition, tickEngine, renderEngine } from './engine';
import type { EngineState } from './engine';

export type { WeatherConfig, Condition, Intensity, TimeOfDay, Fidelity } from './types';

export class WeatherScene {
  private destroyed = false;
  private skyEl: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private rafId: number | null = null;
  private lastTimestamp: number | null = null;
  private engineState: EngineState | null = null;
  private resizeObserver: ResizeObserver;
  private manual: boolean;

  constructor(private container: HTMLElement, opts: { manual?: boolean } = {}) {
    if (!container) throw new Error('WeatherScene: container element is required');
    this.manual = opts.manual ?? false;

    const pos = getComputedStyle(container).position;
    if (pos === 'static') container.style.position = 'relative';
    container.style.overflow = 'hidden';

    this.skyEl = document.createElement('div');
    this.skyEl.style.cssText = 'position:absolute;inset:0;';

    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:absolute;inset:0;';

    container.appendChild(this.skyEl);
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(container);
  }

  private resizeCanvas(): void {
    const { offsetWidth: w, offsetHeight: h } = this.container;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  set(config: WeatherConfig): void {
    if (this.destroyed) return;
    const resolved = resolveConfig(config);
    const { offsetWidth: w, offsetHeight: h } = this.container;

    if (!this.engineState) {
      this.engineState = createEngineState(resolved, w, h);
      if (!this.manual) this.startLoop();
    } else {
      this.engineState = startTransition(this.engineState, resolved, w, h);
    }
  }

  /** Deterministically tick + render N frames at a fixed delta (test hook). */
  advance(frames: number, dtSeconds = 1 / 60): void {
    if (this.destroyed || !this.engineState || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    for (let i = 0; i < frames; i++) {
      this.engineState = tickEngine(this.engineState, dtSeconds, w, h);
    }
    renderEngine(this.engineState, this.skyEl, this.ctx, w, h);
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.stopLoop();
    this.resizeObserver.disconnect();
    this.skyEl.remove();
    this.canvas.remove();
    this.engineState = null;
  }

  private startLoop(): void {
    const tick = (timestamp: number) => {
      if (this.destroyed) return;
      const delta = this.lastTimestamp != null
        ? Math.min((timestamp - this.lastTimestamp) / 1000, 0.1)
        : 0;
      this.lastTimestamp = timestamp;

      if (this.engineState && this.ctx) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.engineState = tickEngine(this.engineState, delta, w, h);
        renderEngine(this.engineState, this.skyEl, this.ctx, w, h);
      }

      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastTimestamp = null;
  }
}
