# UseContextMenu

## 功能描述

**UseContextMenu** 是一个用于创建自定义右键菜单的 Vue 组合式函数，它可以监听元素的右键点击事件，阻止默认右键菜单，并显示自定义的右键菜单，同时提供了菜单的显示/隐藏控制和点击位置坐标。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/use

# 使用 npm
npm install @oiij/use

# 使用 yarn
yarn add @oiij/use
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0

## 基本使用

<demo vue="./use-context-menu.vue" title="UseContextMenu" />

## API

### `useContextMenu(templateRef?)`

创建右键菜单。

#### 参数

| 参数          | 类型                       | 说明                   |
| ------------- | -------------------------- | ---------------------- |
| `templateRef` | `TemplateRef<HTMLElement>` | 触发右键菜单的元素引用 |

#### 返回值

| 属性                      | 类型                       | 说明         |
| ------------------------- | -------------------------- | ------------ |
| `templateRef`             | `TemplateRef<HTMLElement>` | 元素引用     |
| `visible`                 | `Ref<boolean>`             | 菜单是否可见 |
| `x`                       | `Ref<number>`              | 菜单 X 坐标  |
| `y`                       | `Ref<number>`              | 菜单 Y 坐标  |
| `show()`                  | `Function`                 | 显示菜单     |
| `hide()`                  | `Function`                 | 隐藏菜单     |
| `onContextMenu(callback)` | `Function`                 | 右键点击事件 |

## 类型定义

```ts
export type UseContextMenuReturns = {
  /**
   * 元素引用
   */
  templateRef: TemplateRef<HTMLElement> | undefined
  /**
   * 菜单 X 坐标
   */
  x: Ref<number>
  /**
   * 菜单 Y 坐标
   */
  y: Ref<number>
  /**
   * 菜单是否可见
   */
  visible: Ref<boolean>
  /**
   * 显示菜单
   */
  show: () => void
  /**
   * 隐藏菜单
   */
  hide: () => void
  /**
   * 右键点击事件
   */
  onContextMenu: (callback: (event: MouseEvent) => void) => void
}

export declare function useContextMenu(templateRef?: TemplateRef<HTMLElement>): UseContextMenuReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useContextMenu } from '@oiij/use'
import { ref } from 'vue'

const containerRef = ref()
const { visible, x, y, hide, onContextMenu } = useContextMenu(containerRef)

onContextMenu((event) => {
  console.log('右键点击位置:', event.clientX, event.clientY)
})
</script>

<template>
  <div ref="containerRef">
    右键点击此处
  </div>
  <div v-if="visible" class="context-menu" :style="{ left: `${x}px`, top: `${y}px` }">
    <div @click="hide">
      选项1
    </div>
    <div @click="hide">
      选项2
    </div>
  </div>
</template>

<style>
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
```

### 手动控制

```vue
<script setup>
import { useContextMenu } from '@oiij/use'

const { visible, x, y, show, hide } = useContextMenu()

function handleRightClick(event) {
  show()
  x.value = event.clientX
  y.value = event.clientY
}
</script>

<template>
  <div @contextmenu="handleRightClick">
    右键点击
  </div>
  <div v-if="visible" class="menu">
    <button @click="hide">
      关闭
    </button>
  </div>
</template>
```
