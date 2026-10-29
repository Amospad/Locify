import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'LOCIFY Docs',
  tagline: 'Documentación técnica y formativa del ecosistema de parqueaderos',
  favicon: 'img/favicon.ico',

  // Set oficial de favicon (marca «Vía libre», ver static/img/brand/especificacion-logo.md).
  // El .ico cubre navegadores clásicos; el resto se declara aquí para Android/iOS/PWA.
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/img/favicon-16.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon-32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/img/android-chrome-192.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        href: '/img/android-chrome-512.png',
      },
    },
  ],

  url: 'https://locify-wheat.vercel.app',
  baseUrl: '/',

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
          routeBasePath: 'docs',
          editUrl: 'https://github.com/Amospad/Locify/tree/main/docs/',
        },
        blog: false,
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
    image: 'img/social-card.png',
    navbar: {
      // El lockup ya incluye el wordmark LOCIFY (Poppins delineada): sin título de texto
      // para no duplicar el nombre. En modo oscuro se usa el reverse (blanco) porque el
      // wordmark grafito del full-color desaparecería sobre el navbar oscuro (spec §5.4).
      logo: {
        alt: 'LOCIFY — celda con puerta abierta y tick verde de disponibilidad confirmada',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'formativoSidebar',
          position: 'left',
          label: 'Formativo (SENA)',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tecnicoSidebar',
          position: 'left',
          label: 'Técnico',
        },
        {
          type: 'docSidebar',
          sidebarId: 'gestionSidebar', // <-- Nuevo menú de Gestión
          position: 'left',
          label: 'Gestión',
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
              to: '/docs/formativo/formulacion-constitucion',
            },
            {
              label: 'Técnico',
              to: '/docs/tecnico/arquitectura-hexagonal',
            },
            {
              label: 'Gestión',
              to: '/docs/gestion/gestion-interesados-proyecto',
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