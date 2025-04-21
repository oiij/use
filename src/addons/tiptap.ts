import type { EditorOptions } from '@tiptap/core'
import type { Ref, ShallowRef } from 'vue'
import { Editor } from '@tiptap/core'

import StarterKit from '@tiptap/starter-kit'
import { isReactive, isRef, onMounted, onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

export type { EditorOptions }
export interface TipTapReturns {
  value: Ref<string | undefined>
  domRef: Ref<HTMLElement | undefined>
  editor: ShallowRef<Editor | undefined>
  onRender: (fn: (editor: Editor) => void) => void
}
export function useTipTap(defaultValue?: Ref<string> | string, options?: Partial<EditorOptions>): TipTapReturns {
  const value = ref(isRef(defaultValue) ? toValue(defaultValue.value) : isReactive(defaultValue) ? toValue(defaultValue) : defaultValue)
  if (isRef(defaultValue)) {
    watchEffect(() => {
      value.value = toValue(defaultValue.value)
    })
  }
  const domRef = ref<HTMLElement>()
  const editor = shallowRef<Editor>()
  let onRender: ((editor: Editor) => void) | null = null

  function render() {
    if (domRef.value && !editor.value) {
      editor.value = new Editor({
        element: domRef.value,
        extensions: [StarterKit],
        content: value.value,
        ...options,
      })
      if (typeof onRender === 'function') {
        onRender(editor.value)
      }
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
    editor.value = undefined
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
    onRender: (fn: (editor: Editor) => void) => {
      onRender = fn
    },
  }
}
