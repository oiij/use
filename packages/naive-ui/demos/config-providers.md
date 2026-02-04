# ConfigProviders 全局化配置

## 功能描述

**ConfigProviders** 是一个功能强大的 Naive UI 全局化配置组件，提供了完整的应用级配置能力，包括主题设置、语言配置、全局样式、各种 Provider 配置等特性。它基于 Naive UI 的多个 Provider 组件实现，为 Vue 应用提供了统一的全局配置管理体验。

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

<demo vue="./config-providers.vue" title="ConfigProviders" />

## API

### Props

| Name                      | Type                                                                                                                | Default | Description                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------ |
| configProviderProps       | [ConfigProviderProps](https://www.naiveui.com/zh-CN/light/components/config-provider#API)                           | -       | ConfigProviderProps 配置       |
| loadingBarProps           | [LoadingBarProviderProps](https://www.naiveui.com/zh-CN/light/components/loading-bar#LoadingBarProvider-Props)      | -       | LoadingBarProviderProps 配置   |
| fullLoadingProps          | FullLoadingProps                                                                                                    | -       | FullLoadingProps 配置          |
| dialogProviderProps       | DialogProviderProps                                                                                                 | -       | DialogProviderProps 配置       |
| modalProviderProps        | [ModalProviderProps](https://www.naiveui.com/zh-CN/light/components/modal#ModalProvider-Props)                      | -       | ModalProviderProps 配置        |
| notificationProviderProps | [NotificationProviderProps](https://www.naiveui.com/zh-CN/light/components/notification#NotificationProvider-Props) | -       | NotificationProviderProps 配置 |
| messageProviderProps      | [MessageProviderProps](https://www.naiveui.com/zh-CN/light/components/message#MessageProvider-Props)                | -       | MessageProviderProps 配置      |

### Slots

| Name    | Description |
| ------- | ----------- |
| default | 默认插槽    |

## 类型定义

```ts
export type ConfigProvidersProps = {
  globalStyle?: boolean
  configProviderProps?: ConfigProviderProps
  loadingBarProps?: LoadingBarProviderProps
  fullLoadingProps?: FullLoadingProps
  dialogProviderProps?: DialogProviderProps
  modalProviderProps?: ModalProviderProps
  notificationProviderProps?: NotificationProviderProps
  messageProviderProps?: MessageProviderProps
}

export type LoadingIns = {
  start: () => void
  finish: () => void
}

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    $dialog: DialogProviderInst
    $loading: LoadingIns
    $loadingBar: LoadingBarProviderInst
    $message: MessageProviderInst
    $modal: ModalProviderInst
    $notification: NotificationProviderInst
  }
}
```
