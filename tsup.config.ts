import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'tsup'
import { peerDependencies } from './package.json'

const paths = readdirSync(resolve(__dirname, 'src')).filter(f => f.endsWith('.ts')).map(m => `./src/${m}`)

export default defineConfig({
  entry: paths,
  clean: true,
  format: ['cjs', 'esm'],
  external: [...Object.keys(peerDependencies)],
  dts: true,
  minify: false,
  async onSuccess() {
    console.log('success')
  },
})
