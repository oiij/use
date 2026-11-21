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
export type UseBemReturn = CssRenderInstance & CssRenderBemPlugin & {
  /**
   * 块名称生成函数
   */
  nB: (name: string) => string
  /**
   * 元素名称生成函数
   */
  nE: (name: string) => string
  /**
   * 修饰符名称生成函数
   */
  nM: (name: string) => string
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
 * const { c, cB, cE, cM } = useBem({
 *   blockPrefix: '.o-',
 *   elementPrefix: '__',
 *   modifierPrefix: '--',
 * })
 * ```
 */
export function useBem(options?: BemOptions): UseBemReturn {
  const { blockPrefix = '.n-', elementPrefix = '__', modifierPrefix = '--' } = options ?? {}
  const cssr = CssRender()
  const plugin = BemPlugin({
    blockPrefix,
    elementPrefix,
    modifierPrefix,
  })
  cssr.use(plugin)

  return {
    ...cssr,
    ...plugin,
    nB: (name: string) => `${blockPrefix.replace('.', '')}${name}`,
    nE: (name: string) => `${elementPrefix}${name}`,
    nM: (name: string) => `${modifierPrefix}${name}`,
  }
}
