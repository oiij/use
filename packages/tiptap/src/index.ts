import type { EditorOptions } from '@tiptap/core'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { createEventHook, watchOnce } from '@vueuse/core'
import { onUnmounted, shallowRef } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

export type { EditorOptions }
export type UseTipTapOptions = {
  value?: MaybeRefOrGetter<string>
  tiptapOptions?: Partial<EditorOptions>
}
export function useTipTap(templateRef: TemplateRef<HTMLElement>, options?: UseTipTapOptions) {
  const { value, tiptapOptions } = options ?? {}

  const valueRef = watchRefOrGetter(value, setContent)

  const editorInst = shallowRef<Editor | null>(null)

  const onRenderEvent = createEventHook<[Editor]>()

  function render() {
    if (templateRef.value) {
      if (!editorInst.value) {
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
  }
  function setContent(value?: string) {
    if (!value) {
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
export type UseTipTapReturns = ReturnType<typeof useTipTap>
