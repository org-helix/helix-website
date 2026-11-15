import { describe, expect, it } from 'vitest';
import { composite, contrastRatio, luminance, parseColor } from '../../src/lib/color';

describe('parseColor', () => {
  it('parses 6-digit and 3-digit hex', () => {
    expect(parseColor('#B24E30')).toEqual([178, 78, 48, 1]);
    expect(parseColor('#fff')).toEqual([255, 255, 255, 1]);
  });

  it('parses rgb() and rgba()', () => {
    expect(parseColor('rgb(250, 246, 237)')).toEqual([250, 246, 237, 1]);
    expect(parseColor('rgba(50, 41, 33, 0.7)')).toEqual([50, 41, 33, 0.7]);
  });

  it('returns null for anything that is not a plain colour', () => {
    expect(parseColor('')).toBeNull();
    expect(parseColor('var(--x)')).toBeNull();
    expect(parseColor('#12')).toBeNull();
    expect(parseColor('rgb(1, 2)')).toBeNull();
    expect(parseColor('rgb(a, b, c)')).toBeNull();
  });
});

describe('contrast', () => {
  const black = [0, 0, 0, 1] as const;
  const white = [255, 255, 255, 1] as const;

  it('computes luminance at both extremes', () => {
    expect(luminance(black)).toBe(0);
    expect(luminance(white)).toBeCloseTo(1, 5);
  });

  it('gives 21:1 for black on white, in either order', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5);
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5);
  });

  it('gives 1:1 for identical colours', () => {
    expect(contrastRatio(white, white)).toBe(1);
  });

  it('composites a translucent foreground before measuring', () => {
    expect(composite([0, 0, 0, 0.5], white)).toEqual([127.5, 127.5, 127.5, 1]);
    expect(contrastRatio([0, 0, 0, 0], white)).toBe(1);
  });
});
