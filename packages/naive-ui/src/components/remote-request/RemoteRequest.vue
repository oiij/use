<script setup lang='ts' generic="P extends DataObject, D extends DataObject, R extends DataObject">
import type { DataObject } from '../../composables/use-data-request'
import type { RemoteRequestEmits, RemoteRequestExpose, RemoteRequestProps } from './index'
import { computed } from 'vue'
import { useDataRequest } from '../../composables/use-data-request'

const { api, defaultParams, manual, fields, requestOptions, requestPlugins } = defineProps<RemoteRequestProps<P, D>>()
const emit = defineEmits<RemoteRequestEmits<P, D>>()
const _fields = { page: 'page', pageSize: 'pageSize', list: 'list', count: 'count', ...fields }
const { loading, data, error, params, list, pagination, run, runAsync, refresh, refreshAsync, cancel, mutate, setParams, runParams, runParamsAsync, onBefore, onSuccess, onError, onFinally } = useDataRequest<P, D, R>(api, {
  defaultParams,
  fields: _fields,
  manual,
  requestOptions,
  requestPlugins,
})
onBefore((params) => {
  emit('before', params)
})
onSuccess((data, params) => {
  emit('success', data, params)
})
onError((err, params) => {
  emit('error', err, params)
})
onFinally((params, data, err) => {
  emit('finally', params, data, err)
})
const expose: RemoteRequestExpose<P, D, R> = {
  loading,
  data,
  error,
  params,
  list,
  pagination,
  run,
  runAsync,
  refresh,
  refreshAsync,
  cancel,
  mutate,
  setParams,
  runParams,
  runParamsAsync,
  onBefore,
  onSuccess,
  onError,
  onFinally,
}
const templateBind = computed(() => {
  return {
    ...expose,
    loading: loading.value,
    data: data.value,
    error: error.value,
    params: params.value,
    list: list.value,
    pagination: pagination.value,
  }
})
defineExpose(expose)
</script>

<template>
  <slot
    v-bind="templateBind"
  />
</template>

<style scoped>

</style>
