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
  // 从路径中提取数字前缀作为排序值
  const sortMatch = route.path.match(/(\d+)_/)
  const sortNum = sortMatch ? Number(sortMatch[1]) : null

  // 只在有效时添加 sort 元数据
  if (sortNum !== null && !Number.isNaN(sortNum)) {
    route.addToMeta({ sort: sortNum })
  }

  // 规范化路由名称
  if (route.name) {
    const newName = route.name.replace(/\d+_/g, '')
    route.name = newName.startsWith('/') ? newName : `/${newName}`

    // 同步更新路径（除了根路径）
    if (route.path !== '') {
      route.path = route.name
    }
  }
}
