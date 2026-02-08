import { ref } from 'vue'

/**
 * 布尔值状态管理的组合式函数
 *
 * @param initValue - 初始布尔值，默认为 false
 * @returns 包含状态和操作方法的对象
 *
 * @example
 * ```ts
 * // 基本用法
 * const { value: isOpen, setTrue, setFalse, toggle } = useBoolean()
 *
 * // 初始值为 true
 * const { value: isVisible, setValue } = useBoolean(true)
 *
 * // 使用场景示例
 * function handleClick() {
 *   toggle() // 切换状态
 * }
 *
 * function openModal() {
 *   setTrue() // 设置为 true
 * }
 *
 * function closeModal() {
 *   setFalse() // 设置为 false
 * }
 * ```
 */
export function useBoolean(initValue = false) {
  // 布尔值状态的响应式引用
  const value = ref(initValue)

  /**
   * 设置布尔值
   * @param v - 要设置的布尔值
   */
  function setValue(v: boolean) {
    value.value = v
  }

  /**
   * 设置为 true
   */
  function setTrue() {
    setValue(true)
  }

  /**
   * 设置为 false
   */
  function setFalse() {
    setValue(false)
  }

  /**
   * 切换布尔值状态
   */
  function toggle() {
    setValue(!value.value)
  }

  return {
    // 响应式布尔值状态
    value,
    // 设置为 true 的方法
    setTrue,
    // 设置为 false 的方法
    setFalse,
    // 切换状态的方法
    toggle,
    // 自定义设置布尔值的方法
    setValue,
  }
}

/**
 * useBoolean 函数的返回类型
 */
export type UseBooleanReturns = ReturnType<typeof useBoolean>
