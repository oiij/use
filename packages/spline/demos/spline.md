# UseSpline

## 功能描述

**UseSpline** 是一个用于加载 Spline 3D 模型的 Vue 组合式函数，提供简单易用的 API 来加载和管理 Spline 场景，支持响应式场景 URL、事件监听和自动资源清理。

## 安装

```bash
# 使用 npm
npm install @oiij/spline @splinetool/runtime

# 使用 yarn
yarn add @oiij/spline @splinetool/runtime

# 使用 pnpm
pnpm add @oiij/spline @splinetool/runtime
```

## 基本使用

<demo vue="./spline.vue" title="UseSpline" />

## API

### 函数签名

```ts
declare function useSpline(templateRef: TemplateRef<HTMLElement>, options?: UseSplineOptions): UseSplineReturns
```

## 类型定义

```ts
type UseSplineOptions = {
  scene?: MaybeRefOrGetter<string>
  manual?: boolean
  disableAutoLoad?: boolean
}

type UseSplineReturns = {
  templateRef: Readonly<ShallowRef<HTMLElement | null>>
  app: Ref<Application | null>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  width: Ref<number>
  height: Ref<number>
  load: (sceneUrl: string) => Promise<void>
  reload: () => void
  dispose: () => void
  onCreated: EventHookOn<[Application]>
  onLoaded: EventHookOn<[Application]>
  onError: EventHookOn<[Error]>
  onDisposed: EventHookOn<[]>
}
```
