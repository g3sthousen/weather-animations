# Weather Animations

Canvas-powered TypeScript weather backgrounds with smooth transitions, configurable intensity, day/night palettes, moon phases, and sunrise, sunset, moonrise, and moonset events.

## Features

- Animated weather states for clear, cloudy, rain, snow, storm, fog, wind, and hail.
- Light, medium, and heavy intensity variants.
- Day and night rendering with condition-specific sky palettes.
- Subtle/rich fidelity modes for states with extra visual detail.
- Moon phase rendering and gated celestial events.
- Core TypeScript API plus a small React wrapper.
- Deterministic test hooks for visual and unit testing.

## Quick Start

Install dependencies:

```bash
npm install
```

Run the demo:

```bash
npm run dev
```

Build the core and React library bundles:

```bash
npm run build:lib
```

Run tests:

```bash
npm test
npm run test:visual
```

## Core Usage

```ts
import { WeatherScene } from './src/core';

const container = document.querySelector('#weather') as HTMLElement;
const scene = new WeatherScene(container);

scene.set({
  condition: 'rain',
  intensity: 'medium',
  time: 'night',
  fidelity: 'rich',
  transitionMs: 1200,
});
```

Update the scene whenever the weather changes:

```ts
scene.set({
  condition: 'wind',
  intensity: 'heavy',
  time: 'day',
});
```

Clean up when the host view unmounts:

```ts
scene.destroy();
```

## React Usage

```tsx
import { WeatherBackground } from './src/react/WeatherBackground';

export function App() {
  return (
    <WeatherBackground
      condition="cloudy"
      intensity="light"
      time="day"
      style={{ position: 'absolute', inset: 0 }}
    />
  );
}
```

## Configuration

| Option | Values | Default |
| --- | --- | --- |
| `condition` | `clear`, `cloudy`, `rain`, `snow`, `storm`, `fog`, `wind`, `hail` | Required |
| `intensity` | `light`, `medium`, `heavy` | `medium` |
| `time` | `day`, `night` | `day` |
| `fidelity` | `subtle`, `rich` | `subtle` |
| `moonPhase` | `new`, `waxing-crescent`, `first-quarter`, `waxing-gibbous`, `full`, `waning-gibbous`, `last-quarter`, `waning-crescent` | `full` |
| `celestialEvent` | `none`, `sunrise`, `sunset`, `moonrise`, `moonset` | `none` |
| `celestialProgress` | Number from `0` to `1` | `0.5` |
| `transitionMs` | Number in milliseconds | `1200` |

Celestial events are normalized by the core renderer. Sunrise and sunset are only shown during day states; moonrise and moonset are only shown during night states. Events are available for clear, wind, and light/medium cloudy skies.

The demo disables the fidelity switch for conditions where `rich` has no meaningful visual effect.

## Weather API Mapping

The public API is intentionally small so it can be mapped from most weather providers:

- Map provider weather codes to one of the supported `condition` values.
- Map precipitation, cloud cover, wind speed, or provider severity to `light`, `medium`, or `heavy`.
- Map local sunrise/sunset and current time to `time` and optional `celestialEvent`.
- Use provider moon phase data for `moonPhase` when available.

Keep provider-specific logic outside the renderer, then pass the normalized result into `WeatherScene.set()` or `WeatherBackground`.

## Development

```bash
npm test
./node_modules/.bin/tsc --noEmit --skipLibCheck
npm run test:visual
```

Visual tests use Playwright snapshots in `tests/visual`.
