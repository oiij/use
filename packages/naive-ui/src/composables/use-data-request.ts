/**
 * 用于处理数据请求的组合式 API
 * 基于 vue-hooks-plus 的 useRequest，提供分页管理、响应式参数等功能
 */
import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'
import { createEventHook } from '@vueuse/core'
import { computed, ref } from 'vue'
import useRequest from 'vue-hooks-plus/es/useRequest'

/**
 * 数据对象类型
 */
export type DataObject = Record<string, any>

/**
 * 数据请求字段配置
 * 用于自定义请求参数和响应数据的字段名
 */
export type DataRequestFields = Record<string, string | undefined> & {
  /** 页码字段名 */
  page?: string
  /** 每页大小字段名 */
  pageSize?: string
  /** 列表数据字段名 */
  list?: string
  /** 总数字段名 */
  count?: string
  /** 行键字段名 */
  rowKey?: string
}

/**
 * 数据请求配置选项
 * @template P 请求参数类型
 * @template D 响应数据类型
 */
export type UseDataRequestOptions<P extends DataObject = DataObject, D extends DataObject = DataObject> = {
  /** 默认请求参数 */
  defaultParams?: Partial<P>
  /** 是否手动触发请求 */
  manual?: boolean
  /** 字段配置 */
  fields?: DataRequestFields
  /** useRequest 配置选项 */
  requestOptions?: UseRequestOptions<D, P[]>
  /** useRequest 插件 */
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}

/**
 * 数据请求分页信息
 */
export type UseDataRequestPagination = {
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
  /** 总数据量 */
  itemCount: number
}

/**
 * 用于处理数据请求的组合式 API
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 * @param api 请求 API 函数
 * @param options 配置选项
 * @returns 数据请求操作对象
 */
export function useDataRequest<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject>(api: (...args: P[]) => Promise<D>, options?: UseDataRequestOptions<P, D>) {
  const { defaultParams, manual, fields, requestOptions, requestPlugins } = options ?? {}

  // 合并默认字段配置和自定义配置
  const _fields = { page: 'page', pageSize: 'pageSize', list: 'list', count: 'count', ...fields }

  // 分页信息引用
  const pagination = ref<UseDataRequestPagination>({
    page: defaultParams?.[_fields.page] ?? 1,
    pageSize: defaultParams?.[_fields.pageSize] ?? 10,
    itemCount: 0,
  })

  // 事件钩子
  const onBeforeEvent = createEventHook<[P[]]>()
  const onSuccessEvent = createEventHook<[D, P[]]>()
  const onErrorEvent = createEventHook<[Error, P[]]>()
  const onFinallyEvent = createEventHook<[P[], D | undefined, Error | undefined]>()

  // 使用 useRequest 处理请求
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
      // 触发请求前事件
      requestOptions?.onBefore?.(params)
      onBeforeEvent.trigger(params)
    },
    onSuccess: (data, params) => {
      // 触发请求成功事件
      requestOptions?.onSuccess?.(data, params)
      onSuccessEvent.trigger(data, params)

      // 更新分页信息
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
      // 触发请求错误事件
      requestOptions?.onError?.(err, params)
      onErrorEvent.trigger(err, params)
    },
    onFinally: (params, data, err) => {
      // 触发请求完成事件
      requestOptions?.onFinally?.(params, data, err)
      onFinallyEvent.trigger(params, data, err)
    },

  }, requestPlugins)

  // 计算列表数据
  const list = computed<R[]>(() => data.value?.[_fields.list] ?? [])

  /**
   * 设置请求参数
   * @param _params 要设置的参数
   */
  function setParams(_params: Partial<P>) {
    Object.assign(params.value?.[0], _params)
  }

  /**
   * 设置参数并运行请求
   * @param _params 要设置的参数
   * @returns 请求结果
   */
  function runParams(_params: Partial<P>) {
    return run({ ...params.value?.[0], ..._params })
  }

  /**
   * 设置参数并异步运行请求
   * @param _params 要设置的参数
   * @returns 请求结果 Promise
   */
  function runParamsAsync(_params: Partial<P>) {
    return runAsync({ ...params.value?.[0], ..._params })
  }

  return {
    /** 加载状态 */
    loading,
    /** 响应数据 */
    data,
    /** 错误信息 */
    error,
    /** 请求参数 */
    params,
    /** 列表数据 */
    list,
    /** 分页信息 */
    pagination,
    /** 运行请求 */
    run,
    /** 异步运行请求 */
    runAsync,
    /** 刷新请求 */
    refresh,
    /** 异步刷新请求 */
    refreshAsync,
    /** 取消请求 */
    cancel,
    /** 修改响应数据 */
    mutate,
    /** 设置请求参数 */
    setParams,
    /** 设置参数并运行请求 */
    runParams,
    /** 设置参数并异步运行请求 */
    runParamsAsync,
    /** 请求前事件 */
    onBefore: onBeforeEvent.on,
    /** 请求成功事件 */
    onSuccess: onSuccessEvent.on,
    /** 请求错误事件 */
    onError: onErrorEvent.on,
    /** 请求完成事件 */
    onFinally: onFinallyEvent.on,
  }
}

/**
 * useDataRequest 返回类型
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type UseDataRequestReturns<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = ReturnType<typeof useDataRequest<P, D, R>>
