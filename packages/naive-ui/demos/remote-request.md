# RemoteRequest 请求

## 功能描述

**RemoteRequest** 是一个功能强大的远程请求组件，提供了完整的异步数据请求能力，包括 API 调用、参数管理、请求状态控制等特性。它基于 VueUse 的 useRequest 实现，为 Vue 应用提供了高效的数据请求解决方案。

## 安装

```bash
# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui

# 使用 pnpm
pnpm add @oiij/naive-ui
```

## 基本使用

<demo vue="./remote-request.vue" title="RemoteRequest" />

## API

### Props

| Name           | Type                     | Default | Description                    |
| -------------- | ------------------------ | ------- | ------------------------------ |
| api            | (params:Object)=>Promise | -       | 异步接口返回的数据的方法       |
| defaultParams  | Object                   | -       | 默认的参数                     |
| manual         | boolean                  | -       | 是否手动触发请求               |
| fields         | Object                   | -       | 内置参数的字段                 |
| requestOptions | UseRequestOptions        | -       | VueHooks UseRequest 的请求配置 |
| requestPlugins | UseRequestPlugin[]       | -       | VueHooks UseRequest 的插件配置 |

### Emits

| Name    | Type                                         | Description        |
| ------- | -------------------------------------------- | ------------------ |
| before  | (params: D[]) => void                        | 数据加载前         |
| success | (data: D, params: P[]) => void               | 数据加载完成       |
| error   | (error: Error, params: P[]) => void          | 数据加载失败       |
| finally | params: (P[], data?: D, err?: Error) => void | 数据加载完成或失败 |

## 类型定义

```ts
export type RemoteRequestProps<P extends DataObject = DataObject, D extends DataObject = DataObject> = {
  api: (params: P) => Promise<D>
  defaultParams?: P
  manual?: boolean
  fields?: DataRequestFields
  requestOptions?: UseRequestOptions
  requestPlugins?: UseRequestPlugin[]
}

export type RemoteRequestEmits<P extends DataObject = DataObject, D extends DataObject = DataObject> = {
  before: (params: P[]) => void
  success: (data: D, params: P[]) => void
  error: (error: Error, params: P[]) => void
  finally: (params: P[], data?: D, err?: Error) => void
}
```
