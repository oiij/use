import type { PartialSelectionOptions, SelectionEvent } from '@viselect/vanilla'
import type { TemplateRef } from 'vue'
import SelectionArea from '@viselect/vanilla'
import { createEventHook } from '@vueuse/core'
import { computed, onUnmounted, reactive, shallowRef, watchEffect } from 'vue'

function appendStyle(id: string, styleText: string) {
  if (typeof document !== 'undefined' && !document.querySelector(`style[oiij-style="${id}"]`)) {
    const style = document.createElement('style')
    style.setAttribute('oiij-style', id)
    style.appendChild(document.createTextNode(styleText))
    document.head.appendChild(style)
  }
}

function getDataKey(el: Element): string | null {
  return el.getAttribute('data-key')
}
/**
 * Vue 3 组合式函数，基于 `@viselect/vanilla` 封装，在指定容器内启用鼠标 / 触摸框选能力。
 *
 * 自动创建 `SelectionArea` 实例、注入默认选区样式、绑定生命周期（卸载时销毁），
 * 维护一个响应式选中集合（基于元素的 `data-key` 属性），并通过事件钩子暴露
 * beforestart / beforedrag / start / move / stop 全流程事件。
 *
 * 内置约定：
 * - 框选开始时，若未按住 Ctrl/Meta 键，会自动清空已有选中
 * - 框选过程中根据 `SelectionEvent.store.changed` 的 added/removed 增删 `selected` 集合
 * - 元素需设置 `data-key` 属性才能被纳入 `selected`
 *
 * @param domRef - 作为框选边界容器的模板引用，类型为 `TemplateRef<HTMLDivElement>`
 * @param options - 透传给 `SelectionArea` 的配置（`boundaries` 由 `domRef` 自动注入），默认 `{}`
 * @returns 包含实例引用、响应式选中集合与事件订阅方法的对象：
 *   - `instanceRef`: `ShallowRef<SelectionArea | undefined>`，底层实例引用
 *   - `selected`: `ComputedRef<string[]>`，当前选中元素的 `data-key` 数组
 *   - `onInit`: 实例创建完成时触发
 *   - `onBeforeStart`: 框选开始前触发，返回 `false` 可阻止
 *   - `onBeforeDrag`: 拖拽开始前触发，返回 `false` 可阻止
 *   - `onStart`: 框选开始时触发
 *   - `onMove`: 框选移动过程中触发
 *   - `onStop`: 框选结束时触发
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useViselect } from '@oiij/viselect'
 *
 * const containerRef = ref<HTMLDivElement>()
 *
 * const { selected, onStop, instanceRef } = useViselect(containerRef, {
 *   selectables: '.item',
 *   behaviour: { overlap: 'keep' },
 * })
 *
 * // 监听响应式选中集合
 * watch(selected, (keys) => {
 *   console.log('当前选中的 data-key：', keys)
 * })
 *
 * onStop(() => {
 *   console.log('框选结束')
 * })
 *
 * // 主动清空选中
 * instanceRef.value?.clearSelection()
 * ```
 *
 * @example
 * 在模板中使用（元素需设置 `data-key`）：
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { useViselect } from '@oiij/viselect'
 *
 * const containerRef = ref<HTMLDivElement>()
 * const { selected } = useViselect(containerRef, { selectables: '.item' })
 * </script>
 *
 * <template>
 *   <div ref="containerRef" class="container">
 *     <div
 *       v-for="i in 20"
 *       :key="i"
 *       class="item"
 *       :data-key="`item-${i}`"
 *     >
 *       {{ i }}
 *     </div>
 *   </div>
 *   <div>当前选中：{{ selected.join(', ') }}</div>
 * </template>
 * ```
 */
export function useViselect(domRef: TemplateRef<HTMLDivElement>, options?: Omit<PartialSelectionOptions, 'boundaries'>) {
  const instanceRef = shallowRef<SelectionArea>()
  const selected = reactive<Set<string>>(new Set())
  const onInitEvent = createEventHook<[SelectionArea]>()
  const onBeforeStartEvent = createEventHook<[SelectionEvent]>()
  const onBeforeDragEvent = createEventHook<[SelectionEvent]>()
  const onStartEvent = createEventHook<[SelectionEvent]>()
  const onMoveEvent = createEventHook<[SelectionEvent]>()
  const onStopEvent = createEventHook<[SelectionEvent]>()

  appendStyle('viselect-style', `
    .selection-area {
      background: rgba(46, 115, 252, 0.11);
      border: 1px solid rgba(98, 155, 255, 0.85);
      border-radius: 0.15em;
    }
    `)

  function render() {
    if (domRef.value && !instanceRef.value) {
      instanceRef.value = new SelectionArea({
        boundaries: domRef.value,
        selectionAreaClass: 'selection-area',
        ...options,
      })
      onInitEvent.trigger(instanceRef.value)
      instanceRef.value.on('beforestart', (evt) => {
        onBeforeStartEvent.trigger(evt)
      })
      instanceRef.value.on('beforedrag', (evt) => {
        onBeforeDragEvent.trigger(evt)
      })
      instanceRef.value.on('start', (evt) => {
        const { event, selection } = evt
        if (!event?.ctrlKey && !event?.metaKey) {
          selection.clearSelection(true, true)
          selected.clear()
        }
        onStartEvent.trigger(evt)
      })
      instanceRef.value.on('move', (evt) => {
        const { store: { changed: { added, removed } } } = evt
        added.forEach((f) => {
          const key = getDataKey(f)
          if (key) {
            selected.add(key)
          }
        })
        removed.forEach((f) => {
          const key = getDataKey(f)
          if (key) {
            selected.delete(key)
          }
        })
        onMoveEvent.trigger(evt)
      })
      instanceRef.value.on('stop', (evt) => {
        onStopEvent.trigger(evt)
      })
    }
  }
  watchEffect(() => {
    if (domRef.value) {
      render()
    }
  })
  onUnmounted(() => {
    instanceRef.value?.destroy()
  })
  return {
    instanceRef,
    selected: computed(() => Array.from(selected)),
    onInit: onInitEvent.on,
    onBeforeStart: onBeforeStartEvent.on,
    onBeforeDrag: onBeforeDragEvent.on,
    onStart: onStartEvent.on,
    onMove: onMoveEvent.on,
    onStop: onStopEvent.on,
  }
}
