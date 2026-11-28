import type { DataObject, UseDataRequestOptions, UseDataRequestReturns } from './use-data-request'
import { useDataRequest } from './use-data-request'

/**
 * 远程请求事件桥接类型
 * 与 RemoteRequest 组件事件保持一致，可直接传入组件 emit
 * @template P 请求参数类型
 * @template D 响应数据类型
 */
export type RemoteRequestEmitFn<P extends DataObject = DataObject, D extends DataObject = DataObject> = {
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
 * 将 useDataRequest 的请求钩子桥接到组件 emit
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 * @param request useDataRequest 返回对象
 * @param emit 组件 emit 函数
 * @example
 * ```ts
 * const request = useDataRequest(api)
 * bindRemoteRequestEmits(request, emit)
 * ```
 */
export function bindRemoteRequestEmits<P extends DataObject, D extends DataObject, R extends DataObject>(
  request: UseDataRequestReturns<P, D, R>,
  emit: RemoteRequestEmitFn<P, D>,
) {
  request.onBefore(params => emit('before', params))
  request.onSuccess((data, params) => emit('success', data, params))
  request.onError((err, params) => emit('error', err, params))
  request.onFinally((params, data, err) => emit('finally', params, data, err))
}

/**
 * 创建远程请求，并可选地把请求钩子桥接到组件事件
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 * @param api 请求 API 函数
 * @param options 请求配置选项
 * @param emit 可选的组件 emit，用于桥接 before / success / error / finally
 * @returns useDataRequest 返回对象
 * @example
 * ```ts
 * const request = useRemoteRequest(api, { manual: true, fields }, emit)
 * const { loading, list, runParams } = request
 * ```
 */
export function useRemoteRequest<P extends DataObject, D extends DataObject, R extends DataObject>(
  api: (...args: P[]) => Promise<D>,
  options?: UseDataRequestOptions<P, D>,
  emit?: RemoteRequestEmitFn<P, D>,
): UseDataRequestReturns<P, D, R> {
  const request = useDataRequest<P, D, R>(api, options)
  if (emit)
    bindRemoteRequestEmits(request, emit)
  return request
}
