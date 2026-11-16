import { describe, expect, it } from 'vitest';
import {
  audience,
  community,
  focus,
  footer,
  hero,
  links,
  nav,
  principles,
  projects,
  site,
} from '../../src/content/site';

describe('site content', () => {
  it('has a title and a description sized for search results', () => {
    expect(site.title.length).toBeLessThanOrEqual(60);
    expect(site.description.length).toBeGreaterThanOrEqual(50);
    expect(site.description.length).toBeLessThanOrEqual(160);
  });

  it('only links out over https, to the Helix organisation', () => {
    for (const url of Object.values(links)) {
      expect(url).toMatch(/^https:\/\/github\.com\/(orgs\/)?org-helix(\/|$)/);
    }
  });

  it('points every nav entry at a section anchor', () => {
    for (const item of nav) expect(item.href).toMatch(/^#[a-z-]+$/);
    expect(new Set(nav.map((item) => item.href)).size).toBe(nav.length);
  });

  it('follows the design-system rules for a hero', () => {
    expect(hero.primary.href).not.toBe(hero.secondary.href);
    expect(hero.titleLine.length).toBeLessThanOrEqual(24);
    expect(hero.titleAccent.length).toBeLessThanOrEqual(24);
  });

  it('shows at most one accent card per row', () => {
    expect(community.cards.filter((card) => card.accent)).toHaveLength(1);
  });

  it('has no empty copy', () => {
    const texts = [
      ...focus.items.flatMap((item) => [item.title, item.text]),
      projects.netlix.tagline,
      projects.netlix.text,
      projects.netlix.image.alt,
      projects.netlix.image.caption,
      projects.netlix.installNote,
      ...projects.netlix.downloads.flatMap((d) => [d.system, d.kind, d.detail]),
      ...projects.netlix.features.flatMap((item) => [item.title, item.text]),
      ...principles.items.flatMap((item) => [item.title, item.text]),
      ...audience.items.flatMap((item) => [item.title, item.text, item.aside]),
      ...community.cards.flatMap((card) => [card.title, card.text]),
      ...footer.columns.flatMap((column) => [column.title, column.text]),
    ];
    for (const text of texts) expect(text.trim()).not.toBe('');
  });

  it('names a released netlix version and links to its repository', () => {
    expect(projects.netlix.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(projects.netlix.source.href).toBe(links.netlix);
  });

  it('offers one netlix download per system, from the latest release', () => {
    const systems = projects.netlix.downloads.map((d) => d.system);
    expect(systems).toEqual([...projects.netlix.platforms]);
    for (const d of projects.netlix.downloads) {
      // No version in the file name: the link must keep working after each release.
      expect(d.href).toMatch(
        /^https:\/\/github\.com\/org-helix\/netlix\/releases\/latest\/download\/netlix-[a-z]+[-.][A-Za-z.-]+$/,
      );
      expect(d.href).not.toMatch(/\d+\.\d+/);
    }
  });
});
