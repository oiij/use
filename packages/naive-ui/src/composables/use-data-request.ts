import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'
import { createEventHook } from '@vueuse/core'
import { computed, ref } from 'vue'
import useRequest from 'vue-hooks-plus/es/useRequest'

export type DataObject = Record<string, any>
export type DataRequestFields = Record<string, string | undefined> & {
  page?: string
  pageSize?: string
  list?: string
  count?: string
  rowKey?: string
}

export type UseDataRequestOptions<P extends DataObject = DataObject, D extends DataObject = DataObject> = {
  defaultParams?: Partial<P>
  manual?: boolean
  fields?: DataRequestFields
  requestOptions?: UseRequestOptions<D, P[]>
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}
export type UseDataRequestPagination = {
  page: number
  pageSize: number
  itemCount: number
}
export function useDataRequest<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject>(api: (...args: P[]) => Promise<D>, options?: UseDataRequestOptions<P, D>) {
  const { defaultParams, manual, fields, requestOptions, requestPlugins } = options ?? {}
  const _fields = { page: 'page', pageSize: 'pageSize', list: 'list', count: 'count', ...fields }

  const pagination = ref<UseDataRequestPagination>({
    page: defaultParams?.[_fields.page] ?? 1,
    pageSize: defaultParams?.[_fields.pageSize] ?? 10,
    itemCount: 0,
  })
  const onBeforeEvent = createEventHook<[P[]]>()
  const onSuccessEvent = createEventHook<[D, P[]]>()
  const onErrorEvent = createEventHook<[Error, P[]]>()
  const onFinallyEvent = createEventHook<[P[], D | undefined, Error | undefined]>()

  const { loading, data, error, params, run, runAsync, refresh, refreshAsync, cancel, mutate } = useRequest<D, P[]>(api, {
    defaultParams: [
      {
        [_fields.page]: pagination.value.page,
        [_fields.pageSize]: pagination.value.pageSize,
        ...defaultParams as P,
      },
    ],
    manual,
    ...requestOptions,
    onBefore: (params) => {
      requestOptions?.onBefore?.(params)
      onBeforeEvent.trigger(params)
    },
    onSuccess: (data, params) => {
      requestOptions?.onSuccess?.(data, params)
      onSuccessEvent.trigger(data, params)

      if (_fields.page in params?.[0]) {
        const _page = Number(params?.[0][_fields.page])
        if (!Number.isNaN(_page)) {
          pagination.value.page = _page
        }
      }
      if (_fields.pageSize in params?.[0]) {
        const _pageSize = Number(params?.[0][_fields.pageSize])
        if (!Number.isNaN(_pageSize)) {
          pagination.value.pageSize = _pageSize
        }
      }
      if (_fields.count in data) {
        const _count = Number(data[_fields.count])
        if (!Number.isNaN(_count)) {
          pagination.value.itemCount = _count
        }
      }
    },
    onError: (err, params) => {
      requestOptions?.onError?.(err, params)
      onErrorEvent.trigger(err, params)
    },
    onFinally: (params, data, err) => {
      requestOptions?.onFinally?.(params, data, err)
      onFinallyEvent.trigger(params, data, err)
    },

  }, requestPlugins)

  const list = computed<R[]>(() => data.value?.[_fields.list] ?? [])

  function setParams(_params: Partial<P>) {
    Object.assign(params.value?.[0], _params)
  }
  function runParams(_params: Partial<P>) {
    return run({ ...params.value?.[0], ..._params })
  }
  function runParamsAsync(_params: Partial<P>) {
    return runAsync({ ...params.value?.[0], ..._params })
  }

  return {
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
    onBefore: onBeforeEvent.on,
    onSuccess: onSuccessEvent.on,
    onError: onErrorEvent.on,
    onFinally: onFinallyEvent.on,
  }
}

export type UseDataRequestReturns<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = ReturnType<typeof useDataRequest<P, D, R>>
