# @oiij/auto-router

[![NPM version](https://img.shields.io/npm/v/@oiij/auto-router)](https://www.npmjs.com/package/@oiij/auto-router)
[![MIT-license](https://img.shields.io/npm/l/@oiij/auto-router)](https://github.com/oiij/use/blob/main/packages/auto-router/LICENSE)

## 简介

Use auto-Router 是一个 Vue Router 工具库，为 Vue 3 应用提供自动路由管理、Keep-Alive 管理等实用功能，帮助开发者更高效地管理应用路由。

## 特点

### 🗺️ 自动路由管理

- 🔄 自动解析和排序路由（支持数字前缀排序）
- 📋 路由扁平化处理
- ✏️ 自动规范化路由名称

### 💾 Keep-Alive 管理

- 📦 自动管理页面缓存
- 🎛️ 支持动态缓存控制

### ⏳ 加载状态管理

- 🔄 自动跟踪路由加载状态
- 🛡️ 基于导航守卫的状态管理
- 📊 响应式的加载状态计算属性

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

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

## 示例

### 安装插件

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

### 在组件中使用

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
      <h2>路由列表</h2>
      <nav>
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
        >
          {{ route.meta?.title || route.path }}
        </router-link>
      </nav>
    </div>
  </div>
</template>
```

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

## 类型定义

```ts
import type { Router, RouteRecordRaw } from 'vue-router'

export type AutoRouterInstance = {
  loading: ComputedRef<boolean>
  routesRaw: readonly RouteRecordRaw[]
  routes: RouteRecordRaw[]
  flattenRoutes: RouteRecordRaw[]
}
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/auto-router/auto-router)
