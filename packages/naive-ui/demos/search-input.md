# SearchInput 搜索框

## 功能描述

**SearchInput** 是一个功能强大的搜索框组件，提供了完整的搜索功能，包括自动触发搜索、搜索按钮配置、加载状态显示等特性。它基于 Naive UI 的 Input 和 Button 组件实现，为 Vue 应用提供了流畅的搜索体验。

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

<demo vue="./search-input.vue" title="SearchInput" />

## API

### Props

| Name          | Type                        | Default | Description                                                  |
| ------------- | --------------------------- | ------- | ------------------------------------------------------------ |
| value         | String                      | -       | 文本输入的值                                                 |
| type          | String                      | -       | 输入框类型                                                   |
| placeholder   | String                      | -       | 输入框占位符                                                 |
| autoTrigger   | Boolean&#124;Number         | true    | 是否自动触发搜索，如果值为Number，则设置自动触发的延迟时间。 |
| searchButton  | Boolean or 'text' or 'icon' | true    | 是否显示搜索按钮                                             |
| loading       | Boolean                     | false   | 搜索按钮是否加载中                                           |
| inputProps    | InputProps                  | -       | 输入框配置                                                   |
| buttonProps   | ButtonProps                 | -       | 按钮配置                                                     |
| @update:value | (value:string) => void      | -       | 输入框值 停止输入 时触发                                     |

### Slots

| Name   | Description        |
| ------ | ------------------ |
| icon   | 自定义图标内容     |
| button | 自定义搜索按钮内容 |

## 类型定义

```ts
export type SearchInputProps = {
  value?: string | null
  type?: ButtonProps['type']
  placeholder?: string
  autoTrigger?: boolean | number
  searchButton?: 'text' | 'icon' | boolean
  inputProps?: InputProps
  buttonProps?: ButtonProps
  loading?: boolean
}
```
