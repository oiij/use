import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts', './src/class.ts'],
  clean: true,
  format: ['cjs', 'esm'],
  external: ['vue', '@vueuse/core', 'lodash-es'],
  dts: true,
  minify: false,
})
