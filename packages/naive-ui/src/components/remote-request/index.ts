import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'

export { default as NRemoteRequest } from './RemoteRequest.vue'

export type RObject = Record<string, any>
export type RemoteRequestFields = Partial<Record<string, string>>
export type RemoteRequestProps<P extends RObject = RObject, D extends RObject = RObject> = & {
  api: (...args: P[]) => Promise<D>
  defaultParams?: Partial<P>
  manual?: boolean
  fields?: RemoteRequestFields
  requestOptions?: UseRequestOptions<D, P[]>
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}
export type RemoteRequestEmits<P extends RObject = RObject, D extends RObject = RObject> = & {
  (e: 'before', params: P[]): void
  (e: 'success', data: D, params: P[]): void
  (e: 'error', err: Error, params: P[]): void
  (e: 'finally', params: P[], data?: D, err?: Error): void
}
