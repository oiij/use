import type { EditorOptions } from '@tiptap/core'
import type { Ref } from 'vue'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

import { createEventHook } from '@vueuse/core'
import { isRef, onMounted, onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

export type { EditorOptions }
export function useTipTap(defaultValue?: Ref<string> | string, options?: Partial<EditorOptions>) {
  const value = ref(toValue(defaultValue))
  if (isRef(defaultValue)) {
    watchEffect(() => {
      value.value = toValue(defaultValue.value)
    })
  }
  const domRef = ref<HTMLElement>()
  const editor = shallowRef<Editor | null>(null)
  const onRenderEvent = createEventHook<[Editor ]>()
  function render() {
    if (domRef.value && !editor.value) {
      editor.value = new Editor({
        element: domRef.value,
        extensions: [StarterKit],
        content: value.value,
        ...options,
      })
      onRenderEvent.trigger(editor.value)
      editor.value.on('update', (update) => {
        value.value = update.editor.getHTML()
      })
    }
  }
  function setContent(value: string) {
    editor.value?.setOptions({
      content: value,
    })
  }
  function destroy() {
    editor.value?.destroy()
    editor.value = null
  }
  onMounted(() => {
    render()
  })
  onUnmounted(() => {
    destroy()
  })
  watch(value, (v) => {
    if (editor.value) {
      setContent(v ?? '')
    }
    else {
      render()
    }
  })

  return {
    value,
    domRef,
    editor,
    onRender: onRenderEvent.on,
  }
}
export type TipTapReturns = ReturnType<typeof useTipTap>
