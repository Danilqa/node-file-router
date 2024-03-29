// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Node File Router',
  tagline: '',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: process.env.URL || 'https://danilqa.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.BASE_URL || '/node-file-router/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Danilqa', // Usually your GitHub org/user name.
  projectName: 'node-file-router', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  plugins: ['docusaurus-plugin-sass'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/'
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: 'ZLU9sqEwKnQIldUB0bpRADb2OB31xASUYC7DF9COEQ0'
      }
    }
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: '5ILYN8FF1K',
        apiKey: '15c2c198de52656aca0e9d7de860668e',
        indexName: 'node-file-router-js',
        contextualSearch: false,
      },
      colorMode: {
        disableSwitch: true,
        defaultMode: 'dark'
      },
      metadata: [
        { name: 'keywords', content: 'node, node.js, file router, node file router, express-file-routing' },
        { name: 'og:title', content: 'Node File Router' },
        { name: 'og:site_name', content: 'Node File Router' }
      ],
      navbar: {
        title: 'Node File Router',
        logo: {
          alt: 'Node File Router Logo',
          src: 'img/logo.png'
        },
        items: [
          {
            to: 'docs/getting-started',
            position: 'left',
            label: 'Getting Started'
          },
          {
            to: 'docs/usage-guide',
            position: 'left',
            label: 'Usage Guide'
          },
          {
            to: 'docs/route-matching',
            position: 'left',
            label: 'Route Matching'
          },
          {
            to: 'docs/custom-adapter',
            position: 'left',
            label: 'Custom Adapter'
          },
          {
            to: 'docs/middlewares',
            position: 'left',
            label: 'Middlewares'
          },
          {
            href: 'https://github.com/danilqa/node-file-router',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        copyright: `© ${new Date().getFullYear()} Daniil Sitdikov`
      },
      announcementBar: {
        id: 'support_us',
        content:
          '⭐️ Support the project by giving it a star on <a href="https://github.com/Danilqa/node-file-router" target="_blank">Github</a>',
        backgroundColor: 'rgb(131, 58, 180)',
        textColor: '#fff',
        isCloseable: false
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula
      }
    })
};

module.exports = config;
