import type { MaybeRefOrGetter } from 'vue'
/**
 * 用于处理数据请求的组合式 API
 * 基于 vue-hooks-plus 的 useRequest，提供分页管理、响应式参数、点路径字段解析等能力
 */
import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'
import { createEventHook } from '@vueuse/core'
import { computed, reactive, ref, toValue } from 'vue'
import useRequest from 'vue-hooks-plus/es/useRequest'

/**
 * 数据对象类型
 */
export type DataObject = Record<string, any>

/**
 * 数据请求字段配置
 * 用于自定义请求参数和响应数据的字段名；list / count 支持点路径（如 'data.items'）
 */
export type DataRequestFields = Record<string, string | undefined> & {
  /** 请求参数里的页码字段名，默认 'page' */
  page?: string
  /** 请求参数里的每页大小字段名，默认 'pageSize' */
  pageSize?: string
  /** 响应数据里的列表字段名，支持点路径（如 'data.items'），默认 'list' */
  list?: string
  /** 响应数据里的总数字段名，支持点路径（如 'data.total'），默认 'count' */
  count?: string
}

/**
 * 数据请求配置选项
 * @template P 请求参数类型
 * @template D 响应数据类型
 */
export type UseDataRequestOptions<P extends DataObject = DataObject, D extends DataObject = DataObject> = {
  /** 默认请求参数，会与内置分页参数合并（内置 page / pageSize 作为兜底，用户显式传入的值优先） */
  defaultParams?: MaybeRefOrGetter<Partial<P>>
  /** 是否手动触发请求，默认 false（组件挂载时自动请求） */
  manual?: boolean
  /** 字段配置，覆盖默认字段名（page / pageSize / list / count） */
  fields?: DataRequestFields
  /** vue-hooks-plus useRequest 原生配置选项 */
  requestOptions?: UseRequestOptions<D, P[]>
  /** vue-hooks-plus useRequest 插件 */
  requestPlugins?: UseRequestPlugin<D, P[]>[]
}

/**
 * 数据请求分页状态
 * 内部状态 ref，可手动写 .value.page = 2；与 paginationProps 共享同一份源数据
 */
export type UseDataRequestPagination = {
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
  /** 总数据量 */
  itemCount: number
  /** 总页数，由 itemCount 和 pageSize 自动计算（读值即可，不要手动改） */
  pageCount: number
}

/**
 * 安全地按点路径从对象取值
 * 支持 'a.b.c' 或 'a[0].b' 两种写法；路径上任何环节为 undefined / null 时返回 fallback
 */
function pathGet(target: unknown, path: string | undefined, fallback?: any) {
  if (target == null || !path)
    return fallback
  const segments = path.split(/[.[\]]/).filter(Boolean)
  let current: any = target
  for (const seg of segments) {
    if (current == null || typeof current !== 'object')
      return fallback
    current = current[seg]
  }
  return current === undefined ? fallback : current
}

/**
 * 解析分页数据：从请求参数读取 page / pageSize，从响应数据（支持点路径）读取 count
 */
function parsePagination<P extends DataObject, D extends DataObject>(
  params: P[] | undefined,
  data: D | undefined,
  fields: Required<DataRequestFields>,
  state: UseDataRequestPagination,
) {
  const param = params?.[0]
  if (param) {
    const _page = Number(pathGet(param, fields.page))
    if (!Number.isNaN(_page))
      state.page = _page
    const _pageSize = Number(pathGet(param, fields.pageSize))
    if (!Number.isNaN(_pageSize))
      state.pageSize = _pageSize
  }
  if (data != null) {
    const _count = Number(pathGet(data, fields.count))
    if (!Number.isNaN(_count))
      state.itemCount = _count
  }
  state.pageCount = Math.max(0, Math.ceil(state.itemCount / state.pageSize))
}

/**
 * 用于处理数据请求的组合式 API
 * 封装 vue-hooks-plus useRequest，统一分页管理、点路径字段解析、事件钩子与分页状态
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 * @param api 请求 API 函数，接收一个 P 类型参数对象，返回 Promise<D>
 * @param options 配置选项
 * @returns 数据请求操作对象
 * @example
 * ```ts
 * const { loading, list, pagination, runParams } = useDataRequest(api, {
 *   defaultParams: { type: 'user' },
 *   fields: { page: 'page', pageSize: 'size', list: 'data.items', count: 'data.total' },
 * })
 * runParams({ page: 2 })
 * ```
 */
