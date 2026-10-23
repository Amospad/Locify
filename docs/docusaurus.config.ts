import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'LOCIFY Docs',
  tagline: 'Documentación técnica y formativa del ecosistema de parqueaderos',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://amospad.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/Locify/',

  // GitHub pages deployment config.
  organizationName: 'Amospad', // Usually your GitHub org/user name.
  projectName: 'Locify', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          // Please change this to your repo.
          editUrl:
            'https://github.com/Amospad/Locify/tree/main/docs/',
        },
        blog: false, // Desactivamos el blog, no lo necesitamos
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
    // Replace with your project's social card
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
              to: '/docs/formativo/01-acta-constitucion',
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