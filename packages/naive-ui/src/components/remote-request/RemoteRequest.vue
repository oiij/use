<script setup lang='ts'
  generic="
    P extends RObject,
    D extends RObject,
  "
>
import type { RemoteRequestEmits, RemoteRequestProps, RObject } from './index'
import useRequest from 'vue-hooks-plus/es/useRequest'

const {
  api,
  defaultParams: propsParams,
  manual,
  fields,
  requestOptions,
  requestPlugins,
} = defineProps<RemoteRequestProps<P, D>>()
const emit = defineEmits<RemoteRequestEmits<P, D>>()
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
