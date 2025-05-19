import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { name } from './package.json'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/vite.ts'),
      name,
      fileName: 'vite',
      cssFileName: 'vite',
      formats: [
        'es',
        'umd',
        'cjs',
      ],
    },
    rollupOptions: {
      external: [

      ],
      output: {
        globals: {

        },
      },
    },
  },
  plugins: [
    vue(),
    dts({
      include: ['src/vite.ts'],
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
})
