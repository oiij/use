import type { EditableTreeNode } from 'vue-router/unplugin'

/**
 * 为路由添加元数据
 *
 * 从路由路径中提取排序编号（例如：01_home -> sort: 1）
 * 并规范化路由名称（移除数字前缀）
 *
 * @param route - 可编辑的路由树节点
 *
 * @example
 * ```ts
 * // 路径: 01_home
 * // 结果: { sort: 1, name: '/home', path: '/home' }
 * ```
 */
export function appendRouterMeta(route: EditableTreeNode) {
  const reg = /(\d+)[_-]/g
  const sort = route.path.match(/(\d+)[_-]/)?.[1]
  if (sort) {
    route.addToMeta({ sort: Number(sort) })
  }
  route.path = route.path.replace(reg, '')
  if (route.name) {
    route.name = route.name.replace(reg, '')
  }
}
