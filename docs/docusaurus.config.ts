import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'LOCIFY Docs',
  tagline: 'Documentación técnica y formativa del ecosistema de parqueaderos',
  favicon: 'img/favicon.ico',

  url: 'https://amospad.github.io',
  baseUrl: '/Locify/',

  organizationName: 'Amospad',
  projectName: 'Locify',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs', // Ruta para que la doc viva en /docs
          editUrl: 'https://github.com/Amospad/Locify/tree/main/docs/',
        },
        blog: false, // Desactivamos el blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'LOCIFY',
      logo: {
        alt: 'Locify Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'formativoSidebar',
          position: 'left',
          label: 'Formativo (SENA)',
        },
        {
          href: 'https://github.com/Amospad/Locify',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
        footer: {
      style: 'dark',
      links: [
        {
          title: 'Proyecto',
          items: [
            {
              label: 'Formativo (SENA)',
              to: '/docs/formativo/acta-constitucion',
            },
            {
              label: 'Técnico',
              to: '/docs/tecnico/arquitectura-hexagonal',
            },
          ],
          items: [
            {
              label: 'Formativo (SENA)',
              to: '/docs/formativo/acta-constitucion',
            },
            {
              label: 'Técnico',
              to: '/docs/tecnico/arquitectura-hexagonal',
            },
          ],
        },
        {
          title: 'Repositorio',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Amospad/Locify',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LOCIFY - SENA ADSO Ficha 3314811.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;