# Weather Animations

[![npm version](https://img.shields.io/npm/v/weather-animations)](https://www.npmjs.com/package/weather-animations)
[![npm downloads](https://img.shields.io/npm/dm/weather-animations)](https://www.npmjs.com/package/weather-animations)
[![license](https://img.shields.io/npm/l/weather-animations)](https://www.npmjs.com/package/weather-animations)

Canvas-powered JavaScript weather backgrounds with TypeScript types, smooth transitions, configurable intensity, day/night palettes, moon phases, and sunrise, sunset, moonrise, and moonset events.

npm package: [weather-animations](https://www.npmjs.com/package/weather-animations)

Live demo: [g3sthousen.github.io/weather-animations](https://g3sthousen.github.io/weather-animations/)

## Features

- Animated weather states for clear, cloudy, overcast, rain, drizzle, showers, freezing rain, sleet, snow, flurries, blizzard, storm, fog, mist, haze, smoke, dust, wind, and hail.
- Light, medium, and heavy intensity variants.
- Day and night rendering with condition-specific sky palettes.
- Subtle/rich fidelity modes for states with extra visual detail.
- Moon phase rendering and gated celestial events.
- Core JavaScript API with TypeScript types plus a small React wrapper.
- Duotone SVG weather icons for the core icon-supported conditions and intensities.
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

Build the core, React, and icon library bundles:

```bash
npm run build
```

Build the static demo for GitHub Pages:

```bash
npm run build:demo
```

Run tests:

```bash
npm test
npm run test:visual
```

## JavaScript Usage

ES modules:

```js
import { WeatherScene } from 'weather-animations';

const container = document.querySelector('#weather');
const scene = new WeatherScene(container);

scene.set({
  condition: 'rain',
  intensity: 'medium',
  time: 'night',
  fidelity: 'rich',
  transitionMs: 1200,
});
```

CommonJS:

```js
const { WeatherScene } = require('weather-animations');

const container = document.querySelector('#weather');
const scene = new WeatherScene(container);

scene.set({
  condition: 'showers',
  intensity: 'medium',
  time: 'day',
});
```

Clean up when the host view unmounts:

```js
scene.destroy();
```

## TypeScript Usage

The package ships generated declaration files for the core API, React wrapper, and icon components.

```ts
import { WeatherScene, type WeatherConfig } from 'weather-animations';

const container = document.querySelector<HTMLElement>('#weather');
if (!container) throw new Error('Missing weather container');

const config: WeatherConfig = {
  condition: 'freezing-rain',
  intensity: 'medium',
  time: 'night',
};

new WeatherScene(container).set(config);
```

## React Usage

JavaScript or TypeScript React apps can import the wrapper from `weather-animations/react`.

```jsx
import { WeatherBackground } from 'weather-animations/react';

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

## Weather Icons

The icon subpackage provides 24 duotone SVG icons: 8 icon-supported weather conditions times 3 intensities.

React components:

```jsx
import { RainHeavyIcon, getIconName } from 'weather-animations/react-icons';

export function WeatherBadge() {
  return (
    <RainHeavyIcon
      width={32}
      height={32}
      aria-label="Heavy rain"
      style={{
        '--wi-primary': '#5f7480',
        '--wi-accent': '#38a7ff',
      }}
    />
  );
}

getIconName('rain', 'heavy'); // "rain-heavy"
```

Raw SVG assets are exported from `weather-animations/icons/*`:

```js
const iconPath = require.resolve('weather-animations/icons/rain-heavy.svg');
```

Icon components use standard SVG props such as `width`, `height`, `className`, `style`, and ARIA attributes. Colors can be themed with `--wi-primary` and `--wi-accent`.

Icons currently cover `clear`, `cloudy`, `rain`, `snow`, `storm`, `fog`, `wind`, and `hail`. Newer render-only conditions such as `drizzle`, `showers`, `freezing-rain`, `overcast`, `mist`, `haze`, `smoke`, `dust`, `sleet`, `flurries`, and `blizzard` can be mapped to nearby icons by the host app until dedicated icons are added.

## Configuration

| Option | Values | Default |
| --- | --- | --- |
| `condition` | `clear`, `cloudy`, `overcast`, `rain`, `drizzle`, `showers`, `freezing-rain`, `sleet`, `snow`, `flurries`, `blizzard`, `storm`, `fog`, `mist`, `haze`, `smoke`, `dust`, `wind`, `hail` | Required |
| `intensity` | `light`, `medium`, `heavy` | `medium` |
| `time` | `day`, `night` | `day` |
| `fidelity` | `subtle`, `rich` | `subtle` |
| `moonPhase` | `new`, `waxing-crescent`, `first-quarter`, `waxing-gibbous`, `full`, `waning-gibbous`, `last-quarter`, `waning-crescent` | `full` |
| `celestialEvent` | `none`, `sunrise`, `sunset`, `moonrise`, `moonset` | `none` |
| `celestialProgress` | Number from `0` to `1` | `0.5` |
| `transitionMs` | Number in milliseconds | `1200` |

Celestial events are normalized by the core renderer. Sunrise and sunset are only shown during day states; moonrise and moonset are only shown during night states. Events are available for clear, wind, and light/medium cloudy skies.

For `cloudy`, intensity maps to cloud-cover language: `light` is partly cloudy, `medium` is mostly cloudy, and `heavy` is dense cloudy. Use `overcast` for a fully covered sky.

The demo disables the fidelity switch for conditions where `rich` has no meaningful visual effect.

## Weather API Mapping

The public API is intentionally small so it can be mapped from most weather providers:

- Map provider weather codes to one of the supported `condition` values, or use `normalizeWeatherInput()` with neutral weather fields.
- Map precipitation, cloud cover, wind speed, or provider severity to `light`, `medium`, or `heavy`.
- For cloud cover, prefer `cloudy/light` for partly cloudy, `cloudy/medium` for mostly cloudy, `cloudy/heavy` for dense cloudy, and `overcast` for a closed cloud deck.
- Map local sunrise/sunset and current time to `time` and optional `celestialEvent`.
- Use provider moon phase data for `moonPhase` when available.

Provider-neutral helper:

```js
import { normalizeWeatherInput, WeatherScene } from 'weather-animations';

const config = normalizeWeatherInput({
  precipitationType: 'sleet',
  precipitationIntensity: 0.8,
  cloudCover: 100,
  time: 'night',
});

new WeatherScene(container).set(config);
```

Keep provider-specific code tables outside the renderer, then pass the normalized result into `WeatherScene.set()` or `WeatherBackground`.

## Development

```bash
npm test
./node_modules/.bin/tsc --noEmit --skipLibCheck
npm run build
npm run test:visual
```

Visual tests use Playwright snapshots in `tests/visual`.

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first so the scope and API impact can be discussed before implementation.

Before opening a pull request:

- Keep the change focused and explain the user-facing impact.
- Run `npm test`, `./node_modules/.bin/tsc --noEmit --skipLibCheck`, and `npm run build`.
- Include visual notes or screenshots for rendering changes.

External pull requests are reviewed by the maintainer. Only the maintainer approves and merges changes into `main`.
