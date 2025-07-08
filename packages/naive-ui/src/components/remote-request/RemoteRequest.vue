<script setup lang='ts'
  generic="
    P extends  Record<string, any> = Record<string, any>,
    D extends  Record<string, any> = Record<string, any>,
  "
>
import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'
import type { RemoteRequestFields } from '.'
import useRequest from 'vue-hooks-plus/es/useRequest'

const {
  api,
  defaultParams: propsParams,
  manual,
  fields,
  requestOptions,
  requestPlugins,
} = defineProps<{
  api: (params: P) => Promise<D>
  defaultParams?: P
  manual?: boolean
  fields?: RemoteRequestFields
  requestOptions?: UseRequestOptions<D, P[]>
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}>()
const emit = defineEmits<{
  (e: 'before', params: P[]): void
  (e: 'success', data: D, params: P[]): void
  (e: 'error', err: Error, params: P[]): void
  (e: 'finally', params: P[], data?: D, err?: Error): void
}>()
const _fields = { page: 'page', pageSize: 'pageSize', search: 'search', list: 'list', count: 'count', rowKey: 'id', ...fields }

const { loading, data, error, params, run, runAsync, refresh, refreshAsync, cancel, mutate } = useRequest<D, P[]>(api, {
  defaultParams: [
    {
      [_fields.page]: 1,
      [_fields.pageSize]: 10,
      [_fields.search]: '',
      ...propsParams as P,
    },
  ],
  manual,
  ...requestOptions,
  onBefore: (params) => {
    requestOptions?.onBefore?.(params)
    emit('before', params)
  },
  onSuccess: (data, params) => {
    requestOptions?.onSuccess?.(data, params)
    emit('success', data, params)
  },
  onError: (err, params) => {
    requestOptions?.onError?.(err, params)
    emit('error', err, params)
  },
  onFinally: (params, data, err) => {
    requestOptions?.onFinally?.(params, data, err)
    emit('finally', params, data, err)
  },

}, requestPlugins)

const exposeRefs = {
  loading,
  data,
  error,
  params,
}
const exposeActions = {
  run,
  runAsync,
  refresh,
  refreshAsync,
  cancel,
  mutate,
  setParam: (_params: Partial<P>) => {
    Object.assign(params.value[0], _params)
  },
  runParam: (_params: Partial<P>) => {
    return run(Object.assign(params.value[0], _params))
  },
  runParamAsync: async (_params: Partial<P>) => {
    return runAsync(Object.assign(params.value[0], _params))
  },
}
defineExpose({ refs: exposeRefs, actions: exposeActions })
</script>

<template>
  <slot :refs="exposeRefs" :actions="exposeActions" />
</template>

<style scoped>

</style>
