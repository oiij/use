import type { ComponentExposed } from 'vue-component-type-helpers'
import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'
import type { DataObject, DataRequestFields, UseDataRequestReturns } from '../../composables/use-data-request'
import type RemoteRequest from './RemoteRequest.vue'

export { default as NRemoteRequest } from './RemoteRequest.vue'

/**
 * 远程请求字段配置
 */
export type RemoteRequestFields = DataRequestFields & {}

/**
 * 远程请求暴露的方法
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type RemoteRequestExpose<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = UseDataRequestReturns<P, D, R>

/**
 * 远程请求属性
 * @template P 请求参数类型
 * @template D 响应数据类型
 */
export type RemoteRequestProps<P extends DataObject = DataObject, D extends DataObject = DataObject> = {
  /** API 函数 */
  api: (...args: P[]) => Promise<D>
  /** 默认请求参数 */
  defaultParams?: Partial<P>
  /** 是否手动触发 */
  manual?: boolean
  /** 字段配置 */
  fields?: RemoteRequestFields
  /** 请求选项 */
  requestOptions?: UseRequestOptions<D, P[]>
  /** 请求插件 */
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}

/**
 * 远程请求事件
 * @template P 请求参数类型
 * @template D 响应数据类型
 */
export type RemoteRequestEmits<P extends DataObject = DataObject, D extends DataObject = DataObject> = {
  /** 请求前事件 */
  (e: 'before', params: P[]): void
  /** 请求成功事件 */
  (e: 'success', data: D, params: P[]): void
  /** 请求错误事件 */
  (e: 'error', err: Error, params: P[]): void
  /** 请求完成事件 */
  (e: 'finally', params: P[], data?: D, err?: Error): void
}

/**
 * 远程请求实例类型
 */
export type RemoteRequestInst = ComponentExposed<typeof RemoteRequest>
