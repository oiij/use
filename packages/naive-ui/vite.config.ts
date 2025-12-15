import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { name } from './package.json'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/components.ts'),
      name,
      fileName: 'components',
      cssFileName: 'style',
      formats: [
        'es',
      ],
    },
    rollupOptions: {
      external: [
        'vue',
        'naive-ui',
        '@vueuse/core',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          'naive-ui': 'NaiveUI',
          '@vueuse/core': 'VueUseCore',
        },
      },
    },
  },
  plugins: [
    vue(),
    dts({
      include: ['src/components.ts', 'src/components'],
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
})
