import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/array.ts',
    'src/color.ts',
    'src/date.ts',
    'src/dom.ts',
    'src/is.ts',
    'src/math.ts',
    'src/number.ts',
    'src/object.ts',
    'src/random.ts',
    'src/string.ts',
  ],
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
  unbundle: true,
})
