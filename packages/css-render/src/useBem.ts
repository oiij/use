import type { CNode, CssRenderInstance } from 'css-render'
import { plugin as BemPlugin } from '@css-render/plugin-bem'
import { CssRender } from 'css-render'

/**
 * CSS Render BEM 插件类型
 */
export type CssRenderBemPlugin = ReturnType<typeof BemPlugin> & {
  __?: 'css-render-bem' // 解决类型报错 error TS4023: Exported variable 'plugin' has or is using name 'CssRenderBemPlugin' from external module "C:/Users/PC/Desktop/Develop/Projects/use/node_modules/.pnpm/@css-render+plugin-bem@0.15.14_css-render@0.15.14/node_modules/@css-render/plugin-bem/lib/index" but cannot be named.
}

export { CNode, CssRenderInstance }

/**
 * BEM 选项类型
 */
export type BemOptions = {
  /**
   * 命名空间
   */
  namespace?: string
  /**
   * 块前缀
   */
  blockPrefix?: string
  /**
   * 元素前缀
   */
  elementPrefix?: string
  /**
   * 修饰符前缀
   */
  modifierPrefix?: string
}

/**
 * 使用 BEM 返回值类型
 */
export type UseBemReturn = {
  /**
   * 命名空间
   */
  namespace: string
  /**
   * 块前缀
   */
  blockPrefix: string
  /**
   * 元素前缀
   */
  elementPrefix: string
  /**
   * 修饰符前缀
   */
  modifierPrefix: string
  /**
   * CSS Render 实例
   */
  cssr: CssRenderInstance
  /**
   * BEM 插件
   */
  plugin: CssRenderBemPlugin
}

/**
 * 使用 BEM
 *
 * @param options - BEM 选项
 * @returns BEM 工具对象
 *
 * @example
 * ```ts
 * import { useBem } from '@oiij/css-render'
 *
 * const { cssr, plugin } = useBem({
 *   namespace: 'o',
 *   blockPrefix: '.o-',
 *   elementPrefix: '__',
 *   modifierPrefix: '--',
 * })
 * ```
 */
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
