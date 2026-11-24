import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'server/index': 'server/index.ts',
    'server/cli': 'server/cli.ts',
  },
  unbundle: true,
  external: [/^node:/],
})
