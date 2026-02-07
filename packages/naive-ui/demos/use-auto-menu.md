# useAutoMenu

`useAutoMenu` 是一个自动菜单生成组合函数，它可以将 Vue Router 的路由配置转换为 Naive UI 菜单组件所需的选项格式。

## 基本用法

### 安装

```bash
pnpm add @oiij/naive-ui
```

### 示例

<demo vue="./use-auto-menu.vue" title="UseAutoMenu" />

```vue
<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useAutoMenu } from '@oiij/naive-ui'
import { computed, ref } from 'vue'

// 模拟路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: '关于我们'
    }
  },
  {
    path: '/user',
    name: 'User',
    meta: {
      title: '用户管理'
    },
    children: [
      {
        path: 'profile',
        name: 'Profile',
        meta: {
          title: '个人资料'
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        meta: {
          title: '账户设置',
          root: true // 标记为 root，将作为顶级菜单
        }
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: {
      title: '管理中心',
      hidden: true // 标记为隐藏
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: {
          title: '仪表盘'
        }
      }
    ]
  }
]

// 使用 useAutoMenu
const { menuOptions, flattenedMenuOptions } = useAutoMenu(routes, {
  // 自定义隐藏逻辑（使用函数）
  hide: route => route.meta?.hidden,
  // 自定义隐藏逻辑（使用字符串）
  // hide: 'hidden',

  // 自定义根路由判断（使用函数）
  root: route => route.meta?.root,
  // 自定义根路由判断（使用字符串）
  // root: 'root',

  // 自定义标签（使用函数）
  label: route => route.meta?.title ?? route.name,
  // 自定义标签（使用字符串）
  // label: 'title',

  // 自定义键（使用函数）
  key: route => route.path,
  // 自定义键（使用字符串）
  // key: 'path',

  // 自定义图标渲染（可选）
  icon: (route) => {
    // 这里可以根据路由元信息返回不同的图标
    return null
  }
})

// 搜索功能
const searchKeyword = ref('')
const filteredMenuOptions = computed(() => {
  if (!searchKeyword.value) {
    return []
  }
  return flattenedMenuOptions.value.filter(menu =>
    menu.label?.toString().includes(searchKeyword.value)
  )
})
</script>

<template>
  <div>
    <h2>基本菜单</h2>
    <n-menu :options="menuOptions" />

    <h2>扁平化菜单（用于搜索）</h2>
    <n-input v-model:value="searchKeyword" placeholder="搜索菜单" />
    <n-list>
      <n-list-item v-for="menu in filteredMenuOptions" :key="menu.key">
        {{ menu.label }}
      </n-list-item>
    </n-list>
  </div>
</template>
```

## API

### 类型定义

```typescript
type Options = {
  /**
   * 隐藏条件，可以是函数或字符串
   * - 如果是函数，返回 true 时路由将不显示在菜单中
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   */
  hide?: ((route: RouteRecordRaw) => boolean | string) | string
  /**
   * 根路由判断，可以是函数或字符串
   * - 如果是函数，返回 true 时路由将作为顶级菜单
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   */
  root?: ((route: RouteRecordRaw) => boolean | string) | string
  /**
   * 标签生成，可以是函数或字符串
   * - 如果是函数，使用函数返回值作为菜单项的显示文本
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   */
  label?: ((route: RouteRecordRaw) => string) | string
  /**
   * 键生成，可以是函数或字符串
   * - 如果是函数，使用函数返回值作为菜单项的唯一标识
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   */
  key?: ((route: RouteRecordRaw) => string) | string
  /**
   * 图标渲染函数，用于自定义路由图标
   */
  icon?: (route: RouteRecordRaw) => VNode | string | undefined | null
}

type UseAutoMenuReturn = {
  /**
   * 菜单选项数组（嵌套结构）
   */
  menuOptions: ComputedRef<MenuOption[]>
  /**
   * 扁平化的菜单选项数组
   */
  flattenedMenuOptions: ComputedRef<MenuOption[]>
}
```

### 参数

- `routes`：`MaybeRefOrGetter<RouteRecordRaw[]>` 类型，路由配置数组，支持响应式引用或 getter 函数
- `options`：`Options` 类型，配置选项，可选

### 返回值

- `menuOptions`：`ComputedRef<MenuOption[]>` 类型，菜单选项数组，保持嵌套结构
- `flattenedMenuOptions`：`ComputedRef<MenuOption[]>` 类型，扁平化的菜单选项数组，便于搜索和筛选

## 特性

### 响应式支持

`useAutoMenu` 支持响应式的路由配置，当路由配置变化时，菜单选项会自动更新。

```vue
<script setup lang="ts">
import { useAutoMenu } from '@oiij/naive-ui'
import { ref } from 'vue'

const routes = ref([
  // 初始路由配置
])

const { menuOptions } = useAutoMenu(routes)

// 后续修改路由配置，菜单会自动更新
setTimeout(() => {
  routes.value.push({
    path: '/new',
    name: 'NewPage',
    meta: {
      title: '新页面'
    }
  })
}, 2000)
</script>
```

### Root 子路由

通过在路由元信息中设置 `root: true`，可以将子路由提升为顶级菜单选项。

### 隐藏路由

通过 `hide` 配置，可以自定义隐藏逻辑，支持函数和字符串两种方式：

```typescript
// 使用函数
const { menuOptions } = useAutoMenu(routes, {
  hide: route => route.meta?.hidden
})

// 使用字符串（从 route.meta 中获取）
const { menuOptions } = useAutoMenu(routes, {
  hide: 'hidden'
})
```

### 图标自定义

通过 `icon` 配置，可以根据路由元信息返回不同的图标，实现个性化的菜单图标。

### 配置选项类型

`hide`、`root`、`label` 和 `key` 配置项都支持两种类型：

1. **函数类型**：提供自定义逻辑，函数接收路由配置作为参数
2. **字符串类型**：直接从 `route.meta` 中获取对应属性的值

这种设计使得配置更加灵活，可以根据实际需求选择最适合的方式。

## 注意事项

- `useAutoMenu` 需要 Vue 3.2+ 和 Naive UI 2.34+ 的支持
- 路由配置中应确保每个路由都有唯一的 `path` 或 `name` 属性，以便生成唯一的菜单 `key`
- 对于复杂的路由结构，建议使用 `flattenedMenuOptions` 进行搜索和筛选操作
