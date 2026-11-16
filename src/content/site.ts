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
  netlix: 'https://github.com/org-helix/netlix',
  netlixReleases: 'https://github.com/org-helix/netlix/releases/latest',
  // Release files have no version in their name, so this always serves the newest.
  netlixFiles: 'https://github.com/org-helix/netlix/releases/latest/download',
  netlixInstallHelp: 'https://github.com/org-helix/netlix#download',
} as const;

export const site = {
  name: 'Helix',
  title: 'Helix — public-good software, offline first',
  description:
    'Free, open source software for schools, clinics and the people they serve. Accessible, local-first and built to work offline.',
} as const;

export const nav = [
  { label: 'What we build', href: '#focus' },
  { label: 'Projects', href: '#projects' },
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

export const projects = {
  eyebrow: 'Projects',
  title: 'First out: a network lab for the classroom.',
  copy: 'Each Helix project follows the same rules: free, runs offline, no account. Here is the first one.',
  netlix: {
    name: 'netlix',
    // Update with each release (see github.com/org-helix/netlix/releases).
    version: '0.3.0',
    tagline: 'Learn networking without a licence or an account.',
    text: 'A network simulator in the spirit of Packet Tracer. Place PCs, switches and routers, give them addresses, then send a ping and watch every frame cross the cables.',
    platforms: ['Windows', 'macOS', 'Linux'],
    downloadsLabel: 'Download, one file per system',
    downloads: [
      {
        system: 'Windows',
        kind: 'Installer',
        detail: 'Windows 10 and 11',
        href: `${links.netlixFiles}/netlix-windows-setup.exe`,
      },
      {
        system: 'macOS',
        kind: 'Disk image',
        detail: 'macOS 11 or later, Apple Silicon and Intel',
        href: `${links.netlixFiles}/netlix-macos.dmg`,
      },
      {
        system: 'Linux',
        kind: 'AppImage',
        detail: 'Most x86-64 distributions',
        href: `${links.netlixFiles}/netlix-linux.AppImage`,
      },
    ],
    installNote: 'Not code-signed yet, so Windows and macOS ask for confirmation the first time.',
    installHelp: { label: 'How to install', href: links.netlixInstallHelp },
    source: { label: 'Read the source', href: links.netlix },
    image: {
      alt: 'netlix with its office example: two PCs and a server on two switches, a router in the middle and an Internet cloud above it, with the ping bar below.',
      caption:
        'netlix in French. On first launch you choose French or English, and a dark or light theme.',
    },
    features: [
      {
        title: 'Every frame, explained',
        text: 'ARP, switching and routing are simulated frame by frame, and the log says why each frame was sent.',
      },
      {
        title: 'Step by step',
        text: 'Stop after each step to see the frames on the wire, what each device did, and its ARP cache or MAC table.',
      },
      {
        title: 'Clear errors',
        text: 'A failed ping says why: missing gateway, no route, no ARP reply, expired TTL or a broadcast storm.',
      },
      {
        title: 'Installs in a minute',
        text: 'A native app for Windows, macOS and Linux, from a single file. No sign-in, no connection needed.',
      },
    ],
  },
} as const;

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
