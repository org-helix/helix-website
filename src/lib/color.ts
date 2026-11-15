/** Small WCAG colour helpers, used by the illustration and the theme contrast tests. */

export type RGBA = readonly [r: number, g: number, b: number, a: number];

/** Parses `#rgb`, `#rrggbb`, `rgb(…)` and `rgba(…)`. Returns null for anything else. */
export function parseColor(input: string): RGBA | null {
  const value = input.trim().toLowerCase();

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(value)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
    const channel = (i: number) => parseInt(full.slice(i, i + 2), 16);
    return [channel(0), channel(2), channel(4), 1];
  }

  const fn = /^rgba?\(([^)]+)\)$/.exec(value)?.[1];
  if (fn) {
    const parts = fn
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    const [r, g, b, a = 1] = parts;
    if (r === undefined || g === undefined || b === undefined || parts.some(Number.isNaN)) {
      return null;
    }
    return [r, g, b, a];
  }

  return null;
}

/** Flattens a (possibly translucent) foreground onto an opaque background. */
export function composite(fg: RGBA, bg: RGBA): RGBA {
  const [r, g, b, a] = fg;
  const mix = (top: number, bottom: number) => top * a + bottom * (1 - a);
  return [mix(r, bg[0]), mix(g, bg[1]), mix(b, bg[2]), 1];
}

/** WCAG 2.x relative luminance of an opaque colour. */
export function luminance([r, g, b]: RGBA): number {
  const linear = (channel: number) => {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** WCAG contrast ratio (1–21). A translucent foreground is composited on the background first. */
export function contrastRatio(fg: RGBA, bg: RGBA): number {
  const a = luminance(composite(fg, bg));
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
