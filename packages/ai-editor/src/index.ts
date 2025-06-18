import type { AiEditorOptions } from 'aieditor'
import type { ComputedRef, Ref } from 'vue'
import { createEventHook } from '@vueuse/core'
import { AiEditor } from 'aieditor'
import { onMounted, onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'
import 'aieditor/dist/style.css'

export type {
  AiEditorOptions,
}
export function useAiEditor(defaultValue?: Ref<string> | string, darkMode?: ComputedRef<boolean>, language?: ComputedRef<'zh' | 'en'>, options?: Omit<AiEditorOptions, 'element'>) {
  const value = ref(toValue(defaultValue))
  watchEffect(() => {
    value.value = toValue(defaultValue)
  })
  const domRef = ref<HTMLElement>()
  const aiEditor = shallowRef<AiEditor | null>(null)
  const readonly = ref(false)
  watch(value, (v) => {
    aiEditor.value?.setContent(v ?? '')
  })
  watch(() => language?.value, (v) => {
    aiEditor.value?.changeLang(v ?? 'zh')
    if (value.value) {
      aiEditor.value?.setContent(value.value)
    }
  })
  watch(() => darkMode?.value, (v) => {
    if (domRef.value && aiEditor.value) {
      aiEditor.value.options.theme = v ? 'dark' : 'light'
      domRef.value.classList.remove(v ? 'aie-theme-light' : 'aie-theme-dark')
      domRef.value.classList.add(v ? 'aie-theme-dark' : 'aie-theme-light')
    }
  })
  watch(readonly, (v) => {
    aiEditor.value?.setEditable(!v)
  })
  const onRenderEvent = createEventHook<[AiEditor ]>()

  function render() {
    if (domRef.value && !aiEditor.value) {
      aiEditor.value = new AiEditor({
        element: domRef.value,
        content: value.value,
        lang: language?.value ?? 'zh',
        theme: darkMode?.value ? 'dark' : 'light',
        editable: !readonly.value,
        ...options,
        onChange(aiEditor) {
          value.value = aiEditor.getHtml()
          options?.onChange?.(aiEditor)
        },
      })
      onRenderEvent.trigger(aiEditor.value)
    }
  }
  function destroy() {
    aiEditor.value?.destroy()
    aiEditor.value = null
  }
  onMounted(() => {
    render()
  })
  onUnmounted(() => {
    destroy()
  })
  return {
    value,
    domRef,
    aiEditor,
    readonly,
    onRender: onRenderEvent.on,
  }
}
export type AiEditorReturns = ReturnType<typeof useAiEditor>
