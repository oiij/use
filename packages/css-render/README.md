# @oiij/css-render

[![NPM version](https://img.shields.io/npm/v/@oiij/css-render)](https://www.npmjs.com/package/@oiij/css-render)
[![MIT-license](https://img.shields.io/npm/l/@oiij/css-render)](https://github.com/oiij/use/blob/main/packages/css-render/LICENSE)

## 简介

Use CssRender 是一个强大的 CSS 渲染工具，为 Vue 3 应用提供动态样式渲染能力，帮助开发者更灵活地管理组件样式。

## 特点

### 🎨 动态渲染

- 🔧 支持动态生成和管理样式
- 📡 提供简洁的 API 接口
- ⚡ 高效的样式注入机制

### 🏗️ BEM 命名规范

- ✅ 支持 BEM（Block-Element-Modifier）命名规范
- ⚙️ 可自定义命名空间和前缀
- 🔤 自动生成符合规范的类名

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

### 🖥️ SSR 支持

- ✅ 支持服务端渲染（SSR）
- 🔄 自动适配 SSR 环境

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/css-render

# 使用 npm
npm install @oiij/css-render

# 使用 yarn
yarn add @oiij/css-render
```

## 依赖

- `vue`: ^3.0.0
- `css-render`: ^0.15.0
- `@css-render/plugin-bem`: ^0.15.0
- `@css-render/vue3-ssr`: ^0.15.0

## 示例

### 基础使用

```vue
<script setup>
import { useBem, useStyle } from '@oiij/css-render'

const { cssr, plugin } = useBem({
  namespace: 'my',
})
const { c, cB, cE, cM } = { ...cssr, ...plugin }

// 生成样式
const style = c([
  cB('button', {
    padding: '10px 20px',
    borderRadius: '4px',
    backgroundColor: '#409eff',
    color: '#fff',
  }, [
    cM('primary', {
      backgroundColor: '#67c23a',
    }),
    cM('danger', {
      backgroundColor: '#f56c6c',
    }),
  ]),
])

useStyle('my-button', style)
</script>

<template>
  <button class="my-button">
    默认按钮
  </button>
  <button class="my-button my-button--primary">
    主要按钮
  </button>
  <button class="my-button my-button--danger">
    危险按钮
  </button>
</template>
```

### 完整 BEM 示例

```vue
<script setup>
import { useBem, useStyle } from '@oiij/css-render'

const { cssr, plugin } = useBem({
  namespace: 'app',
  blockPrefix: '.app-',
  elementPrefix: '__',
  modifierPrefix: '--',
})
const { c, cB, cE, cM } = { ...cssr, ...plugin }

const style = c([
  cB('card', {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  }, [
    cE('header', {
      marginBottom: '16px',
      fontSize: '18px',
      fontWeight: 'bold',
    }),
    cE('body', {
      fontSize: '14px',
      color: '#666',
    }),
    cE('footer', {
      marginTop: '16px',
      textAlign: 'right',
    }),
    cM('bordered', {
      border: '1px solid #eee',
    }),
  ]),
])

useStyle('app-card', style)
</script>

<template>
  <div class="app-card app-card--bordered">
    <div class="app-card__header">
      卡片标题
    </div>
    <div class="app-card__body">
      卡片内容
    </div>
    <div class="app-card__footer">
      卡片底部
    </div>
  </div>
</template>
```

## API

### `useBem(options?)`

创建 BEM 工具对象。

#### 参数

| 参数      | 类型         | 默认值 | 说明         |
| --------- | ------------ | ------ | ------------ |
| `options` | `BemOptions` | -      | BEM 配置选项 |

#### BemOptions

| 选项             | 类型     | 默认值             | 说明       |
| ---------------- | -------- | ------------------ | ---------- |
| `namespace`      | `string` | `'n'`              | 命名空间   |
| `blockPrefix`    | `string` | `'.${namespace}-'` | 块前缀     |
| `elementPrefix`  | `string` | `'__'`             | 元素前缀   |
| `modifierPrefix` | `string` | `'--'`             | 修饰符前缀 |

#### 返回值

| 属性             | 类型                 | 说明            |
| ---------------- | -------------------- | --------------- |
| `namespace`      | `string`             | 命名空间        |
| `blockPrefix`    | `string`             | 块前缀          |
| `elementPrefix`  | `string`             | 元素前缀        |
| `modifierPrefix` | `string`             | 修饰符前缀      |
| `cssr`           | `CssRenderInstance`  | CSS Render 实例 |
| `plugin`         | `CssRenderBemPlugin` | BEM 插件        |

### `useStyle(mountId, style)`

挂载样式。

#### 参数

| 参数      | 类型     | 说明            |
| --------- | -------- | --------------- |
| `mountId` | `string` | 样式挂载的 ID   |
| `style`   | `CNode`  | CSS Render 节点 |

## 类型定义

```ts
import type { CNode, CssRenderInstance } from 'css-render'

export type CssRenderBemPlugin = ReturnType<typeof BemPlugin> & {
  __?: 'css-render-bem'
}

export type BemOptions = {
  /**
   * 命名空间
   * @default 'n'
   */
  namespace?: string
  /**
   * 块前缀
   * @default '.${namespace}-'
   */
  blockPrefix?: string
  /**
   * 元素前缀
   * @default '__'
   */
  elementPrefix?: string
  /**
   * 修饰符前缀
   * @default '--'
   */
  modifierPrefix?: string
}

export type UseBemReturn = {
  namespace: string
  blockPrefix: string
  elementPrefix: string
  modifierPrefix: string
  cssr: CssRenderInstance
  plugin: CssRenderBemPlugin
}

export declare function useBem(options?: BemOptions): UseBemReturn
export declare function useStyle(mountId: string, style: CNode): void
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/css-render/css-render)
