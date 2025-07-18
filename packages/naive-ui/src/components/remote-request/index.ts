import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'

export { default as NRemoteRequest } from './RemoteRequest.vue'

export type RObject = Record<string, any>
export type RemoteRequestFields = Partial<Record<string, string>>
export interface RemoteRequestProps<P extends RObject, D extends RObject> {
  api: (...args: P[]) => Promise<D>
  defaultParams?: P
  manual?: boolean
  fields?: RemoteRequestFields
  requestOptions?: UseRequestOptions<D, P[]>
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}
export interface RemoteRequestEmits<P extends RObject, D extends RObject> {
  (e: 'before', params: P[]): void
  (e: 'success', data: D, params: P[]): void
  (e: 'error', err: Error, params: P[]): void
  (e: 'finally', params: P[], data?: D, err?: Error): void
}
