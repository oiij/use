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

```vue
<script setup>
import { useAutoRouter } from '@oiij/auto-router'

const { loading, routes, currentRoutePath } = useAutoRouter()
</script>

<template>
  <div>
    <div v-if="loading">
      加载中...
    </div>
    <div v-else>
      <p>当前路由: {{ currentRoutePath }}</p>
      <nav>
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
        >
          {{ route.meta?.title }}
        </router-link>
      </nav>
    </div>
  </div>
</template>
```

## 路由元数据配置

在路由组件中定义元数据：

```vue
<route lang="json">
{
  "meta": {
    "title": "首页",
    "description": "应用首页",
    "icon": "home",
    "iconColor": "#409eff",
    "sort": 1,
    "keepAlive": true,
    "layout": "default",
    "transitionName": "fade",
    "group": {
      "title": "主要功能",
      "icon": "star",
      "sort": 1
    }
  }
}
</route>

<script setup>
// 组件代码
</script>
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
declare function createAutoRouter(): Plugin
declare function useAutoRouter(): AutoRouterInstance
declare function appendRouterMeta(route: EditableTreeNode): void
declare function setupAutoRouter(router: Router): AutoRouterInstance
```

## 类型定义

```ts
type AutoRouterInstance = {
  loading: ComputedRef<boolean>
  routesRaw: readonly RouteRecordRaw[]
  routes: RouteRecordRaw[]
  flattenRoutes: RouteRecordRaw[]
  keepAlivePath: ComputedRef<string[]>
  currentRoute: ComputedRef<RouteLocationNormalizedLoaded>
  currentRoutePath: ComputedRef<string>
  filterRoutesByPermission: (permissions: string[]) => RouteRecordRaw[]
}
```
