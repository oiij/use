# UseCssRender

[官方文档](https://css-render.vercel.app/)

## 安装

```bash
pnpm add @oiij/css-render
```

## 示例

<demo vue="./demos/css-render.vue" />

## Types

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
