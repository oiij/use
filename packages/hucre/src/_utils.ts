export const TYPE_MAP = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
} as const

/**
 * 获取嵌套属性的值
 *
 * @param obj - 目标对象
 * @param key - 属性路径，支持点号分隔
 * @returns 属性值，不存在则返回 null
 *
 * @example
 * ```ts
 * const obj = { user: { profile: { name: '张三' } } }
 * getNestedValue(obj, 'user.profile.name') // '张三'
 * getNestedValue(obj, 'user.profile.age') // null
 * ```
 */

export function getNestedValue<T extends Record<string, any>>(obj: T, key: string): any {
  if (!key)
    return null
  return key.split('.').reduce((acc, curr) => {
    return acc && typeof acc === 'object' ? acc[curr] : null
  }, obj)
}
