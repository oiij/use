import type { InjectionKey } from 'vue'

/**
 * 创建一个 Vue 依赖注入键
 * @template T - 注入值的类型
 * @param key - 用于标识注入键的字符串描述
 * @returns 返回一个 Symbol 类型的注入键
 * @example
 * ```ts
 * // 创建一个用户注入键
 * const userKey = useInjectionKey<User>('user')
 *
 * // 在父组件中提供值
 * provide(userKey, { name: 'John', age: 25 })
 *
 * // 在子组件中注入值
 * const user = inject(userKey)
 * ```
 */
export function useInjectionKey<T>(key: string): InjectionKey<T> {
  return Symbol(key)
}

/**
 * useInjectionKey 函数的返回类型
 * @template T - 注入值的类型
 */
export type UseInjectionKeyReturns<T> = ReturnType<typeof useInjectionKey<T>>
