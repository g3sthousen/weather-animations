import { isCelestialEventVisible, isFidelityEffective, WeatherScene } from '../core/index';
import type { CelestialEvent, Condition, Intensity, TimeOfDay, Fidelity, MoonPhase } from '../core/index';
import { seedRng } from '../core/rng';

const container = document.getElementById('weather-container')!;
const controlsEl = document.getElementById('controls')!;

const params = new URLSearchParams(location.search);
const seedParam = params.get('seed');
if (seedParam !== null) seedRng(Number(seedParam));
const framesParam = params.get('frames');
const manual = framesParam !== null;

const scene = new WeatherScene(container, { manual });

let activeCondition: Condition = (params.get('condition') as Condition) ?? 'clear';
let activeTime: TimeOfDay = (params.get('time') as TimeOfDay) ?? 'day';
let activeIntensity: Intensity = (params.get('intensity') as Intensity) ?? 'medium';
let activeFidelity: Fidelity = (params.get('fidelity') as Fidelity) ?? 'subtle';
let activeMoonPhase: MoonPhase = (params.get('moonPhase') as MoonPhase) ?? 'full';
let activeCelestialEvent: CelestialEvent = (params.get('celestialEvent') as CelestialEvent) ?? 'none';
let activeCelestialProgress = Number(params.get('celestialProgress') ?? 0.5);
if (!Number.isFinite(activeCelestialProgress)) activeCelestialProgress = 0.5;

const CONDITIONS: Condition[] = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind', 'hail'];
const CONDITION_LABELS: Record<Condition, string> = {
  clear: 'Clear', cloudy: 'Cloudy', rain: 'Rain',
  snow: 'Snow', storm: 'Storm', fog: 'Fog', wind: 'Wind', hail: 'Hail',
};
const MOON_PHASES: MoonPhase[] = [
  'new',
  'waxing-crescent',
  'first-quarter',
  'waxing-gibbous',
  'full',
  'waning-gibbous',
  'last-quarter',
  'waning-crescent',
];
const MOON_PHASE_LABELS: Record<MoonPhase, string> = {
  new: 'New',
  'waxing-crescent': 'Wax Cr.',
  'first-quarter': '1st Q.',
  'waxing-gibbous': 'Wax Gib.',
  full: 'Full',
  'waning-gibbous': 'Wan Gib.',
  'last-quarter': 'Last Q.',
  'waning-crescent': 'Wan Cr.',
};
const CELESTIAL_EVENTS: CelestialEvent[] = ['none', 'sunrise', 'sunset', 'moonrise', 'moonset'];
const CELESTIAL_EVENT_LABELS: Record<CelestialEvent, string> = {
  none: 'None',
  sunrise: 'Sunrise',
  sunset: 'Sunset',
  moonrise: 'Moonrise',
  moonset: 'Moonset',
};
const CELESTIAL_PROGRESS_STEPS = [0, 0.25, 0.5, 0.75, 1] as const;

function isActiveCelestialEventVisible(event: CelestialEvent): boolean {
  return isCelestialEventVisible(event, {
    condition: activeCondition,
    intensity: activeIntensity,
    time: activeTime,
  });
}

function normalizeActiveCelestialEvent() {
  if (!isActiveCelestialEventVisible(activeCelestialEvent)) {
    activeCelestialEvent = 'none';
  }
}

function normalizeActiveFidelity() {
  if (!isFidelityEffective({ condition: activeCondition })) {
    activeFidelity = 'subtle';
  }
}

function render() {
  normalizeActiveCelestialEvent();
  normalizeActiveFidelity();
  scene.set({
    condition: activeCondition,
    time: activeTime,
    intensity: activeIntensity,
    fidelity: activeFidelity,
    moonPhase: activeMoonPhase,
    celestialEvent: activeCelestialEvent,
    celestialProgress: activeCelestialProgress,
  });
}

