import type { AiEditorOptions } from 'aieditor'
import type { ComputedRef, Ref, TemplateRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { AiEditor } from 'aieditor'
import { onMounted, onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'
import 'aieditor/dist/style.css'

export type {
  AiEditorOptions,
}
export function useAiEditor(templateRef: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, darkMode?: ComputedRef<boolean> | Ref<boolean>, language?: ComputedRef<'zh' | 'en'> | Ref<'zh' | 'en'>, options?: Omit<AiEditorOptions, 'element'>) {
  const value = ref(toValue(defaultValue))
  watchEffect(() => {
    value.value = toValue(defaultValue)
  })
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
    if (templateRef.value && aiEditor.value) {
      aiEditor.value.options.theme = v ? 'dark' : 'light'
      templateRef.value.classList.remove(v ? 'aie-theme-light' : 'aie-theme-dark')
      templateRef.value.classList.add(v ? 'aie-theme-dark' : 'aie-theme-light')
    }
  })
  watch(readonly, (v) => {
    aiEditor.value?.setEditable(!v)
  })
  const onRenderEvent = createEventHook<[AiEditor ]>()

  function render() {
    if (templateRef.value && !aiEditor.value) {
      aiEditor.value = new AiEditor({
        element: templateRef.value,
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
    templateRef,
    aiEditor,
    readonly,
    onRender: onRenderEvent.on,
  }
}
export type AiEditorReturns = ReturnType<typeof useAiEditor>
