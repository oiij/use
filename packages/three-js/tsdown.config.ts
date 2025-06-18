import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/plugins/index.ts', './src/utils/index.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
  unbundle: true,
})
