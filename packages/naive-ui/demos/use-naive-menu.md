# useNaiveMenu

`useNaiveMenu` 是一个自动菜单生成组合函数，它可以将 Vue Router 的路由配置转换为 Naive UI 菜单组件所需的选项格式。

## 基本用法

### 安装

```bash
pnpm add @oiij/naive-ui
```

### 示例

<demo vue="./use-naive-menu.vue" title="UseNaiveMenu" />

```vue
<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useNaiveMenu } from '@oiij/naive-ui'
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

// 使用 useNaiveMenu
const { menuOptions, flattenedMenuOptions } = useNaiveMenu(routes, {
  // 自定义隐藏逻辑（使用函数）
  hidden: route => route.meta?.hidden,
  // 自定义隐藏逻辑（使用字符串）
  // hidden: 'hidden',

  // 自定义根路由判断（使用函数）
  root: route => route.meta?.root,
  // 自定义根路由判断（使用字符串）
  // root: 'root',

  // 自定义标签字段（使用字符串）
  labelField: 'title',
  // 自定义键字段（使用字符串）
  keyField: 'name',
  // 自定义图标字段（使用字符串）
  iconField: 'icon',

  // 自定义图标渲染（可选）
  renderIcon: (icon) => {
    // 这里可以根据图标字符串返回不同的图标组件
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
type UseNaiveMenuOptions = {
  /**
   * 隐藏条件，可以是函数或字符串
   * - 如果是函数，返回 true 时路由将不显示在菜单中
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   * @default 'hidden'
   */
  hidden?: ((route: RouteRecordRaw) => boolean | string) | string
  /**
   * 根路由判断，可以是函数或字符串
   * - 如果是函数，返回 true 时路由将作为顶级菜单
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   * @default 'root'
   */
  root?: ((route: RouteRecordRaw) => boolean | string) | string
  /**
   * 标签字段名，从 route.meta 中获取对应属性的值作为菜单标签
   * @default 'title'
   */
  labelField?: string
  /**
   * 键字段名，从 route 中获取对应属性的值作为菜单键
   * @default 'name'
   */
  keyField?: string
  /**
   * 图标字段名，从 route.meta 中获取对应属性的值作为菜单图标
   * @default 'icon'
   */
  iconField?: string
  /**
   * 图标渲染函数，用于自定义图标渲染
   */
  renderIcon?: (icon: string) => VNodeChild
  /**
   * 父路由元信息字段名
   * @default 'parent'
   */
  parentField?: string
  /**
   * 父路由文件路径
   * @default ''
   */
  parentFilePath?: string
  /**
   * 父路由元信息生成函数
   */
  parent?: (route: RouteRecordRaw) => Record<string, unknown>
  /**
   * 自定义菜单选项创建函数
   */
  createMenuOption?: (route: RouteRecordRaw) => MenuOption
}

type UseNaiveMenuReturn = {
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
- `options`：`UseNaiveMenuOptions` 类型，配置选项，可选

### 返回值

- `menuOptions`：`ComputedRef<MenuOption[]>` 类型，菜单选项数组，保持嵌套结构
- `flattenedMenuOptions`：`ComputedRef<MenuOption[]>` 类型，扁平化的菜单选项数组，便于搜索和筛选

## 特性

### 响应式支持

`useNaiveMenu` 支持响应式的路由配置，当路由配置变化时，菜单选项会自动更新。

```vue
<script setup lang="ts">
import { useNaiveMenu } from '@oiij/naive-ui'
import { ref } from 'vue'

const routes = ref([
  // 初始路由配置
])

const { menuOptions } = useNaiveMenu(routes)

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

通过 `hidden` 配置，可以自定义隐藏逻辑，支持函数和字符串两种方式：

```typescript
// 使用函数
const { menuOptions } = useNaiveMenu(routes, {
  hidden: route => route.meta?.hidden
})

// 使用字符串（从 route.meta 中获取）
const { menuOptions } = useNaiveMenu(routes, {
  hidden: 'hidden'
})
```

### 图标自定义

通过 `iconField` 和 `renderIcon` 配置，可以根据路由元信息返回不同的图标，实现个性化的菜单图标。

```typescript
const { menuOptions } = useNaiveMenu(routes, {
  iconField: 'icon',
  renderIcon: (icon) => {
    // 根据图标字符串返回对应的图标组件
    return h('i', { class: icon })
  }
})
```

### 自定义菜单选项

通过 `createMenuOption` 配置，可以完全自定义菜单选项的创建逻辑：

```typescript
const { menuOptions } = useNaiveMenu(routes, {
  createMenuOption: (route) => {
    return {
      label: route.meta?.title,
      key: route.path,
      icon: route.meta?.icon ? () => h('i', { class: route.meta.icon }) : undefined,
      meta: route.meta
    }
  }
})
```

### 父路由元信息合并

通过 `parentField`、`parentFilePath` 和 `parent` 配置，可以将子路由的元信息合并到父路由中：

```typescript
const { menuOptions } = useNaiveMenu(routes, {
  parentField: 'parent',
  parentFilePath: '',
  parent: (route) => {
    // 自定义父路由元信息生成逻辑
    return {
      customProp: 'value'
    }
  }
})
```

### 配置选项类型

`hidden` 和 `root` 配置项支持两种类型：

1. **函数类型**：提供自定义逻辑，函数接收路由配置作为参数
2. **字符串类型**：直接从 `route.meta` 中获取对应属性的值

这种设计使得配置更加灵活，可以根据实际需求选择最适合的方式。

## 注意事项

- `useNaiveMenu` 需要 Vue 3.2+ 和 Naive UI 2.34+ 的支持
- 路由配置中应确保每个路由都有唯一的 `path` 或 `name` 属性，以便生成唯一的菜单 `key`
- 对于复杂的路由结构，建议使用 `flattenedMenuOptions` 进行搜索和筛选操作
- `renderIcon` 函数接收的是图标字符串，而不是整个路由对象
- 默认情况下，`hidden`、`root`、`labelField`、`keyField`、`iconField` 都有预设的默认值
