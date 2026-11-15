import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseColor, type RGBA } from '../../src/lib/color';

const read = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../../src/styles/${path}`, import.meta.url)), 'utf8');

/** Custom properties as the browser sees them: Dusk tokens first, Helix theme on top. */
export function loadTokens(): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const css of [read('dusk/tokens.css'), read('theme.css')]) {
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of withoutComments.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      const [, name, value] = match;
      if (name && value) tokens.set(name, value.trim().replace(/\s+/g, ' '));
    }
  }
  return tokens;
}

/** Follows `var(--x)` references down to a colour. Throws when the token is not a plain colour. */
export function resolveColor(tokens: Map<string, string>, name: string): RGBA {
  let value = tokens.get(name);
  for (let depth = 0; value && depth < 10; depth++) {
    const reference = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
    if (!reference) break;
    value = tokens.get(reference);
  }
  const color = value ? parseColor(value) : null;
  if (!color) throw new Error(`Token ${name} does not resolve to a colour (got "${value}")`);
  return color;
}
