import type { ComputedRef } from 'vue'
import type { RouteLocationNormalizedLoaded, Router, RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'es-toolkit'
import { computed, ref } from 'vue'

/**
 * 自动路由实例接口
 */
export type AutoRouterInstance = {
  /**
   * 加载状态
   */
  loading: ComputedRef<boolean>
  /**
   * 原始路由配置
   */
  routesRaw: readonly RouteRecordRaw[]
  /**
   * 解析并排序后的路由配置
   */
  routes: RouteRecordRaw[]
  /**
   * 扁平化的路由列表（将所有子路由提取到一级）
   */
  flattenRoutes: RouteRecordRaw[]
  /**
   * 需要缓存的路由路径列表
   */
  keepAlivePath: ComputedRef<string[]>
  /**
   * 当前路由
   */
  currentRoute: ComputedRef<RouteLocationNormalizedLoaded>
  /**
   * 当前路由路径
   */
  currentRoutePath: ComputedRef<string>
}

/**
 * 解析路由配置
 *
 * 处理以下逻辑：
 * 1. 从子路由的 index 页面继承 group 元数据
 * 2. 将空路径的子路由路径设置为父路由路径
 * 3. 根据 sort 元数据排序路由
 *
 * @param routes - 原始路由配置
 * @returns 解析后的路由配置
 */
function parseRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.map((route) => {
    // 从子路由的 index 页面获取 group 元数据
    const indexChild = route.children?.find(f => f.path === '')
    const indexMeta = indexChild?.meta?.group

    return {
      ...route,
      meta: {
        ...route.meta,
        ...indexMeta,
      },
      children: route.children?.map(child => ({
        ...child,
        // 如果子路由路径为空，使用父路由路径
        path: child.path === '' ? route.path : child.path,
      }))
        .toSorted((a, b) => ((a.meta?.sort as number) ?? Infinity) - ((b.meta?.sort as number) ?? Infinity),
        ),
    } as RouteRecordRaw
  })
    .toSorted((a, b) => ((a.meta?.sort as number) ?? Infinity) - ((b.meta?.sort as number) ?? Infinity),
    )
}

/**
 * 扁平化路由配置
 *
 * 将嵌套的路由结构展平为一维数组
 *
 * @param routes - 路由配置
 * @returns 扁平化后的路由数组
 */
function flattenRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return cloneDeep(routes).flatMap(route => route.children ?? route)
}

/**
 * 设置自动路由
 *
 * 解析路由配置，提供路由工具方法
 *
 * @param router - Vue Router 实例
 * @returns 自动路由实例
 *
 * @example
 * ```ts
 * import { setupAutoRouter } from '@oiij/auto-router'
 * import { router } from './router'
 *
 * const autoRouter = setupAutoRouter(router)
 * console.log(autoRouter.routes) // 解析后的路由
 * console.log(autoRouter.flattenRoutes) // 扁平化路由
 * ```
 */
export function setupAutoRouter(router: Router, routesRaw: readonly RouteRecordRaw[]): AutoRouterInstance {
  const loading = ref(false)
  router.beforeEach((to, from, next) => {
    loading.value = true
    next()
  })
  router.afterEach(() => {
    loading.value = false
  })
  // 解析路由
  const routes = parseRoutes(cloneDeep(routesRaw) as RouteRecordRaw[])

  // 扁平化路由
  const flattenRoutesCache = flattenRoutes(routes)

  // Keep-Alive 路径
  const keepAlivePath = computed(() =>
    flattenRoutesCache.filter(f => f.meta?.keepAlive).map(m => m.path),
  )

  // 当前路由
  const currentRoute = computed(() => router.currentRoute.value)
  const currentRoutePath = computed(() => currentRoute.value.path)

  return {
    loading: computed(() => loading.value),
    routesRaw,
    routes,
    flattenRoutes: flattenRoutesCache,
    keepAlivePath,
    currentRoute,
    currentRoutePath,
  }
}
