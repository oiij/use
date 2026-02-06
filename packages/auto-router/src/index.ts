import type { App } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { AutoRouterInstance } from './setup-auto-router'
import { inject } from 'vue'
import { setupAutoRouter } from './setup-auto-router'

const __INJECTION_KEY__ = Symbol('auto-router')

/**
 * 获取自动路由实例
 *
 * @returns 自动路由实例，包含路由配置和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { useAutoRouter } from '@oiij/auto-router'
 *
 * const { routes, flattenRoutes, keepAlivePath } = useAutoRouter()
 * </script>
 * ```
 */
export function useAutoRouter() {
  const router = inject<AutoRouterInstance>(__INJECTION_KEY__)
  if (!router) {
    throw new Error('Auto router is not provided. Make sure to install createAutoRouter plugin.')
  }
  return router
}

/**
 * 创建自动路由插件
 *
 * 必须在 Vue Router 之后安装
 *
 * @param router Vue Router 实例
 * @param routes 路由配置数组
 * @returns Vue 插件对象
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createRouter } from 'vue-router'
 * import { routes } from 'vue-router/auto-routes'

 * import { createAutoRouter } from '@oiij/auto-router'
 *
 * const app = createApp(App)
 * const router = createRouter({ ... })
 *
 * app.use(router)
 * app.use(createAutoRouter(router, routes))
 * app.mount('#app')
 * ```
 */
export function createAutoRouter(router: Router, routes: readonly RouteRecordRaw[]) {
  const autoRouter = setupAutoRouter(router, routes)
  return {
    install(app: App) {
      app.config.globalProperties.$autoRouter = autoRouter
      app.provide(__INJECTION_KEY__, autoRouter)
    },
    ...autoRouter,
  }
}

// 导出类型
export type { AutoRouterInstance } from './setup-auto-router'
