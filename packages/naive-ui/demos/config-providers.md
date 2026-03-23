# ConfigProviders 全局化配置

## 功能描述

**ConfigProviders** 是一个功能强大的 Naive UI 全局化配置组件，提供了完整的应用级配置能力，包括主题设置、语言配置、全局样式、各种 Provider 配置等特性。它基于 Naive UI 的多个 Provider 组件实现，为 Vue 应用提供了统一的全局配置管理体验。

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

## 基本使用

<demo vue="./config-providers.vue" title="ConfigProviders" />

## API

### `<ConfigProviders />`

全局配置提供者组件。

#### Props

| 属性                        | 类型                        | 说明                      |
| --------------------------- | --------------------------- | ------------------------- |
| `configProviderProps`       | `ConfigProviderProps`       | ConfigProvider 配置       |
| `loadingBarProps`           | `LoadingBarProviderProps`   | LoadingBarProvider 配置   |
| `fullLoadingProps`          | `FullLoadingProps`          | 全屏加载配置              |
| `dialogProviderProps`       | `DialogProviderProps`       | DialogProvider 配置       |
| `modalProviderProps`        | `ModalProviderProps`        | ModalProvider 配置        |
| `notificationProviderProps` | `NotificationProviderProps` | NotificationProvider 配置 |
| `messageProviderProps`      | `MessageProviderProps`      | MessageProvider 配置      |

#### Slots

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 默认插槽 |

## 全局变量

安装组件后，会在 `window` 对象上挂载以下全局变量：

| 变量            | 类型                       | 说明       |
| --------------- | -------------------------- | ---------- |
| `$dialog`       | `DialogProviderInst`       | 对话框实例 |
| `$loading`      | `LoadingIns`               | 加载实例   |
| `$loadingBar`   | `LoadingBarProviderInst`   | 加载条实例 |
| `$message`      | `MessageProviderInst`      | 消息实例   |
| `$modal`        | `ModalProviderInst`        | 模态框实例 |
| `$notification` | `NotificationProviderInst` | 通知实例   |

## 类型定义

```ts
export type ConfigProvidersProps = {
  /**
   * 是否启用全局样式
   */
  globalStyle?: boolean
  /**
   * ConfigProvider 配置
   */
  configProviderProps?: ConfigProviderProps
  /**
   * LoadingBarProvider 配置
   */
  loadingBarProps?: LoadingBarProviderProps
  /**
   * 全屏加载配置
   */
  fullLoadingProps?: FullLoadingProps
  /**
   * DialogProvider 配置
   */
  dialogProviderProps?: DialogProviderProps
  /**
   * ModalProvider 配置
   */
  modalProviderProps?: ModalProviderProps
  /**
   * NotificationProvider 配置
   */
  notificationProviderProps?: NotificationProviderProps
  /**
   * MessageProvider 配置
   */
  messageProviderProps?: MessageProviderProps
}

export type LoadingIns = {
  start: () => void
  finish: () => void
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { ConfigProviders } from '@oiij/naive-ui'
</script>

<template>
  <ConfigProviders>
    <router-view />
  </ConfigProviders>
</template>
```

### 配置主题

```vue
<script setup>
import { ConfigProviders } from '@oiij/naive-ui'
import { darkTheme } from 'naive-ui'
</script>

<template>
  <ConfigProviders
    :config-provider-props="{ theme: darkTheme }"
  >
    <router-view />
  </ConfigProviders>
</template>
```

### 使用全局变量

```vue
<script setup>
function handleClick() {
  window.$message.success('操作成功')
  window.$notification.info({
    title: '通知',
    content: '这是一条通知'
  })
}
</script>

<template>
  <button @click="handleClick">
    显示消息
  </button>
</template>
```
