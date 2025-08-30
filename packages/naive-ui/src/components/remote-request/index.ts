import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'
import type { DataObject, DataRequestFields, UseDataRequestReturns } from '../../composables/useDataRequest'

export { default as NRemoteRequest } from './RemoteRequest.vue'

export type RemoteRequestFields = DataRequestFields & {}
export type RemoteRequestExpose<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = UseDataRequestReturns<P, D, R>
export type RemoteRequestProps<P extends DataObject = DataObject, D extends DataObject = DataObject> = & {
  api: (...args: P[]) => Promise<D>
  defaultParams?: Partial<P>
  manual?: boolean
  fields?: RemoteRequestFields
  requestOptions?: UseRequestOptions<D, P[]>
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}
export type RemoteRequestEmits<P extends DataObject = DataObject, D extends DataObject = DataObject> = & {
  (e: 'before', params: P[]): void
  (e: 'success', data: D, params: P[]): void
  (e: 'error', err: Error, params: P[]): void
  (e: 'finally', params: P[], data?: D, err?: Error): void
}
