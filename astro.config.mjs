// @ts-check
import { defineConfig } from 'astro/config';

// Static output, no client framework: the site ships HTML, CSS and two small scripts.
//
// Published on GitHub Pages as a project site: https://org-helix.github.io/helix-website/
// Internal links go through withBase() (src/lib/url.ts). With a custom domain,
// set `site` to that domain and `base` to '/'.
export default defineConfig({
  site: 'https://org-helix.github.io',
  base: '/helix-website',
  server: { port: 4321 },
});
