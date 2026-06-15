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

The icon subpackage provides one duotone SVG icon per weather condition — all 19 conditions are covered.

| Icon | Condition | React component | Raw SVG |
| --- | --- | --- | --- |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/clear.svg" width="32" height="32" alt="Clear icon"> | `clear` | `ClearIcon` | `weather-animations/icons/clear.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/cloudy.svg" width="32" height="32" alt="Cloudy icon"> | `cloudy` | `CloudyIcon` | `weather-animations/icons/cloudy.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/overcast.svg" width="32" height="32" alt="Overcast icon"> | `overcast` | `OvercastIcon` | `weather-animations/icons/overcast.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/rain.svg" width="32" height="32" alt="Rain icon"> | `rain` | `RainIcon` | `weather-animations/icons/rain.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/drizzle.svg" width="32" height="32" alt="Drizzle icon"> | `drizzle` | `DrizzleIcon` | `weather-animations/icons/drizzle.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/showers.svg" width="32" height="32" alt="Showers icon"> | `showers` | `ShowersIcon` | `weather-animations/icons/showers.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/freezing-rain.svg" width="32" height="32" alt="Freezing rain icon"> | `freezing-rain` | `FreezingRainIcon` | `weather-animations/icons/freezing-rain.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/sleet.svg" width="32" height="32" alt="Sleet icon"> | `sleet` | `SleetIcon` | `weather-animations/icons/sleet.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/snow.svg" width="32" height="32" alt="Snow icon"> | `snow` | `SnowIcon` | `weather-animations/icons/snow.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/flurries.svg" width="32" height="32" alt="Flurries icon"> | `flurries` | `FlurriesIcon` | `weather-animations/icons/flurries.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/blizzard.svg" width="32" height="32" alt="Blizzard icon"> | `blizzard` | `BlizzardIcon` | `weather-animations/icons/blizzard.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/storm.svg" width="32" height="32" alt="Storm icon"> | `storm` | `StormIcon` | `weather-animations/icons/storm.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/hail.svg" width="32" height="32" alt="Hail icon"> | `hail` | `HailIcon` | `weather-animations/icons/hail.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/fog.svg" width="32" height="32" alt="Fog icon"> | `fog` | `FogIcon` | `weather-animations/icons/fog.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/mist.svg" width="32" height="32" alt="Mist icon"> | `mist` | `MistIcon` | `weather-animations/icons/mist.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/haze.svg" width="32" height="32" alt="Haze icon"> | `haze` | `HazeIcon` | `weather-animations/icons/haze.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/smoke.svg" width="32" height="32" alt="Smoke icon"> | `smoke` | `SmokeIcon` | `weather-animations/icons/smoke.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/dust.svg" width="32" height="32" alt="Dust icon"> | `dust` | `DustIcon` | `weather-animations/icons/dust.svg` |
| <img src="https://raw.githubusercontent.com/g3sthousen/weather-animations/main/src/icons/wind.svg" width="32" height="32" alt="Wind icon"> | `wind` | `WindIcon` | `weather-animations/icons/wind.svg` |

React components:

```jsx
import { RainIcon, getIconName } from 'weather-animations/react-icons';

export function WeatherBadge() {
  return (
    <RainIcon
      width={32}
      height={32}
      aria-label="Rain"
      style={{
        '--wi-primary': '#5f7480',
        '--wi-accent': '#38a7ff',
      }}
    />
  );
}

getIconName('rain'); // "rain"
```

Raw SVG assets are exported from `weather-animations/icons/*`:

```js
const iconPath = require.resolve('weather-animations/icons/rain.svg');
```

Icon components use standard SVG props such as `width`, `height`, `className`, `style`, and ARIA attributes. Colors can be themed with `--wi-primary` and `--wi-accent`.

Icons cover every condition: `clear`, `cloudy`, `overcast`, `rain`, `drizzle`, `showers`, `freezing-rain`, `sleet`, `snow`, `flurries`, `blizzard`, `storm`, `hail`, `fog`, `mist`, `haze`, `smoke`, `dust`, and `wind`. The component name is the PascalCase condition followed by `Icon` (e.g. `FreezingRainIcon`).

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
