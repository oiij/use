import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/class.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
  unbundle: true,
})
