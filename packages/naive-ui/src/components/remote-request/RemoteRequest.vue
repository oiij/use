<script setup lang='ts' generic="P extends DataObject, D extends DataObject, R extends DataObject">
import type { DataObject } from '../../composables/use-data-request'
import type { RemoteRequestEmits, RemoteRequestExpose, RemoteRequestFields, RemoteRequestProps } from './index'
import { useRemoteRequest } from '../../composables/use-remote-request'
import { createExpose } from '../_utils/expose'
import { mergeFields } from '../_utils/fields'

const { api, defaultParams, manual, fields, requestOptions, requestPlugins } = defineProps<RemoteRequestProps<P, D>>()
const emit = defineEmits<RemoteRequestEmits<P, D>>()

const _fields = mergeFields<Required<RemoteRequestFields>>({
  page: 'page',
  pageSize: 'pageSize',
  list: 'list',
  count: 'count',
}, fields)

const request = useRemoteRequest<P, D, R>(api, {
  defaultParams,
  fields: _fields,
  manual,
  requestOptions,
  requestPlugins,
}, emit)

const expose: RemoteRequestExpose<P, D, R> = request
const { slotProps } = createExpose(expose)

defineExpose(expose)
</script>

<template>
  <slot v-bind="slotProps" />
</template>
