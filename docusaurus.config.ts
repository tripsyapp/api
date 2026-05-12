import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Tripsy Public API',
  tagline: 'Build integrations with Tripsy trips, itinerary items, documents, and account data.',
  favicon: 'img/logo.svg',

  url: 'https://docs.api.tripsy.app',
  baseUrl: '/',

  organizationName: 'tripsyapp',
  projectName: 'api',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/tripsyapp/api/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Tripsy API',
      logo: {
        alt: 'Tripsy API',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://api.tripsy.app',
          label: 'API',
          position: 'right',
        },
        {
          href: 'https://github.com/tripsyapp/api',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Tripsy',
          items: [
            {
              label: 'Website',
              href: 'https://tripsy.app',
            },
            {
              label: 'API',
              href: 'https://api.tripsy.app',
            },
          ],
        },
        {
          title: 'Docs',
          items: [
            {
              label: 'Authentication',
              to: '/authentication',
            },
            {
              label: 'Trips',
              to: '/trips',
            },
            {
              label: 'Storage uploads',
              to: '/storage-uploads',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tripsy.`,
    },
    prism: {
      additionalLanguages: ['bash', 'http', 'json'],
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
