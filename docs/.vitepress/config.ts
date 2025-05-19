import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'TS Starter',
  description: 'TS Starter is a starter project for TypeScript projects.',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
    ['meta', {
      name: 'keywords',
      content: 'TS Starter is a starter project for TypeScript projects.',
    }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.svg', sizes: '192x192' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/started' },
    ],

    sidebar: [
      {
        text: 'Started',
        items: [
          { text: 'install', link: '/started' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/oiij/ts-starter' },
    ],
  },
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin)
    },
  },
  vite: {
    resolve: {
      alias: {
        '~': resolve(__dirname, '../../src'),
      },
    },
  },
})
