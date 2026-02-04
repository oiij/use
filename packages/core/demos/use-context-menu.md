# UseContextMenu

## 功能描述

**UseContextMenu** 是一个用于创建自定义右键菜单的 Vue 组合式函数，它可以监听元素的右键点击事件，阻止默认右键菜单，并显示自定义的右键菜单，同时提供了菜单的显示/隐藏控制和点击位置坐标。

## 安装

```bash
# 使用 npm
npm install @use/core

# 使用 yarn
yarn add @use/core

# 使用 pnpm
pnpm add @use/core
```

## 基本使用

<demo vue="./use-context-menu.vue" title="UseContextMenu" />

## API

### 函数签名

```ts
declare function useContextMenu(templateRef?: TemplateRef<HTMLElement>): UseContextMenuReturns
```

## 类型定义

```ts
export type UseContextMenuReturns = {
  templateRef: TemplateRef<HTMLElement> | undefined
  x: Ref<number>
  y: Ref<number>
  show: Ref<boolean>
  hide: () => void
  contextMenuEvent: (e: MouseEvent) => void
}

export function useContextMenu(templateRef?: TemplateRef<HTMLElement>): UseContextMenuReturns
```