export function useDataRequest<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject>(api: (...args: P[]) => Promise<D>, options?: UseDataRequestOptions<P, D>) {
  const { defaultParams, manual, fields, requestOptions, requestPlugins } = options ?? {}

  // 字段配置默认值；page / pageSize 用于 params，list / count 支持点路径
  const _fields: Required<DataRequestFields> = {
    page: 'page',
    pageSize: 'pageSize',
    list: 'list',
    count: 'count',
    ...fields,
  }

  // 分页内部状态（reactive 让手动赋值也能触发更新）
  const paginationState = reactive<UseDataRequestPagination>({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageCount: 0,
  })

  const onPaginationChangeEvent = createEventHook<[UseDataRequestPagination]>()

  const onBeforeEvent = createEventHook<[P[]]>()
  const onSuccessEvent = createEventHook<[D, P[]]>()
  const onErrorEvent = createEventHook<[Error, P[]]>()
  const onFinallyEvent = createEventHook<[P[], D | undefined, Error | undefined]>()

  const { loading, data, error, params, run, runAsync, refresh, refreshAsync, cancel, mutate } = useRequest<D, P[]>(api, {
    // 内置分页字段作为兜底，用户显式传入的 defaultParams 优先，避免用户配置的 page / pageSize 被覆盖
    defaultParams: [
      {
        [_fields.page]: paginationState.page,
        [_fields.pageSize]: paginationState.pageSize,
        ...toValue(defaultParams) as P,
      },
    ],
    manual,
    ...requestOptions,
    // 事件钩子顺序：先触发封装层的 EventHook（允许列表组件在此清空/更新状态），再透传用户显式传入的 requestOptions 钩子
    onBefore: (p) => {
      onBeforeEvent.trigger(p)
      requestOptions?.onBefore?.(p)
    },
    onSuccess: (d, p) => {
      onSuccessEvent.trigger(d, p)
      parsePagination(p, d, _fields, paginationState)
      onPaginationChangeEvent.trigger({ ...paginationState })
      requestOptions?.onSuccess?.(d, p)
    },
    onError: (err, p) => {
      onErrorEvent.trigger(err, p)
      requestOptions?.onError?.(err, p)
    },
    onFinally: (p, d, err) => {
      onFinallyEvent.trigger(p, d, err)
      requestOptions?.onFinally?.(p, d, err)
    },
  }, requestPlugins)

  // 列表数据 computed：支持点路径，undefined 时返回空数组
  const list = computed<R[]>(() => pathGet(data.value, _fields.list, []) ?? [])

  /**
   * 分页状态 ref（向后兼容）
   * 指向同一份 reactive 状态，读取/写入都能触发响应式更新
   */
  const pagination = ref<UseDataRequestPagination>(paginationState)

  /**
   * 分页配置，可直接丢给 `<n-data-table :pagination>` 或 `<n-pagination v-bind>`
   * 只包含分页状态和基础配置（page / pageSize / itemCount / showSizePicker / pageSizes）
   * 注意：不暴露 pageCount，Naive UI NPagination 会基于 itemCount + pageSize 自动计算，两者共存会触发警告
   * 分页切换事件（onChange）在消费者组件里通过 @update:page / @update:page-size 自行绑定
   */
  const paginationProps = computed(() => ({
    page: paginationState.page,
    pageSize: paginationState.pageSize,
    itemCount: paginationState.itemCount,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 50, 100],
  }))

  /**
   * 安全读取当前请求参数（params[0]）
   * 比 params.value?.[0] as P 更干净，不会因为 params 为 undefined 而报类型错误
   * @returns 当前参数对象的副本；params 不存在时返回 {}
   * @example
   * ```ts
   * const currentParams = getQuery()
   * ```
   */
  function getQuery(): P {
    return (params.value?.[0] ?? {}) as P
  }

  /**
   * 合并当前参数（**不发起请求**）
   * 基于 runParams 的参数构造逻辑，但不会调用 run；不原地修改 params 内部对象
   * @param next 要合并的参数
   * @example
   * ```ts
   * setParams({ type: 'admin' })
   * // 之后需要手动 runParams() 或 run()
   * runParams({ page: 1 })
   * ```
   */
  function setParams(next: Partial<P>) {
    if (params.value?.[0]) {
      Object.assign(params.value[0], next)
    }
  }

  /**
   * 基于当前参数 + 增量参数发起请求（同步返回 task）
   * 内部与 runParamsAsync 共用同一段参数构造逻辑
   * @param next 增量参数
   * @returns useRequest 返回的 task 对象
   * @example
   * ```ts
   * runParams({ page: 2 })
   * ```
   */
  function runParams(next: Partial<P>) {
    return run({ ...getQuery(), ...next } as P)
  }

  /**
   * 基于当前参数 + 增量参数发起请求（返回 Promise）
   * @param next 增量参数
   * @returns Promise<D>
   * @example
   * ```ts
   * const result = await runParamsAsync({ page: 2 })
   * ```
   */
  function runParamsAsync(next: Partial<P>) {
    return runAsync({ ...getQuery(), ...next } as P)
  }

  return {
    loading,
    data,
    error,
    params,
    list,
    pagination,
    paginationProps,
    run,
    runAsync,
    refresh,
    refreshAsync,
    cancel,
    mutate,
    getQuery,
    setParams,
    runParams,
    runParamsAsync,
    onBefore: onBeforeEvent.on,
    onSuccess: onSuccessEvent.on,
    onError: onErrorEvent.on,
    onFinally: onFinallyEvent.on,
    onPaginationChange: onPaginationChangeEvent.on,
  }
}

/**
 * useDataRequest 返回类型
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type UseDataRequestReturns<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = ReturnType<typeof useDataRequest<P, D, R>>
