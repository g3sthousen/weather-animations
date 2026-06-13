import { WeatherScene } from '../core/index';
import type { Condition, Intensity, TimeOfDay, Fidelity } from '../core/index';
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

const CONDITIONS: Condition[] = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind'];
const CONDITION_LABELS: Record<Condition, string> = {
  clear: 'Clear', cloudy: 'Cloudy', rain: 'Rain',
  snow: 'Snow', storm: 'Storm', fog: 'Fog', wind: 'Wind',
};

function render() {
  scene.set({ condition: activeCondition, time: activeTime, intensity: activeIntensity, fidelity: activeFidelity });
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
    btn.addEventListener('click', () => { activeTime = t; buildControls(); render(); });
    timeRow.appendChild(btn);
  }

  const intRow = document.createElement('div');
  intRow.className = 'btn-row';
  for (const i of ['light', 'medium', 'heavy'] as Intensity[]) {
    const btn = document.createElement('button');
    btn.textContent = i.charAt(0).toUpperCase() + i.slice(1);
    if (i === activeIntensity) btn.classList.add('active');
    btn.addEventListener('click', () => { activeIntensity = i; buildControls(); render(); });
    intRow.appendChild(btn);
  }

  const fidRow = document.createElement('div');
  fidRow.className = 'btn-row';
  for (const f of ['subtle', 'rich'] as Fidelity[]) {
    const btn = document.createElement('button');
    btn.textContent = f === 'subtle' ? 'Subtle' : 'Rich';
    if (f === activeFidelity) btn.classList.add('active');
    btn.addEventListener('click', () => { activeFidelity = f; buildControls(); render(); });
    fidRow.appendChild(btn);
  }

  controlsEl.appendChild(condRow);
  controlsEl.appendChild(timeRow);
  controlsEl.appendChild(intRow);
  controlsEl.appendChild(fidRow);
}

buildControls();
render();
if (manual) scene.advance(Number(framesParam));
