import type { CNode, CssRenderInstance } from 'css-render'
import { plugin as BemPlugin } from '@css-render/plugin-bem'
import { CssRender } from 'css-render'

export type CssRenderBemPlugin = ReturnType<typeof BemPlugin> & {
  __?: 'css-render-bem' // 解决类型报错 error TS4023: Exported variable 'plugin' has or is using name 'CssRenderBemPlugin' from external module "C:/Users/PC/Desktop/Develop/Projects/use/node_modules/.pnpm/@css-render+plugin-bem@0.15.14_css-render@0.15.14/node_modules/@css-render/plugin-bem/lib/index" but cannot be named.
}
export { CNode, CssRenderInstance }
export interface BemOptions {
  namespace?: string
  blockPrefix?: string
  elementPrefix?: string
  modifierPrefix?: string
}
export interface UseBemReturn {
  namespace: string
  blockPrefix: string
  elementPrefix: string
  modifierPrefix: string
  cssr: CssRenderInstance
  plugin: CssRenderBemPlugin
}
export function useBem(options?: BemOptions): UseBemReturn {
  const { namespace = 'n', blockPrefix = `.${namespace}-`, elementPrefix = '__', modifierPrefix = '--' } = options ?? {}
  const cssr = CssRender()
  const plugin = BemPlugin({
    blockPrefix,
    elementPrefix,
    modifierPrefix,
  })
  cssr.use(plugin)

  return {
    namespace,
    blockPrefix,
    elementPrefix,
    modifierPrefix,
    cssr,
    plugin,
  }
}
