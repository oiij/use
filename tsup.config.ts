import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'tsup'
import { peerDependencies } from './package.json'

const paths = readdirSync(resolve(__dirname, 'src/addons')).filter(f => f.endsWith('.ts')).map(m => `src/addons/${m}`)

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/class.ts',
    ...paths,
  ],
  clean: true,
  format: ['cjs', 'esm'],
  external: [...Object.keys(peerDependencies)],
  dts: true,
  minify: false,
})
