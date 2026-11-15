// @ts-check
import { defineConfig } from 'astro/config';

// Static output, no client framework: the site ships HTML, CSS and two small scripts.
export default defineConfig({
  server: { port: 4321 },
});
