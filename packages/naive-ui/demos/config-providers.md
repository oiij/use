# ConfigProviders 全局化配置

## Demo

<demo vue="./config-providers.vue" title="ConfigProviders" />

## Props

| Name                      | Type                                                                                                                | Default | Description                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------ |
| configProviderProps       | [ConfigProviderProps](https://www.naiveui.com/zh-CN/light/components/config-provider#API)                           | -       | ConfigProviderProps 配置       |
| loadingBarProps           | [LoadingBarProviderProps](https://www.naiveui.com/zh-CN/light/components/loading-bar#LoadingBarProvider-Props)      | -       | LoadingBarProviderProps 配置   |
| fullLoadingProps          | FullLoadingProps                                                                                                    | -       | FullLoadingProps 配置          |
| dialogProviderProps       | DialogProviderProps                                                                                                 | -       | DialogProviderProps 配置       |
| modalProviderProps        | [ModalProviderProps](https://www.naiveui.com/zh-CN/light/components/modal#ModalProvider-Props)                      | -       | ModalProviderProps 配置        |
| notificationProviderProps | [NotificationProviderProps](https://www.naiveui.com/zh-CN/light/components/notification#NotificationProvider-Props) | -       | NotificationProviderProps 配置 |
| messageProviderProps      | [MessageProviderProps](https://www.naiveui.com/zh-CN/light/components/message#MessageProvider-Props)                | -       | MessageProviderProps 配置      |

## Slots

| Name    | Description |
| ------- | ----------- |
| default | 默认插槽    |

## Types

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
