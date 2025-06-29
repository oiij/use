import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'

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
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Core',
        items: [
          {
            text: 'Composables',
            items: [
              { text: 'useAutoRatio', link: '/examples/core/composables/use-auto-ratio' },
              { text: 'useContextMenu', link: '/examples/core/composables/use-context-menu' },
              { text: 'useEventSource', link: '/examples/core/composables/use-event-source' },
              { text: 'useImageVerify', link: '/examples/core/composables/use-image-verify' },
              { text: 'useNumberAnimation', link: '/examples/core/composables/use-number-animation' },
              { text: 'useScanCode', link: '/examples/core/composables/use-scan-code' },
              { text: 'useScrollView', link: '/examples/core/composables/use-scroll-view' },
              { text: 'useTypeWriter', link: '/examples/core/composables/use-type-writer' },
              { text: 'useViewTransition', link: '/examples/core/composables/use-view-transition' },
              { text: 'useWebRTC', link: '/examples/core/composables/use-web-rtc' },
              { text: 'useWebSocket', link: '/examples/core/composables/use-web-socket' },
            ],
          },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'ChromeTabs', link: '/examples/components/chrome-tabs' },
        ],
      },
      {
        text: 'directives',
        link: '/examples/directives/directives',
      },
      {
        text: 'NaiveUI',
        items: [
          {
            text: 'Composables',
            items: [
              { text: 'useNaiveForm', link: '/examples/naive-ui/composables/use-naive-form' },
              { text: 'useNaiveTheme', link: '/examples/naive-ui/composables/use-naive-theme' },
            ],
          },
          {
            text: 'Components',
            items: [
              { text: 'Bubble', link: '/examples/naive-ui/components/bubble' },
              { text: 'ConfigProviders', link: '/examples/naive-ui/components/config-providers' },
              { text: 'CopyButton', link: '/examples/naive-ui/components/copy-button' },
              { text: 'DataTablePlus', link: '/examples/naive-ui/components/data-table-plus' },
              { text: 'SearchInput', link: '/examples/naive-ui/components/search-input' },
              { text: 'ToggleEditor', link: '/examples/naive-ui/components/toggle-editor' },
              { text: 'TooltipButton', link: '/examples/naive-ui/components/tooltip-button' },
              { text: 'TypeWriter', link: '/examples/naive-ui/components/type-writer' },
            ],
          },

        ],
      },
      {
        text: 'addons',
        items: [
          { text: 'ai-editor', link: '/examples/addons/ai-editor' },
          { text: 'css-render', link: '/examples/addons/css-render' },
          { text: 'e-charts', link: '/examples/addons/e-charts' },
          { text: 'emoji-picker', link: '/examples/addons/emoji-picker' },
          { text: 'js-pdf', link: '/examples/addons/js-pdf' },
          { text: 'markdown-it', link: '/examples/addons/markdown-it' },
          { text: 'shiki', link: '/examples/addons/shiki' },
          { text: 'three-js', link: '/examples/addons/three-js' },
          { text: 'three-js-plugin-postprocessing', link: '/examples/addons/three-js-plugin-postprocessing' },
          { text: 'three-js-plugin-tween', link: '/examples/addons/three-js-plugin-tween' },
          { text: 'tiptap', link: '/examples/addons/tiptap' },
          { text: 'v-charts', link: '/examples/addons/v-charts' },
          { text: 'xlsx', link: '/examples/addons/xlsx' },
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
