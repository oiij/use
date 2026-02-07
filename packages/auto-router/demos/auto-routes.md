# useAutoRouter

## 功能描述

**useAutoRouter** 是一个 Vue Router 工具库，为 Vue 3 应用提供自动路由管理、Keep-Alive 管理和加载状态管理等实用功能，帮助开发者更高效地管理应用路由。

## 安装

```bash
# 使用 npm
npm install @oiij/auto-router

# 使用 yarn
yarn add @oiij/auto-router

# 使用 pnpm
pnpm add @oiij/auto-router
```

## 基本使用

### 1. 安装插件

在 Vue 应用中安装 `createAutoRouter` 插件：

```ts
import { createAutoRouter } from '@oiij/auto-router'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 必须先安装 Vue Router
app.use(router)
// 然后安装自动路由插件
app.use(createAutoRouter(router, routes))

app.mount('#app')
```

### 2. 在组件中使用

在 Vue 组件中使用 `useAutoRouter` 获取路由实例：

```vue
<script setup>
import { useAutoRouter } from '@oiij/auto-router'

const { loading, routes, flattenRoutes } = useAutoRouter()
</script>

<template>
  <div>
    <div v-if="loading">
      加载中...
    </div>
    <div v-else>
      <h2>排序后的路由</h2>
      <nav>
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
        >
          {{ route.meta?.title || route.path }}
        </router-link>
      </nav>

      <h2>扁平化路由</h2>
      <ul>
        <li v-for="route in flattenRoutes" :key="route.path">
          {{ route.path }} - {{ route.meta?.title }}
        </li>
      </ul>
    </div>
  </div>
</template>
```

## 排序路由文件解构

### 文件命名规范

使用数字前缀来控制路由顺序：

```
src/pages/
  ├── 01_home.vue      # sort: 1
  ├── 02_about.vue     # sort: 2
  ├── 03_contact.vue   # sort: 3
  └── 10_settings.vue  # sort: 10
```

### 自动解构示例

系统会自动从文件名中提取排序信息并规范化路由路径：

- `01_home.vue` → `path: /home`, `sort: 1`
- `02_about.vue` → `path: /about`, `sort: 2`
- `03_user/`
  - `index.vue` → `path: /user`, `sort: 3`
  - `01_profile.vue` → `path: /user/profile`, `sort: 1`
  - `02_settings.vue` → `path: /user/settings`, `sort: 2`

## API

### 函数签名

```ts
/**
 * 获取自动路由实例
 *
 * @returns 自动路由实例，包含路由配置和工具方法
 */
declare function useAutoRouter(): AutoRouterInstance

/**
 * 创建自动路由插件
 *
 * 必须在 Vue Router 之后安装
 *
 * @param router Vue Router 实例
 * @param routes 路由配置数组
 * @returns Vue 插件对象
 */
declare function createAutoRouter(router: Router, routes: readonly RouteRecordRaw[]): Plugin

/**
 * 设置自动路由
 *
 * 解析路由配置，提供路由工具方法和状态管理
 *
 * @param router Vue Router 实例
 * @param routesRaw 原始路由配置数组
 * @returns 自动路由实例，包含路由配置和工具方法
 */
declare function setupAutoRouter(router: Router, routesRaw: readonly RouteRecordRaw[]): AutoRouterInstance
```

## 类型定义

```ts
/**
 * 自动路由实例类型
 *
 * 由 setupAutoRouter 函数返回的对象类型
 */
type AutoRouterInstance = {
  /**
   * 路由加载状态
   *
   * 通过导航守卫自动管理，在路由切换时设置为 true，切换完成后设置为 false
   */
  loading: ComputedRef<boolean>

  /**
   * 原始路由配置
   */
  routesRaw: readonly RouteRecordRaw[]

  /**
   * 解析并排序后的路由配置
   *
   * 使用 deepSortRoutes 对路由进行深度排序
   */
  routes: RouteRecordRaw[]

  /**
   * 扁平化的路由配置
   *
   * 使用 flattenDeepRoutes 将嵌套的路由结构展平为一维数组，方便后续处理
   */
  flattenRoutes: RouteRecordRaw[]
}
```
