# React Native Sparkles

A sparkles/explosion effect that I created for another project, it was meant to simulate the sparkles effect in mario party when the characters high five each other after the mini game win.

web interactive demo [https://react-native-spakles.expo.app](https://react-native-spakles.expo.app).

I pulled it out into its own component and added a few simple properties so that I can open source it and share it with the community.

 **Note:** This component uses [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) and [react-native-svg] to draw, so it's only meant for simple UI effects, not for complex animations or games.

## Installation

```sh
npm install react-native-reanimated react-native-svg
```

## Usage

To use, get everything from the components folder and add it to your screen

```jsx
import Sparkles from './components/Sparkles';

<Sparkles
  show={true}
  location={{ x: 100, y: 200 }}
  onComplete={() => {}}
  particleCount={50}
  duration={800}
  shapes={['circle', 'triangle', 'star']}
  colors={['#FFF', '#FFD700']}
  explosionForce={{ min: 300, max: 700 }}
  direction="radial"
  burst={false}
  trail={false}
  gravity={800}
  singleColor={false}
  size={{ min: 6, max: 12 }}
  trailLength={4}
  spreadAngle={120}
  fanDirection={-90}
  rotateParticles={true}
/>
```

## Screenshots

![demo](/../main/screenshots/demo.gif?raw=true "Demo")

## Props

| Prop              | Type                              | Default                        | Description                                                        |
|-------------------|-----------------------------------|--------------------------------|--------------------------------------------------------------------|
| `show`            | `boolean`                         | —                              | Show/hide the sparkles.                                            |
| `location`        | `{ x: number, y: number }`        | —                              | Explosion origin (screen coordinates).                             |
| `onComplete`      | `function`                        | —                              | Called when animation completes.                                   |
| `particleCount`   | `number`                          | `50`                           | Number of particles.                                               |
| `duration`        | `number` (ms)                     | `800`                          | Animation duration.                                                |
| `shapes`          | `string[]`                        | `['circle','triangle','star']` | Particle shapes. (`circle`, `triangle`, `star`, `rect`)            |
| `colors`          | `string[]`                        | see example, 9 colors          | Array of colors for particles.                                     |
| `explosionForce`  | `{ min: number, max: number }`    | `{ min: 300, max: 700 }`       | Particle velocity range.                                           |
| `direction`       | `string` or `number`              | `'radial'`                     | Direction in degrees or `'radial'`.                                |
| `burst`           | `boolean`                         | `false`                        | If true, particles spread evenly in all directions.                |
| `trail`           | `boolean`                         | `false`                        | If true, particles leave a trail.                                  |
| `gravity`         | `number`                          | random (800-1400)              | Gravity applied to particles.                                      |
| `singleColor`     | `boolean`                         | `false`                        | If true, all particles use the same color per burst.               |
| `size`            | `{ min: number, max: number }`    | `{ min: 6, max: 12 }`          | Particle size range.                                               |
| `trailLength`     | `number`                          | `4`                            | Number of trail steps (if `trail` is true).                        |
| `spreadAngle`     | `number`                          | `120`                          | Spread angle in degrees (for fan/cannon).                          |
| `fanDirection`    | `number`                          | `-90`                          | Fan/cannon base direction in degrees.                              |
| `rotateParticles` | `boolean`                         | `true`                         | If true, particles rotate as they move.                            |

## Image Credit

[Mario and Luigi High Five Render by bandicootbrawl96 @ DeviantArt](https://www.deviantart.com/bandicootbrawl96/art/Mario-and-Luigi-High-Five-Render-882057573)

## License

[GPL 2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
