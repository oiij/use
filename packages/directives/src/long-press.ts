import type { Directive, DirectiveBinding } from 'vue'

/**
 * 绑定值类型
 */
type BindingValue = (ev: MouseEvent | TouchEvent) => void

/**
 * 目标元素类型
 */
type TargetElement = HTMLElement & {
  _long_press_duration: number
  _long_press_callBack?: BindingValue
  _long_press_controller?: AbortController
}

function setValue(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
  target._long_press_duration = binding.arg ? Number(binding.arg) : 3000
  target._long_press_callBack = binding.value
}

/**
 * 长按指令
 *
 * 当元素被长按指定时间后触发回调函数
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 基本用法，默认 3000ms 长按 -->
 *   <button v-long-press="handleLongPress">长按按钮</button>
 *
 *   <!-- 自定义长按时间，1000ms 长按 -->
 *   <button v-long-press:1000="handleLongPress">长按按钮</button>
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 *
 * const handleLongPress = (event) => {
 *   console.log('长按事件触发', event)
 * }
 * </script>
 * ```
 */
export const longPress: Directive<TargetElement, BindingValue> = {
  beforeMount(target, binding) {
    setValue(target, binding)
    target._long_press_controller = new AbortController()

    let timer: any = null
    function set(ev: MouseEvent | TouchEvent) {
      if (ev.type === 'click' || ('button' in ev && ev.button !== 0))
        return
      ev.preventDefault()
      if (timer === null) {
        timer = setTimeout(() => {
          typeof target._long_press_callBack === 'function' && target._long_press_callBack(ev)
          timer = null
        }, target._long_press_duration)
      }
    }
    function cancel() {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
    }
    target.addEventListener('pointerdown', set, {
      signal: target._long_press_controller.signal,
    })
    target.addEventListener('click', cancel, {
      signal: target._long_press_controller.signal,
    })
    target.addEventListener('mouseout', cancel, {
      signal: target._long_press_controller.signal,
    })
    target.addEventListener('touchend', cancel, {
      signal: target._long_press_controller.signal,
    })
    target.addEventListener('touchcancel', cancel, {
      signal: target._long_press_controller.signal,
    })
  },
  updated(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    setValue(target, binding)
  },
  unmounted(target: TargetElement) {
    target._long_press_controller?.abort()
  },
}
