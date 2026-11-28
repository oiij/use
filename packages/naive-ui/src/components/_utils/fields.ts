/**
 * 合并字段配置与默认值
 * 用户传入的 fields 会覆盖 defaults 中的同名字段
 * @template T 字段配置类型
 * @param defaults 默认字段配置
 * @param fields 用户字段配置
 * @returns 合并后的字段配置
 * @example
 * ```ts
 * const fields = mergeFields<Required<DataTablePlusFields>>(
 *   { page: 'page', pageSize: 'pageSize' },
 *   { page: 'current' },
 * )
 * ```
 */
export function mergeFields<T extends Record<string, string | undefined>>(defaults: T, fields?: Partial<T>): T {
  return { ...defaults, ...fields } as T
}
