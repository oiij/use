import type { EditorOptions } from '@tiptap/core'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { createEventHook, watchOnce } from '@vueuse/core'
import { onUnmounted, shallowRef } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

export type { EditorOptions }

/**
 * 使用 TipTap 选项类型
 */
export type UseTipTapOptions = {
  /**
   * 编辑器内容
   */
  value?: MaybeRefOrGetter<string>
  /**
   * TipTap 选项
   */
  tiptapOptions?: Partial<EditorOptions>
}

/**
 * 使用 TipTap
 *
 * @param templateRef - 编辑器容器的模板引用
 * @param options - TipTap 选项
 * @returns TipTap 实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useTipTap } from '@oiij/tiptap'
 *
 * const editorRef = ref()
 * const { value, editorInst } = useTipTap(editorRef, {
 *   value: '<p>初始内容</p>'
 * })
 * </script>
 *
 * <template>
 *   <div ref="editorRef"></div>
 * </template>
 * ```
 */
export function useTipTap(templateRef: TemplateRef<HTMLElement>, options?: UseTipTapOptions) {
  const { value, tiptapOptions } = options ?? {}

  const valueRef = watchRefOrGetter(value, setContent)

  const editorInst = shallowRef<Editor | null>(null)

  const onRenderEvent = createEventHook<[Editor]>()

  function render() {
    if (templateRef.value && !editorInst.value) {
      editorInst.value = new Editor({
        element: templateRef.value,
        extensions: [StarterKit],
        content: valueRef.value,
        ...tiptapOptions,
      })
      onRenderEvent.trigger(editorInst.value)
      editorInst.value.on('update', (update) => {
        valueRef.value = update.editor.getHTML()
      })
    }
  }

  /**
   * 设置编辑器内容
   *
   * @param value - 编辑器内容
   *
   * @example
   * ```ts
   * import { useTipTap } from '@oiij/tiptap'
   *
   * const { setContent } = useTipTap(editorRef)
   * setContent('<p>新内容</p>')
   * ```
   */
  function setContent(value?: string) {
    if (value !== undefined && value !== valueRef.value) {
      valueRef.value = value
    }
    editorInst.value?.setOptions({
      content: valueRef.value,
    })
  }

  watchOnce(templateRef, render)

  function destroy() {
    editorInst.value?.destroy()
    editorInst.value = null
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    templateRef,
    value: valueRef,
    editorInst,
    setContent,
    onRender: onRenderEvent.on,
  }
}

/**
 * 使用 TipTap 返回值类型
 */
export type UseTipTapReturns = ReturnType<typeof useTipTap>