function buildControls() {
  controlsEl.innerHTML = '';

  const condRow = document.createElement('div');
  condRow.className = 'btn-row';
  for (const cond of CONDITIONS) {
    const btn = document.createElement('button');
    btn.textContent = CONDITION_LABELS[cond];
    if (cond === activeCondition) btn.classList.add('active');
    btn.addEventListener('click', () => {
      activeCondition = cond;
      normalizeActiveCelestialEvent();
      normalizeActiveFidelity();
      buildControls();
      render();
    });
    condRow.appendChild(btn);
  }

  const timeRow = document.createElement('div');
  timeRow.className = 'btn-row';
  for (const t of ['day', 'night'] as TimeOfDay[]) {
    const btn = document.createElement('button');
    btn.textContent = t === 'day' ? 'Day' : 'Night';
    if (t === activeTime) btn.classList.add('active');
    btn.addEventListener('click', () => { activeTime = t; normalizeActiveCelestialEvent(); buildControls(); render(); });
    timeRow.appendChild(btn);
  }

  const intRow = document.createElement('div');
  intRow.className = 'btn-row';
  for (const i of ['light', 'medium', 'heavy'] as Intensity[]) {
    const btn = document.createElement('button');
    btn.textContent = i.charAt(0).toUpperCase() + i.slice(1);
    if (i === activeIntensity) btn.classList.add('active');
    btn.addEventListener('click', () => { activeIntensity = i; normalizeActiveCelestialEvent(); buildControls(); render(); });
    intRow.appendChild(btn);
  }

  const fidRow = document.createElement('div');
  fidRow.className = 'btn-row';
  const fidelityEnabled = isFidelityEffective({ condition: activeCondition });
  for (const f of ['subtle', 'rich'] as Fidelity[]) {
    const btn = document.createElement('button');
    btn.textContent = f === 'subtle' ? 'Subtle' : 'Rich';
    btn.disabled = !fidelityEnabled;
    if (f === activeFidelity) btn.classList.add('active');
    btn.addEventListener('click', () => {
      if (!fidelityEnabled) return;
      activeFidelity = f;
      buildControls();
      render();
    });
    fidRow.appendChild(btn);
  }

  const moonRow = document.createElement('div');
  moonRow.className = 'btn-row moon-row';
  for (const phase of MOON_PHASES) {
    const btn = document.createElement('button');
    btn.textContent = MOON_PHASE_LABELS[phase];
    if (phase === activeMoonPhase) btn.classList.add('active');
    btn.addEventListener('click', () => { activeMoonPhase = phase; buildControls(); render(); });
    moonRow.appendChild(btn);
  }

  const eventRow = document.createElement('div');
  eventRow.className = 'btn-row';
  for (const event of CELESTIAL_EVENTS) {
    const btn = document.createElement('button');
    const enabled = isActiveCelestialEventVisible(event);
    btn.textContent = CELESTIAL_EVENT_LABELS[event];
    btn.disabled = !enabled;
    if (event === activeCelestialEvent) btn.classList.add('active');
    btn.addEventListener('click', () => {
      if (!enabled) return;
      activeCelestialEvent = event;
      buildControls();
      render();
    });
    eventRow.appendChild(btn);
  }

  const progressRow = document.createElement('div');
  progressRow.className = 'btn-row progress-row';
  const progressEnabled = activeCelestialEvent !== 'none';
  for (const progress of CELESTIAL_PROGRESS_STEPS) {
    const btn = document.createElement('button');
    btn.textContent = `${Math.round(progress * 100)}%`;
    btn.disabled = !progressEnabled;
    if (Math.abs(progress - activeCelestialProgress) < 0.001) btn.classList.add('active');
    btn.addEventListener('click', () => {
      if (!progressEnabled) return;
      activeCelestialProgress = progress;
      buildControls();
      render();
    });
    progressRow.appendChild(btn);
  }

  controlsEl.appendChild(condRow);
  controlsEl.appendChild(timeRow);
  controlsEl.appendChild(intRow);
  controlsEl.appendChild(fidRow);
  controlsEl.appendChild(moonRow);
  controlsEl.appendChild(eventRow);
  controlsEl.appendChild(progressRow);
}

normalizeActiveCelestialEvent();
normalizeActiveFidelity();
buildControls();
render();
if (manual) scene.advance(Number(framesParam));
