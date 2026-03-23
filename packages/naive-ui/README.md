# @oiij/naive-ui

[![NPM version](https://img.shields.io/npm/v/@oiij/naive-ui)](https://www.npmjs.com/package/@oiij/naive-ui)
[![MIT-license](https://img.shields.io/npm/l/@oiij/naive-ui)](https://github.com/oiij/use/blob/main/packages/naive-ui/LICENSE)

## 简介

Use NaiveUI 是基于 Naive UI 的 Vue 3 组件库扩展，提供了一系列实用的组合式 API 和组件，帮助开发者更高效地构建应用。

## 特点

### 🔌 组合式 API

- 🛠️ 提供菜单生成、数据请求、表单管理等工具
- 🔄 支持响应式配置
- 🔗 与 Naive UI 无缝集成

### 🧩 丰富组件

- 📊 增强型数据表格
- 📝 预设表单、输入框、选择器
- 🌐 远程请求组件
- ✨ 过渡动画组件

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/naive-ui

# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui
```

## 依赖

- `vue`: ^3.0.0
- `naive-ui`: ^2.0.0
- `vue-router`: ^4.0.0
- `@vueuse/core`: ^10.0.0
- `vue-hooks-plus`: ^2.0.0

## 组合式 API

### useNaiveMenu

将路由配置转换为 Naive UI 菜单配置。

```vue
<script setup>
import { useNaiveMenu } from '@oiij/naive-ui'
import { routes } from 'vue-router/auto-routes'

const { menuOptions, flattenedMenuOptions } = useNaiveMenu(routes)
</script>

<template>
  <n-menu :options="menuOptions" />
</template>
```

### useDataRequest

数据请求管理，支持分页。

```vue
<script setup>
import { useDataRequest } from '@oiij/naive-ui'

const { loading, list, pagination, run } = useDataRequest(fetchApi, {
  defaultParams: { page: 1, pageSize: 10 },
  fields: { page: 'page', pageSize: 'size', list: 'data', count: 'total' }
})
</script>
```

### useLoading

获取全局加载状态。

```vue
<script setup>
import { useLoading } from '@oiij/naive-ui'

const loading = useLoading()
loading?.start()
loading?.finish()
</script>
```

### useNaiveForm

表单管理。

```vue
<script setup>
import { useNaiveForm } from '@oiij/naive-ui'
import { ref, useTemplateRef } from 'vue'

const formValue = ref({ name: '', email: '' })
const { formRef, formProps, validate, resetForm } = useNaiveForm(
  useTemplateRef('form'),
  formValue
)
</script>

<template>
  <n-form ref="form" v-bind="formProps">
    <n-form-item label="姓名" path="name">
      <n-input v-model:value="formValue.name" />
    </n-form-item>
  </n-form>
</template>
```

### useNaiveTheme

主题管理。

```vue
<script setup>
import { useNaiveTheme } from '@oiij/naive-ui'

const { theme, darkMode, themeOverrides } = useNaiveTheme()
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <button @click="darkMode = !darkMode">
      切换主题
    </button>
  </n-config-provider>
</template>
```

## 组件

### ConfigProviders

全局配置提供者。

```vue
<template>
  <ConfigProviders>
    <router-view />
  </ConfigProviders>
</template>
```

### CopyButton

复制按钮。

```vue
<template>
  <CopyButton value="要复制的内容" />
</template>
```

### DataTablePlus

增强型数据表格。

```vue
<script setup>
import { DataTablePlus } from '@oiij/naive-ui'

const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' }
]

async function fetchData(params) {
  return await api.getUsers(params)
}
</script>

<template>
  <DataTablePlus
    :api="fetchData"
    :columns="columns"
    :search="true"
    :pagination="true"
  />
</template>
```

### LoadingProvider

加载状态提供者。

```vue
<script setup>
import { LoadingProvider, useLoading } from '@oiij/naive-ui'

const loading = useLoading()
</script>

<template>
  <LoadingProvider :show="false" />
</template>
```

### PresetForm

预设表单。

```vue
<script setup>
import { PresetForm } from '@oiij/naive-ui'
import { ref } from 'vue'

const values = ref({ name: '', age: null })
const options = [
  { key: 'name', label: '姓名', type: 'input' },
  { key: 'age', label: '年龄', type: 'input-number' }
]
</script>

<template>
  <PresetForm v-model:values="values" :options="options" />
</template>
```

### PresetInput

预设输入框。

```vue
<script setup>
import { PresetInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('')
const options = { type: 'input', props: { placeholder: '请输入' } }
</script>

<template>
  <PresetInput v-model:value="value" :options="options" />
</template>
```

### PresetSelect

远程选择器。

```vue
<script setup>
import { PresetSelect } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <PresetSelect
    v-model:value="value"
    :api="fetchUsers"
    :option-format="(row) => ({ label: row.name, value: row.id })"
  />
</template>
```

### SearchInput

搜索输入框。

```vue
<script setup>
import { SearchInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const keyword = ref('')
</script>

<template>
  <SearchInput v-model:value="keyword" placeholder="搜索" />
</template>
```

### ToggleInput

切换输入框。

```vue
<script setup>
import { ToggleInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('双击编辑')
</script>

<template>
  <ToggleInput v-model:value="value" />
</template>
```

### TooltipButton

提示按钮。

```vue
<template>
  <TooltipButton value="点击查看详情" :button-props="{ type: 'primary' }">
    查看
  </TooltipButton>
</template>
```

### Transition

过渡动画。

```vue
<template>
  <Transition name="fade">
    <div v-if="show">
      内容
    </div>
  </Transition>
</template>
```

## API

### `useNaiveMenu(routes, options?)`

将路由配置转换为菜单配置。

#### 参数

| 参数      | 类型                                 | 说明         |
| --------- | ------------------------------------ | ------------ |
| `routes`  | `MaybeRefOrGetter<RouteRecordRaw[]>` | 路由配置数组 |
| `options` | `UseNaiveMenuOptions`                | 配置选项     |

#### 返回值

| 属性                   | 类型                        | 说明           |
| ---------------------- | --------------------------- | -------------- |
| `menuOptions`          | `ComputedRef<MenuOption[]>` | 菜单配置       |
| `flattenedMenuOptions` | `ComputedRef<MenuOption[]>` | 扁平化菜单配置 |

### `useDataRequest(api, options?)`

数据请求管理。

#### 参数

| 参数      | 类型                    | 说明     |
| --------- | ----------------------- | -------- |
| `api`     | `function`              | 请求函数 |
| `options` | `UseDataRequestOptions` | 配置选项 |

#### 返回值

| 属性         | 类型               | 说明     |
| ------------ | ------------------ | -------- |
| `loading`    | `Ref<boolean>`     | 加载状态 |
| `data`       | `Ref<D>`           | 响应数据 |
| `list`       | `ComputedRef<R[]>` | 列表数据 |
| `pagination` | `Ref<Pagination>`  | 分页信息 |
| `run`        | `function`         | 执行请求 |
| `refresh`    | `function`         | 刷新请求 |

### `useNaiveForm(formRef, value?, options?)`

表单管理。

#### 返回值

| 属性        | 类型                    | 说明       |
| ----------- | ----------------------- | ---------- |
| `formRef`   | `Ref<FormInst \| null>` | 表单引用   |
| `formValue` | `Ref<T>`                | 表单值     |
| `formProps` | `object`                | 表单 props |
| `validate`  | `function`              | 验证表单   |
| `resetForm` | `function`              | 重置表单   |

### `useNaiveTheme(options?)`

主题管理。

#### 返回值

| 属性             | 类型                          | 说明         |
| ---------------- | ----------------------------- | ------------ |
| `theme`          | `ComputedRef<Theme>`          | 当前主题     |
| `darkMode`       | `Ref<boolean>`                | 暗黑模式状态 |
| `themeOverrides` | `ComputedRef<ThemeOverrides>` | 主题覆盖     |
| `setColor`       | `function`                    | 设置颜色     |

## 在线文档

[在线文档](https://oiij-use.vercel.app/naive-ui/naive-ui)
