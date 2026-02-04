import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'
import { conversionPath } from './util'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@OIIJ/USE',
  description: 'Some Composables And Utils Functions for VUE.',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
    ['meta', {
      name: 'keywords',
      content: 'Some Composables And Utils Functions for VUE.',
    }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.svg', sizes: '192x192' }],
  ],
  rewrites: {
    // 'packages/core/demos/use-audio-context.md': 'core/use-audio-context.md',
    'docs/index.md': 'index.md',
    'docs/install.md': 'install.md',
    'docs/examples.md': 'examples.md',
    'packages/:pkg/demos/:name': ':pkg/:name',
  },
  srcExclude: [
    '**/README.md',
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples' },
    ],
    sidebar: [
      {
        text: 'Core',
        items: [
          ...conversionPath('packages/core/demos', 'core'),
        ],
      },
      {
        text: 'NaiveUI',
        items: [
          ...conversionPath('packages/naive-ui/demos', 'naive-ui'),
        ],
      },
      {
        text: 'ChromeTabs',
        items: [
          ...conversionPath('packages/chrome-tabs/demos', 'chrome-tabs'),
        ],
      },
      {
        text: 'directives',
        items: [
          ...conversionPath('packages/directives/demos', 'directives'),
        ],
      },
      {
        text: 'addons',
        items: [
          ...conversionPath('packages/ai-editor/demos', 'ai-editor'),
          ...conversionPath('packages/css-render/demos', 'css-render'),
          ...conversionPath('packages/e-charts/demos', 'e-charts'),
          ...conversionPath('packages/emoji-picker/demos', 'emoji-picker'),
          ...conversionPath('packages/js-pdf/demos', 'js-pdf'),
          ...conversionPath('packages/markdown-it/demos', 'markdown-it'),
          ...conversionPath('packages/ogl/demos', 'ogl'),
          ...conversionPath('packages/shiki/demos', 'shiki'),
          ...conversionPath('packages/three-js/demos', 'three-js'),
          ...conversionPath('packages/tiptap/demos', 'tiptap'),
          ...conversionPath('packages/v-charts/demos', 'v-charts'),
          ...conversionPath('packages/xlsx/demos', 'xlsx'),
        ],
      },

    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/oiij/use' },
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
        '~': resolve(__dirname, '../../packages'),
      },
    },
    ssr: {
      noExternal: ['naive-ui', 'vueuc'],
    },
  },
})
