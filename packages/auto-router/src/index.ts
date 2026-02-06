import type { App } from 'vue'
import type { EditableTreeNode } from 'vue-router/unplugin'
import type { AutoRouterInstance } from './setup-auto-router'
import { inject } from 'vue'
import { setupAutoRouter } from './setup-auto-router'

const __INJECTION_KEY__ = Symbol('auto-router')

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

/**
 * 获取自动路由实例
 *
 * @returns 自动路由实例，包含路由配置和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { useAutoRouter } from '@oiij/vue-router'
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
 * @returns Vue 插件对象
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createRouter } from 'vue-router'
 * import { createAutoRouter } from '@oiij/vue-router'
 *
 * const app = createApp(App)
 * const router = createRouter({ ... })
 *
 * app.use(router)
 * app.use(createAutoRouter())
 * app.mount('#app')
 * ```
 */
export function createAutoRouter() {
  return {
    install(app: App) {
      const router = app.config.globalProperties.$router
      if (!router) {
        throw new Error(
          'Router instance is not found on this Vue app. This plugin should be installed after Vue Router.',
        )
      }
      const autoRouter = setupAutoRouter(router)
      app.provide(__INJECTION_KEY__, autoRouter)
    },
  }
}

// 导出类型
export type { AutoRouterInstance } from './setup-auto-router'
export * from './setup-auto-router'
