/**
 * Procedural pixel-art sunset — TypeScript port of Dusk DS `references/assets/pixel-sunset.js`.
 * Colours are read from the `--color-sunset-*` custom properties (see styles/theme.css),
 * so the illustration follows the theme and holds no colour of its own.
 */
import { parseColor } from '../lib/color';

type RGB = readonly [number, number, number];

export interface SunsetOptions {
  /** Size of one logical pixel, in CSS px. */
  pixel?: number;
  /** Horizon height, 0 (top) to 1 (bottom). */
  horizon?: number;
  /** Sun centre, 0 (left) to 1 (right). */
  sunX?: number;
  /** Sun radius as a ratio of the shortest side. */
  sunR?: number;
  /** Star density. */
  stars?: number;
  seed?: number;
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

const SKY = ['sky-0', 'sky-1', 'sky-2', 'sky-3', 'sky-4', 'glow'];
const SUN = ['sun-top', 'sun-mid', 'sun-low', 'sun-base'];
const HILLS = ['hill-far', 'hill-mid', 'hill-near'];
const STARS = ['star-dim', 'star-warm'];

const CLOUDS = [
  [0.18, 0.7, 0.16],
  [0.32, 0.74, 0.12],
  [0.8, 0.72, 0.2],
  [0.5, 0.77, 0.08],
] as const;

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

/** Clamped lookup, so an index computed from geometry can never fall outside a palette. */
const at = <T>(list: readonly T[], i: number): T =>
  list[Math.min(list.length - 1, Math.max(0, i))] as T;

function noise1(x: number, seed: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const hash = (n: number) => {
    const v = Math.sin((n + seed) * 127.1) * 43758.5453;
    return v - Math.floor(v);
  };
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

function readPalette(names: readonly string[]): RGB[] | null {
  const styles = getComputedStyle(document.documentElement);
  const colors: RGB[] = [];
  for (const name of names) {
    const parsed = parseColor(styles.getPropertyValue(`--color-sunset-${name}`));
    if (!parsed) return null;
    colors.push([parsed[0], parsed[1], parsed[2]]);
  }
  return colors;
}

/** Paints the scene. Returns false when the canvas has no size or the theme colours are missing. */
export function paintSunset(canvas: HTMLCanvasElement, options: SunsetOptions = {}): boolean {
  const P = options.pixel ?? 4;
  const w = Math.ceil(canvas.clientWidth / P);
  const h = Math.ceil(canvas.clientHeight / P);
  const ctx = canvas.getContext('2d');
  const sky = readPalette(SKY);
  const sun = readPalette(SUN);
  const hills = readPalette(HILLS);
  const stars = readPalette(STARS);
  if (!w || !h || !ctx || !sky || !sun || !hills || !stars) return false;

  canvas.width = w;
  canvas.height = h;
  const image = ctx.createImageData(w, h);
  const data = image.data;

  const horizon = Math.floor(h * (options.horizon ?? 0.8));
  const sunX = Math.floor(w * (options.sunX ?? 0.63));
  const sunR = Math.max(10, Math.floor(Math.min(w, h) * (options.sunR ?? 0.13)));

  const put = (x: number, y: number, c: RGB) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const k = (y * w + x) * 4;
    data[k] = c[0];
    data[k + 1] = c[1];
    data[k + 2] = c[2];
    data[k + 3] = 255;
  };

  // 1. Sky — continuous gradient, 4 quantised steps per band, Bayer-dithered
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = Math.min(1, Math.max(0, (y / horizon - 0.32) / 0.68)) * (sky.length - 1);
      const i = Math.min(sky.length - 2, Math.floor(t));
      const f = t - i;
      const dither = (at(at(BAYER, y % 4), x % 4) + 0.5) / 16;
      const q = Math.min(4, Math.max(0, Math.floor(f * 4 + dither))) / 4;
      put(x, y, mix(at(sky, i), at(sky, i + 1), q));
    }
  }

  // 2. Stars — sparse, mostly dim, a few warm
  let s = options.seed ?? 3;
  const random = () => (s = (s * 48271) % 2147483647) / 2147483647;
  const starCount = w * h * (options.stars ?? 0.0006);
  for (let k = 0; k < starCount; k++) {
    const x = Math.floor(random() * w);
    const y = Math.floor(random() * horizon * 0.6);
    put(x, y, at(stars, random() > 0.9 ? 1 : 0));
  }

  // 3. Sun — half disc, horizontal cuts thickening toward the bottom
  for (let y = horizon - sunR; y < horizon + Math.floor(sunR * 0.35); y++) {
    const dy = y - horizon;
    const rr = Math.sqrt(Math.max(0, sunR * sunR - (dy < 0 ? dy * dy : (dy * 0.6) ** 2)));
    const rel = (y - (horizon - sunR)) / (sunR * 1.35);
    if (rel > 0.55 && y % Math.max(3, Math.round(6 - rel * 4)) === 0) continue;
    const color = at(sun, Math.floor(rel * 4));
    for (let x = Math.floor(sunX - rr); x <= sunX + rr; x++) put(x, y, color);
  }

  // 4. Cloud strips
  for (const [cx, cy, cw] of CLOUDS) {
    const y0 = Math.floor(h * cy);
    const x0 = Math.floor(w * (cx - cw / 2));
    const x1 = Math.floor(w * (cx + cw / 2));
    for (let x = x0; x < x1; x++) {
      put(x, y0, mix(at(sky, 3), at(sun, 2), 0.55));
      if (x > x0 + 4 && x < x1 - 6) put(x, y0 - 1, mix(at(sky, 2), at(sky, 3), 0.6));
    }
  }

  // 5. Hills — three stepped-noise silhouettes, small trees on the nearest layer
  hills.forEach((color, layer) => {
    const base = horizon + Math.floor(h * (0.02 + layer * 0.07));
    const amplitude = h * (0.06 + layer * 0.03);
    for (let x = 0; x < w; x++) {
      const step = Math.floor(x / (3 + layer)) * (3 + layer);
      const top = Math.floor(base - noise1(step / (14 + layer * 6), layer * 11) * amplitude);
      for (let y = Math.max(0, top); y < h; y++) put(x, y, color);
      if (layer === 2 && noise1(x / 3, 99) > 0.92) {
        for (let y = top - 6; y < top; y++) put(x, y, color);
        put(x - 1, top - 4, color);
        put(x + 1, top - 4, color);
      }
    }
  });

  ctx.putImageData(image, 0, 0);
  canvas.classList.add('is-ready');
  return true;
}

/** Paints now and again whenever the canvas is resized (debounced 150 ms). */
export function mountSunset(canvas: HTMLCanvasElement, options: SunsetOptions = {}): void {
  let timer: number | undefined;
  const paint = () => paintSunset(canvas, options);
  paint();
  new ResizeObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(paint, 150);
  }).observe(canvas);
}
