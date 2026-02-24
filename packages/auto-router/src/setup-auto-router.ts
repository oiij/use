import type { Router, RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'es-toolkit'
import { computed, ref } from 'vue'

declare module 'vue-router' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface RouteMeta {
    sort?: number
  }
}

function deepSortRoutes(routes: readonly RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.toSorted((a, b) => (a.meta?.sort ?? Infinity) - (b.meta?.sort ?? Infinity)).map((route) => {
    return {
      ...route,
      children: route.children ? deepSortRoutes(route.children) : undefined,
    } as RouteRecordRaw
  })
}

/**
 * 定义带有可选 children 属性的树形节点类型
 */
type TreeNode<T> = T & {
  children?: TreeNode<T>[]
}

/**
 * 将树形结构扁平化为一维数组
 * @param array 原始树形节点数组
 * @param childrenKey children 属性名，默认为 'children'
 * @returns 扁平化后的数组
 */
export function flattenDeep<T extends Record<string, any>>(array: TreeNode<T>[], childrenKey: keyof TreeNode<T> = 'children'): T[] {
  return array.reduce<T[]>((result, item) => {
    // 创建不包含 children 的当前项副本（可选）
    const { [childrenKey]: _, ...currentItem } = item as any
    result.push(currentItem as T)

    // 递归处理 children
    const children = item[childrenKey]
    if (children && Array.isArray(children)) {
      result.push(...flattenDeep(children, childrenKey))
    }

    return result
  }, [])
}

/**
 * 设置自动路由
 *
 * 解析路由配置，提供路由工具方法和状态管理
 *
 * @param router - Vue Router 实例
 * @param routesRaw - 原始路由配置数组
 * @returns 自动路由实例，包含路由配置和工具方法
 *
 * @example
 * ```ts
 * import { setupAutoRouter } from '@oiij/auto-router'
 * import { router } from './router'
 * import { routes } from 'vue-router/auto-routes'
 *
 * const autoRouter = setupAutoRouter(router, routes)
 * console.log(autoRouter.routes) // 排序后的路由
 * console.log(autoRouter.flattenRoutes) // 扁平化路由
 * ```
 */
export function setupAutoRouter(router: Router, routesRaw: readonly RouteRecordRaw[]) {
  const loading = ref(false)

  // 导航守卫：开始导航时设置加载状态
  router.beforeEach(() => {
    loading.value = true
  })

  // 导航守卫：导航完成后清除加载状态
  router.afterEach(() => {
    loading.value = false
  })

  const routes = deepSortRoutes(cloneDeep(routesRaw))
  const flattenRoutes = flattenDeep(routes)

  return {
    loading: computed(() => loading.value),
    routesRaw,
    routes,
    flattenRoutes,
  }
}

/**
 * 自动路由实例类型
 *
 * @remarks
 * 由 setupAutoRouter 函数返回的对象类型
 */
export type AutoRouterInstance = ReturnType<typeof setupAutoRouter>
