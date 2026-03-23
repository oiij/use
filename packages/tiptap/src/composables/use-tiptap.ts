import type { EditorOptions } from '@tiptap/core'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { Editor } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import { createEventHook, watchOnce } from '@vueuse/core'
import { onUnmounted, shallowRef } from 'vue'
import { watchRefOrGetter } from '../_utils'

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

  const valueRef = watchRefOrGetter(value, () => setContent())

  const editorInst = shallowRef<Editor | null>(null)

  const onRenderedEvent = createEventHook<[Editor]>()
  const onUpdateValueEvent = createEventHook<[string]>()

  function render() {
    if (templateRef.value && !editorInst.value) {
      editorInst.value = new Editor({
        element: templateRef.value,
        extensions: [StarterKit, Image],
        content: valueRef.value,
        ...tiptapOptions,
      })
      onRenderedEvent.trigger(editorInst.value)
      editorInst.value.on('update', (update) => {
        valueRef.value = update.editor.getHTML()
        onUpdateValueEvent.trigger(valueRef.value)
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
    if (value !== undefined) {
      valueRef.value = value
    }
    const currentContent = editorInst.value?.getHTML()
    if (valueRef.value !== undefined && valueRef.value !== currentContent) {
      editorInst.value?.commands.setContent(valueRef.value)
    }
  }

  watchOnce(templateRef, render)

  /**
   * 插入图片
   *
   * @param src - 图片地址
   * @param alt - 图片描述（可选）
   * @param title - 图片标题（可选）
   *
   * @example
   * ```ts
   * import { useTipTap } from '@oiij/tiptap'
   *
   * const { insertImage } = useTipTap(editorRef)
   * insertImage('https://example.com/image.png', '图片描述')
   * ```
   */
  function insertImage(src: string, alt?: string, title?: string) {
    if (editorInst.value) {
      editorInst.value.chain().focus().setImage({ src, alt, title }).run()
    }
  }

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
    insertImage,
    onRendered: onRenderedEvent.on,
    onUpdateValue: onUpdateValueEvent.on,
  }
}

/**
 * 使用 TipTap 返回值类型
 */
export type UseTipTapReturns = ReturnType<typeof useTipTap>
