import type { Router, RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'es-toolkit'
import { computed, ref } from 'vue'

declare module 'vue-router' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface RouteMeta {
    sort?: number
  }
}
/**
 * 深度排序路由配置
 *
 * 递归地对路由配置进行排序，包括所有嵌套的子路由
 *
 * @param routes - 原始路由配置数组
 * @returns 排序后的路由配置数组
 *
 * @example
 * ```ts
 * const sortedRoutes = deepSortRoutes([
 *   { path: '/about', meta: { sort: 2 } },
 *   { path: '/home', meta: { sort: 1 } }
 * ])
 * // 结果: [{ path: '/home', ... }, { path: '/about', ... }]
 * ```
 */
function deepSortRoutes(routes: readonly RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.toSorted((a, b) => (a.meta?.sort ?? Infinity) - (b.meta?.sort ?? Infinity)).map((route) => {
    return {
      ...route,
      children: route.children ? deepSortRoutes(route.children) : undefined,
    } as RouteRecordRaw
  })
}

/**
 * 扁平化路由配置
 *
 * 将嵌套的路由结构展平为一维数组，包含所有层级的路由
 *
 * @param routes - 路由配置数组
 * @returns 扁平化后的路由数组
 *
 * @example
 * ```ts
 * const flattened = flattenDeepRoutes([
 *   {
 *     path: '/user',
 *     children: [{ path: '/user/profile' }]
 *   }
 * ])
 * // 结果: [{ path: '/user', ... }, { path: '/user/profile', ... }]
 * ```
 */
function flattenDeepRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.flatMap((route) => {
    const flattened = [route]
    if (route.children && route.children.length > 0) {
      flattened.push(...flattenDeepRoutes(route.children))
    }
    return flattened
  })
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
  /**
   * 路由加载状态
   *
   * @remarks
   * 通过导航守卫自动管理，在路由切换时设置为 true，切换完成后设置为 false
   */
  const loading = ref(false)

  // 导航守卫：开始导航时设置加载状态
  router.beforeEach(() => {
    loading.value = true
  })

  // 导航守卫：导航完成后清除加载状态
  router.afterEach(() => {
    loading.value = false
  })

  /**
   * 解析并排序后的路由配置
   *
   * @remarks
   * 使用 deepSortRoutes 对路由进行深度排序，确保所有层级的路由都按 sort 元数据排序
   */
  const routes = deepSortRoutes(cloneDeep(routesRaw))

  /**
   * 扁平化的路由配置
   *
   * @remarks
   * 使用 flattenDeepRoutes 将嵌套的路由结构展平为一维数组，方便后续处理
   */
  const flattenRoutes = flattenDeepRoutes(routes)

  return {
    /**
     * 路由加载状态
     *
     * @type {import('vue').ComputedRef<boolean>}
     */
    loading: computed(() => loading.value),

    /**
     * 原始路由配置
     *
     * @type {readonly RouteRecordRaw[]}
     */
    routesRaw,

    /**
     * 解析并排序后的路由配置
     *
     * @type {RouteRecordRaw[]}
     */
    routes,

    /**
     * 扁平化的路由配置
     *
     * @type {RouteRecordRaw[]}
     */
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
