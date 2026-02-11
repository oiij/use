import type { ConfigProviderProps, DialogProviderInst, DialogProviderProps, LoadingBarProviderInst, LoadingBarProviderProps, MessageProviderInst, MessageProviderProps, ModalProviderInst, ModalProviderProps, NotificationProviderInst, NotificationProviderProps } from 'naive-ui'
import type { useLoading } from '../../composables'
import type { ClassStyle } from '../data-table-plus'
import type { LoadingProviderProps } from '../loading-provider'

export { default as NConfigProviders } from './ConfigProviders.vue'

/**
 * 配置提供者组件属性
 */
export type ConfigProvidersProps = {
  /** 是否应用全局样式 */
  globalStyle?: boolean
  /** 配置提供者属性 */
  configProviderProps?: ConfigProviderProps & ClassStyle
  /** 加载条提供者属性 */
  loadingBarProviderProps?: LoadingBarProviderProps & ClassStyle
  /** 加载提供者属性 */
  loadingProviderProps?: LoadingProviderProps & ClassStyle
  /** 对话框提供者属性 */
  dialogProviderProps?: DialogProviderProps & ClassStyle
  /** 模态框提供者属性 */
  modalProviderProps?: ModalProviderProps & ClassStyle
  /** 通知提供者属性 */
  notificationProviderProps?: NotificationProviderProps & ClassStyle
  /** 消息提供者属性 */
  messageProviderProps?: MessageProviderProps & ClassStyle
}

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    /** 对话框实例 */
    $dialog: DialogProviderInst
    /** 加载实例 */
    $loading: ReturnType<typeof useLoading>
    /** 加载条实例 */
    $loadingBar: LoadingBarProviderInst
    /** 消息实例 */
    $message: MessageProviderInst
    /** 模态框实例 */
    $modal: ModalProviderInst
    /** 通知实例 */
    $notification: NotificationProviderInst
  }
}
