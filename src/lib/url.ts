/**
 * Builds an internal URL that respects the site's base path (see `base` in astro.config.mjs).
 * On GitHub Pages the site lives under /helix-website/, so a bare "/" would leave the site.
 *
 *   withBase('')            → '/helix-website/'
 *   withBase('favicon.svg') → '/helix-website/favicon.svg'
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
