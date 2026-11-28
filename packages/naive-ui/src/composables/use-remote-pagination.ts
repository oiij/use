import type { PaginationProps } from 'naive-ui'
import type { MaybeRefOrGetter } from 'vue'
import type { DataObject, DataRequestFields, UseDataRequestReturns } from './use-data-request'
import { computed, toValue } from 'vue'

/**
 * 创建远程分页的交互处理器与绑定属性
 * 统一处理「切换每页数量回到第一页」以及用户分页配置优先于内部默认值
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 * @param request useDataRequest 返回对象
 * @param fields 分页字段配置
 * @param pagination 用户分页配置，传 boolean / false / undefined 时使用内部默认值
 * @returns handlers 分页事件处理器，bindings 可直接 v-bind 到 NPagination
 * @example
 * ```ts
 * const { handlers, bindings } = useRemotePagination(request, fields, () => props.pagination)
 * // 模板：<NPagination v-bind="bindings" @update:page="handlers.onUpdatePage" />
 * ```
 */
export function useRemotePagination<P extends DataObject, D extends DataObject, R extends DataObject>(
  request: UseDataRequestReturns<P, D, R>,
  fields: Pick<Required<DataRequestFields>, 'page' | 'pageSize'>,
  pagination?: MaybeRefOrGetter<PaginationProps | boolean | undefined>,
) {
  const handlers = {
    /**
     * 切换页码
     * @param page 目标页码
     * @example
     * ```ts
     * handlers.onUpdatePage(2)
     * ```
     */
    onUpdatePage: (page: number) => {
      request.runParams({ [fields.page]: page } as P)
    },
    /**
     * 切换每页数量，同时回到第一页
     * @param pageSize 目标每页数量
     * @example
     * ```ts
     * handlers.onUpdatePageSize(20)
     * ```
     */
    onUpdatePageSize: (pageSize: number) => {
      request.runParams({ [fields.page]: 1, [fields.pageSize]: pageSize } as P)
    },
  }

  const bindings = computed<PaginationProps>(() => {
    const config = toValue(pagination)
    return {
      ...request.paginationProps.value,
      ...(config && typeof config === 'object' ? config : {}),
    }
  })

  return { handlers, bindings }
}
