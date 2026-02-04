# TypeWriter 打字组件

## 功能描述

**TypeWriter** 是一个功能强大的打字组件，提供了完整的文字逐字显示能力，包括打字速度控制、Markdown 解析、打字状态事件等特性。它为 Vue 应用提供了生动的文字展示效果。

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

<demo vue="./type-writer.base.vue" title="TypeWriterBase" />

## API

### Props

| Name     | Type                                  | Default | Description          |
| -------- | ------------------------------------- | ------- | -------------------- |
| value    | String                                | -       | 打字内容             |
| typing   | Boolean                               | True    | 启用打字效果         |
| markdown | Boolean                               | False   | 启用 Markdown 解析   |
| step     | Number                                | 1       | 打字速度,每次1个字符 |
| interval | Number                                | 50      | 间隔时间             |
| suffix   | String                                | &#124;  | 后缀内容             |
| @start   | ()=>void                              | -       | 开始打字触发         |
| @update  | (v:{index:number,value:string})=>void | -       | 打字时触发           |
| @stop    | (v:string)=>void                      | -       | 结束打字触发         |

## 类型定义

```ts
export type TypeWriterProps = {
  value: string
  typing?: boolean
  markdown?: boolean
  step?: number
  interval?: number
  suffix?: string
  start?: () => void
  update?: (v: { index: number, value: string }) => void
  stop?: (v: string) => void
}
```
