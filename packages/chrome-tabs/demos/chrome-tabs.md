# Chrome-Tabs

## 功能描述

**Chrome-Tabs** 是一个类似 Chrome 浏览器标签页风格的 Vue 组件，支持标签页的添加、删除、点击切换、下拉菜单等功能，可自定义颜色主题和图标大小。

## 安装

```bash
# 使用 npm
npm install @oiij/chrome-tabs

# 使用 yarn
yarn add @oiij/chrome-tabs

# 使用 pnpm
pnpm add @oiij/chrome-tabs
```

## 基本使用

<demo vue="./chrome-tabs.vue" title="Chrome-Tabs Base" />

## API

### 函数签名

```ts
import { CTabs } from '@oiij/chrome-tabs'
```

## 类型定义

```ts
import type { CSSProperties, VNode } from 'vue'

type VNodeChild = VNode | string | number | undefined | void | null | boolean
type TabItemKey = string | number

export type TabsOption = {
  key: TabItemKey
  label: string | ((key: TabItemKey, index: number) => VNodeChild)
  icon?: (key: TabItemKey, index: number) => VNodeChild
  closable?: boolean | ((key: TabItemKey, index: number) => boolean)
  disabled?: boolean | ((key: TabItemKey, index: number) => boolean)
  loading?: boolean | ((key: TabItemKey, index: number) => boolean)
  loadingIcon?: (key: TabItemKey, index: number) => VNodeChild
  onClick?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  onContextMenu?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  onClose?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  class?: string
  style?: CSSProperties | string
}

export type TabsProps = {
  value?: TabItemKey
  colors?: {
    active?: string
    primary?: string
    background?: string
  }
  dropdown?: boolean
  addable?: boolean
  options?: TabsOption[]
  loadingValue?: TabItemKey
  iconSize?: number
  contentClass?: string
  contentStyle?: CSSProperties | string
}
```
