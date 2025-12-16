import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  platform: 'neutral',
  plugins: [Vue({ isProduction: true })],
  dts: { vue: true },
  unbundle: true,
})
