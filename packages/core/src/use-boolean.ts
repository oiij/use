import { ref } from 'vue'

/**
 * 布尔值状态管理的组合式函数
 * 提供布尔值的设置、切换等操作方法
 *
 * @param initValue 初始布尔值，默认为 false
 * @returns 包含状态和操作方法的对象
 *
 * @example
 * // 基本用法
 * const { value: isOpen, setTrue, setFalse, toggle } = useBoolean()
 *
 * // 初始值为 true
 * const { value: isVisible, setValue } = useBoolean(true)
 *
 * @example
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
 */
export function useBoolean(initValue = false) {
  const value = ref(initValue)

  /**
   * 设置布尔值
   * 直接设置布尔状态为指定值
   * @param v 要设置的布尔值
   * @example
   * setValue(true)  // 设置为 true
   * setValue(false) // 设置为 false
   */
  function setValue(v: boolean) {
    value.value = v
  }

  /**
   * 设置为 true
   * 将布尔状态设置为 true
   * @example
   * setTrue() // 状态变为 true
   */
  function setTrue() {
    setValue(true)
  }

  /**
   * 设置为 false
   * 将布尔状态设置为 false
   * @example
   * setFalse() // 状态变为 false
   */
  function setFalse() {
    setValue(false)
  }

  /**
   * 切换布尔值状态
   * 在当前 true/false 状态之间切换
   * @example
   * toggle() // true 变 false，false 变 true
   */
  function toggle() {
    setValue(!value.value)
  }

  return {
    value,
    setTrue,
    setFalse,
    toggle,
    setValue,
  }
}

/**
 * useBoolean 函数的返回类型
 * 包含布尔值状态和操作方法
 * @example
 * const bool: UseBooleanReturns = useBoolean(false)
 */
export type UseBooleanReturns = ReturnType<typeof useBoolean>
