# useAutoRouter

## 功能描述

**useAutoRouter** 是一个 Vue Router 工具库，为 Vue 3 应用提供自动路由管理、Keep-Alive 管理和加载状态管理等实用功能，帮助开发者更高效地管理应用路由。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/auto-router

# 使用 npm
npm install @oiij/auto-router

# 使用 yarn
yarn add @oiij/auto-router
```

## 依赖

- `vue`: ^3.0.0
- `vue-router`: ^4.0.0
- `es-toolkit`: ^1.0.0

## 基本使用

### 1. 安装插件

在 Vue 应用中安装 `createAutoRouter` 插件，必须在 Vue Router 之后安装：

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

<demo vue="./auto-router.vue" title="useAutoRouter" />

## 路由排序

### 文件命名规范

使用数字前缀来控制路由顺序：

```
src/pages/
  ├── 01_home.vue      # sort: 1
  ├── 02_about.vue     # sort: 2
  ├── 03_contact.vue   # sort: 3
  └── 10_settings.vue  # sort: 10
```

### 自动解析示例

系统会自动从文件名中提取排序信息并规范化路由路径：

- `01_home.vue` → `path: /home`, `sort: 1`
- `02_about.vue` → `path: /about`, `sort: 2`
- `03_user/`
  - `index.vue` → `path: /user`, `sort: 3`
  - `01_profile.vue` → `path: /user/profile`, `sort: 1`
  - `02_settings.vue` → `path: /user/settings`, `sort: 2`

## API

### `createAutoRouter(router, routes)`

创建自动路由插件，必须在 Vue Router 之后安装。

#### 参数

| 参数     | 类型                        | 说明            |
| -------- | --------------------------- | --------------- |
| `router` | `Router`                    | Vue Router 实例 |
| `routes` | `readonly RouteRecordRaw[]` | 路由配置数组    |

### `useAutoRouter()`

获取自动路由实例。

#### 返回值

| 属性            | 类型                        | 说明             |
| --------------- | --------------------------- | ---------------- |
| `loading`       | `ComputedRef<boolean>`      | 路由加载状态     |
| `routesRaw`     | `readonly RouteRecordRaw[]` | 原始路由配置     |
| `routes`        | `RouteRecordRaw[]`          | 排序后的路由配置 |
| `flattenRoutes` | `RouteRecordRaw[]`          | 扁平化的路由配置 |

### `setupAutoRouter(router, routesRaw)`

设置自动路由，解析路由配置，提供路由工具方法和状态管理。

### `appendRouterMeta(route)`

为路由添加元数据，从路由路径中提取排序编号并规范化路由名称。

## 类型定义

```ts
import type { ComputedRef } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'

export type AutoRouterInstance = {
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

## 使用示例

### 基础用法

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

### 配合 KeepAlive 使用

```vue
<script setup>
import { useAutoRouter } from '@oiij/auto-router'

const { flattenRoutes } = useAutoRouter()

// 获取需要缓存的路由名称
const keepAliveNames = flattenRoutes
  .filter(route => route.meta?.keepAlive)
  .map(route => route.name)
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="keepAliveNames">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```

### 监听加载状态

```vue
<script setup>
import { useAutoRouter } from '@oiij/auto-router'
import { watch } from 'vue'

const { loading } = useAutoRouter()

watch(loading, (isLoading) => {
  if (isLoading) {
    console.log('路由开始切换')
  }
  else {
    console.log('路由切换完成')
  }
})
</script>

<template>
  <div>
    <div v-if="loading" class="loading-overlay">
      加载中...
    </div>
    <router-view />
  </div>
</template>
```
