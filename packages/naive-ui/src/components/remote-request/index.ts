import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'

export { default as NRemoteRequest } from './RemoteRequest.vue'

export type RemoteRequestFields = Partial<Record<string, string>>
export interface RemoteRequestProps<P extends Record<string, any> = Record<string, any>, D extends Record<string, any> = Record<string, any>> {
  api: (...args: P[]) => Promise<D>
  defaultParams?: P
  manual?: boolean
  fields?: RemoteRequestFields
  requestOptions?: UseRequestOptions<D, P[]>
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}
