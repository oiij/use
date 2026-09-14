import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/components.ts',
  ],
  platform: 'neutral',
  plugins: [
    Vue({ isProduction: true }),
  ],
  dts: { vue: true },
  unbundle: false,
})
