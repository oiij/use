# UseCssRender

## 功能描述

**UseCssRender** 是一个用于 CSS 渲染的 Vue 组合式函数，支持 BEM 命名规范和动态样式管理，可用于创建和管理组件的 CSS 样式。

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

## 基本使用

<demo vue="./use-css-render.vue" title="UseCssRender" />

## API

### `useBem(options?)`

创建 BEM 工具对象。

#### 参数

| 参数      | 类型         | 默认值 | 说明         |
| --------- | ------------ | ------ | ------------ |
| `options` | `BemOptions` | -      | BEM 配置选项 |

#### BemOptions

| 选项             | 类型     | 默认值  | 说明       |
| ---------------- | -------- | ------- | ---------- |
| `blockPrefix`    | `string` | `'.n-'` | 块前缀     |
| `elementPrefix`  | `string` | `'__'`  | 元素前缀   |
| `modifierPrefix` | `string` | `'--'`  | 修饰符前缀 |

#### 返回值

| 属性       | 类型       | 说明            |
| ---------- | ---------- | --------------- |
| `c`        | `Function` | 创建样式节点    |
| `config`   | `Object`   | CSS Render 配置 |
| `cB`       | `Function` | 块选择器        |
| `cE`       | `Function` | 元素选择器      |
| `cM`       | `Function` | 修饰符选择器    |
| `cNotM`    | `Function` | 非修饰符选择器  |
| `nB(name)` | `Function` | 块名称生成      |
| `nE(name)` | `Function` | 元素名称生成    |
| `nM(name)` | `Function` | 修饰符名称生成  |

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

export type CssRenderBemPlugin = ReturnType<typeof plugin> & {
  __?: 'css-render-bem'
}

export type BemOptions = {
  /**
   * 块前缀
   * @default '.n-'
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

export type UseBemReturn = CssRenderInstance & CssRenderBemPlugin & {
  /**
   * 块名称生成函数
   */
  nB: (name: string) => string
  /**
   * 元素名称生成函数
   */
  nE: (name: string) => string
  /**
   * 修饰符名称生成函数
   */
  nM: (name: string) => string
}

export declare function useBem(options?: BemOptions): UseBemReturn
export declare function useStyle(mountId: string, style: CNode): void
```

## 使用示例

### 基础 BEM 用法

```vue
<script setup>
import { useBem, useStyle } from '@oiij/css-render'

const { c, cB, cE, cM } = useBem({
  blockPrefix: '.my-',
})

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

const { c, cB, cE, cM } = useBem({
  blockPrefix: '.app-',
  elementPrefix: '__',
  modifierPrefix: '--',
})

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

### 自定义前缀

```vue
<script setup>
import { useBem, useStyle } from '@oiij/css-render'

const { c, cB, cE, cM } = useBem({
  blockPrefix: '.o-',
  elementPrefix: '-',
  modifierPrefix: '_',
})

const style = c([
  cB('input', {
    padding: '8px 12px',
    border: '1px solid #dcdfe6',
    borderRadius: '4px',
  }, [
    cE('prefix', {
      marginRight: '8px',
    }),
    cE('suffix', {
      marginLeft: '8px',
    }),
    cM('disabled', {
      backgroundColor: '#f5f7fa',
      cursor: 'not-allowed',
    }),
  ]),
])

useStyle('o-input', style)
</script>

<template>
  <div class="o-input">
    <span class="o-input-prefix">前缀</span>
    <input type="text">
    <span class="o-input-suffix">后缀</span>
  </div>
  <div class="o-input o-input_disabled">
    <input type="text" disabled>
  </div>
</template>
```

### 动态样式

```vue
<script setup>
import { useBem, useStyle } from '@oiij/css-render'
import { ref, watch } from 'vue'

const { c, cB, cE, cM } = useBem({
  blockPrefix: '.dynamic-',
})

const primaryColor = ref('#409eff')

function generateStyle(color) {
  return c([
    cB('btn', {
      padding: '10px 20px',
      backgroundColor: color,
      color: '#fff',
      borderRadius: '4px',
    }),
  ])
}

useStyle('dynamic-btn', generateStyle(primaryColor.value))

watch(primaryColor, (newColor) => {
  // 重新生成样式
  const style = generateStyle(newColor)
  style.mount({
    id: 'dynamic-btn',
    head: true,
  })
})
</script>

<template>
  <input v-model="primaryColor" type="color">
  <button class="dynamic-btn">
    动态颜色按钮
  </button>
</template>
```

## BEM 命名规范说明

BEM 代表 Block（块）、Element（元素）、Modifier（修饰符）。

### 示例

- **Block**: `.my-button`
- **Element**: `.my-button__icon`
- **Modifier**: `.my-button--primary`

### 生成的类名

使用 `useBem` 会根据配置生成符合 BEM 规范的类名：

```ts
const { cB, cE, cM } = useBem({ blockPrefix: '.my-' })

cB('card', { /* 块样式 */ }) // 生成 .my-card
cE('header', { /* 元素样式 */ }) // 生成 .my-card__header
cM('active', { /* 修饰符样式 */ }) // 生成 .my-card--active
```
