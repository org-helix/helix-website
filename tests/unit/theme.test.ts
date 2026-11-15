import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { composite, contrastRatio } from '../../src/lib/color';
import { loadTokens, resolveColor } from './tokens';

const tokens = loadTokens();
const color = (name: string) => resolveColor(tokens, name);

describe('brand palette', () => {
  it.each([
    ['--color-helix-red', '#b24e30'],
    ['--color-helix-pale-amber', '#faf6ed'],
    ['--color-helix-paper-white', '#ffffff'],
    ['--color-helix-dusty-orange', '#635242'],
    ['--color-helix-stone-gray', '#918f89'],
    ['--color-helix-pale-orange', '#ecd3cb'],
    ['--color-helix-ink', '#322921'],
    ['--color-helix-rust', '#863b24'],
    ['--color-helix-blush', '#dcafa2'],
  ])('%s is %s', (name, hex) => {
    expect(tokens.get(name)).toBe(hex);
  });
});

describe('contrast (WCAG 2.2 AA)', () => {
  // [foreground, background, minimum ratio] — 4.5 for text, 3 for UI shapes and focus rings.
  const pairs: [fg: string, bg: string, min: number][] = [
    ['--text-heading', '--bg-canvas', 4.5],
    ['--text-strong', '--bg-canvas', 4.5],
    ['--text-body', '--bg-canvas', 4.5],
    ['--text-secondary', '--bg-canvas', 4.5],
    ['--text-muted', '--bg-canvas', 4.5],
    ['--text-subtle', '--bg-canvas', 4.5],
    ['--text-link', '--bg-canvas', 4.5],
    ['--text-link-hover', '--bg-canvas', 4.5],
    // gradient text: both ends of the gradient must hold on the canvas
    ['--color-helix-rust', '--bg-canvas', 4.5],
    ['--color-helix-red', '--bg-canvas', 4.5],
    // cards
    ['--text-heading', '--surface-card', 4.5],
    ['--text-muted', '--surface-card', 4.5],
    ['--text-heading', '--surface-card-hover', 4.5],
    ['--text-muted', '--surface-card-hover', 4.5],
    // accent surfaces (primary button, accent card)
    ['--text-on-accent', '--accent-primary', 4.5],
    ['--text-on-accent', '--accent-primary-hover', 4.5],
    // inverse panel
    ['--text-on-inverse', '--surface-inverse', 4.5],
    ['--text-on-inverse-muted', '--surface-inverse', 4.5],
    // non-text
    ['--accent-primary', '--bg-canvas', 3],
    ['--accent-focus-ring', '--bg-canvas', 3],
    ['--accent-focus-ring', '--surface-card', 3],
  ];

  it.each(pairs)('%s on %s is at least %d:1', (fg, bg, min) => {
    expect(contrastRatio(color(fg), color(bg))).toBeGreaterThanOrEqual(min);
  });

  it('keeps button labels readable on translucent neutral fills', () => {
    const canvas = color('--bg-canvas');
    for (const fill of ['--fill-neutral', '--fill-neutral-hover']) {
      const surface = composite(color(fill), canvas);
      expect(contrastRatio(color('--text-heading'), surface)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('documents that Stone Gray is decorative only', () => {
    // If this ever passes AA, --text-decorative can be promoted to real text.
    expect(contrastRatio(color('--text-decorative'), color('--bg-canvas'))).toBeLessThan(4.5);
  });
});

describe('design-system discipline', () => {
  const src = fileURLToPath(new URL('../../src', import.meta.url));
  // The two token files define colours; lib/color.ts is the parser that names the syntaxes.
  const colourSources = ['styles/theme.css', 'styles/dusk/tokens.css', 'lib/color.ts'];

  const files = (readdirSync(src, { recursive: true }) as string[])
    .map((file) => file.replaceAll('\\', '/'))
    .filter((file) => /\.(astro|css|ts)$/.test(file) && !colourSources.includes(file));

  it('finds source files to check', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files)('%s has no hard-coded colour', (file) => {
    const content = readFileSync(join(src, file), 'utf8');
    const hits = content.match(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/gi) ?? [];
    expect(hits, `use a token from ${relative(src, join(src, 'styles/theme.css'))}`).toEqual([]);
  });
});
