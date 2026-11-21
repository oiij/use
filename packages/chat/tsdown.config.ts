import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'server/index': 'server/index.ts',
    'server/sqlite': 'server/sqlite.ts',
    'server/cli': 'server/cli.ts',
  },
  format: ['esm'],
  // Node 内置模块与运行时依赖不打包进产物，由使用方安装
  external: [/^node:/],
})
