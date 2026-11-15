import { describe, expect, it } from 'vitest';
import { withBase } from '../../src/lib/url';

describe('withBase', () => {
  it('prefixes paths with a sub-path base, with or without slashes', () => {
    expect(withBase('', '/helix-website')).toBe('/helix-website/');
    expect(withBase('', '/helix-website/')).toBe('/helix-website/');
    expect(withBase('favicon.svg', '/helix-website')).toBe('/helix-website/favicon.svg');
    expect(withBase('/favicon.svg', '/helix-website/')).toBe('/helix-website/favicon.svg');
  });

  it('works with a root base, as on a custom domain', () => {
    expect(withBase('', '/')).toBe('/');
    expect(withBase('favicon.svg', '/')).toBe('/favicon.svg');
  });
});
