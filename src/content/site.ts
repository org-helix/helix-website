/**
 * All copy and links for the site live here. Components only render what this
 * file exports, so editing text never means touching markup.
 */

export type IconName =
  'accessibility' | 'hard-drive' | 'wifi-off' | 'folder-git' | 'message-circle' | 'users';

export const links = {
  organisation: 'https://github.com/org-helix',
  repositories: 'https://github.com/orgs/org-helix/repositories',
  contributing: 'https://github.com/org-helix/.github/issues',
} as const;

export const site = {
  name: 'Helix',
  title: 'Helix — public-good software, offline first',
  description:
    'Free, open source software for schools, clinics and the people they serve. Accessible, local-first and built to work offline.',
} as const;

export const nav = [
  { label: 'What we build', href: '#focus' },
  { label: 'Principles', href: '#principles' },
  { label: 'Who it’s for', href: '#audience' },
  { label: 'Get involved', href: '#community' },
] as const;

export const hero = {
  eyebrow: ['Open source', 'Offline first'],
  titleLine: 'Software for those',
  titleAccent: 'tech leaves behind.',
  lead: 'Helix builds public-good software for schools, clinics and the people they serve. Free, open source, and built to work offline first.',
  primary: { label: 'Browse repositories', href: links.repositories },
  secondary: { label: 'Start contributing', href: links.contributing },
  meta: ['Free', 'Open source', 'No tracking'],
} as const;

export const focus = {
  eyebrow: 'What we build',
  title: 'Three commitments, one purpose.',
  copy: 'Every Helix project starts from the constraints our users actually live with.',
  items: [
    {
      icon: 'accessibility',
      title: 'Accessibility',
      text: 'Tools that make software and information usable by people with disabilities.',
    },
    {
      icon: 'hard-drive',
      title: 'Local-first',
      text: 'Apps for schools and clinics that keep data on their own devices and under their own control.',
    },
    {
      icon: 'wifi-off',
      title: 'Low-bandwidth',
      text: 'Software that works offline, syncs when a connection appears, and runs on modest hardware.',
    },
  ],
} as const satisfies { items: readonly { icon: IconName; title: string; text: string }[] } & Record<
  string,
  unknown
>;

export const principles = {
  eyebrow: 'Principles',
  figure: '0',
  figureLabel: 'trackers, ads or lock-in.',
  title: 'Built for and with the communities that use it.',
  items: [
    { title: 'No tracking', text: 'Helix software does not watch the people who rely on it.' },
    { title: 'No ads', text: 'Nothing to sell, and nobody’s attention is the product.' },
    {
      title: 'No lock-in',
      text: 'Open source code that communities can inspect, adapt and keep running themselves.',
    },
  ],
} as const;

export const audience = {
  eyebrow: 'Who it’s for',
  title: 'Made for real constraints.',
  copy: 'Unreliable connections, shared devices and tight budgets are the starting point, not edge cases.',
  items: [
    {
      title: 'Schools',
      text: 'Software that runs on modest hardware and keeps records on the school’s own devices.',
      aside: 'Local-first',
    },
    {
      title: 'Clinics',
      text: 'Apps that keep working when the connection drops and sync when it comes back.',
      aside: 'Low-bandwidth',
    },
    {
      title: 'The people they serve',
      text: 'Information and tools that stay usable for people with disabilities.',
      aside: 'Accessibility',
    },
  ],
} as const;

export const community = {
  eyebrow: 'Get involved',
  title: 'Built in the open.',
  copy: 'Read the code, report what is missing, or pick up an issue. Every contribution is public.',
  cards: [
    {
      icon: 'folder-git',
      title: 'Repositories',
      text: 'Browse every Helix project and its source code.',
      href: links.repositories,
      accent: true,
    },
    {
      icon: 'message-circle',
      title: 'Contributing',
      text: 'Open an issue, suggest an idea or offer your help.',
      href: links.contributing,
      accent: false,
    },
    {
      icon: 'users',
      title: 'Organisation',
      text: 'Follow Helix on GitHub to see what ships next.',
      href: links.organisation,
      accent: false,
    },
  ],
} as const satisfies {
  cards: readonly { icon: IconName; title: string; text: string; href: string; accent: boolean }[];
} & Record<string, unknown>;

export const footer = {
  statement: 'Free and open source.',
  columns: [
    {
      title: 'Who makes it',
      text: 'Helix is built in the open by its contributors, for and with the communities that use it.',
    },
    {
      title: 'Licences',
      text: 'Helix software is free and open source. Each repository states its own licence.',
    },
    {
      title: 'Privacy',
      text: 'This website sets no cookies, loads no third-party scripts and runs no analytics.',
    },
  ],
  bottom: 'Made with care.',
} as const;
