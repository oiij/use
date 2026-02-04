# UseCssRender

## 功能描述

**UseCssRender** 是一个用于 CSS 渲染的 Vue 组合式函数，支持 BEM 命名规范和动态样式管理，可用于创建和管理组件的 CSS 样式。

## 安装

```bash
# 使用 npm
npm install @oiij/css-render

# 使用 yarn
yarn add @oiij/css-render

# 使用 pnpm
pnpm add @oiij/css-render
```

## 基本使用

<demo vue="./css-render.vue" title="UseCssRender" />

## API

### 函数签名

```ts
declare function useBem(options?: BemOptions): UseBemReturn
declare function useStyle(mountId: string, style: CNode): void
```

## 类型定义

```ts
type CssRenderBemPlugin = ReturnType<typeof plugin> & {
  __?: 'css-render-bem'
}
type BemOptions = {
  namespace?: string
  blockPrefix?: string
  elementPrefix?: string
  modifierPrefix?: string
}
type UseBemReturn = {
  namespace: string
  blockPrefix: string
  elementPrefix: string
  modifierPrefix: string
  cssr: CssRenderInstance
  plugin: CssRenderBemPlugin
}
declare function useBem(options?: BemOptions): UseBemReturn
declare function useStyle(mountId: string, style: CNode): void
```
