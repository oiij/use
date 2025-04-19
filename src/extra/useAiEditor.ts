import type { AiEditorOptions } from 'aieditor'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import { AiEditor } from 'aieditor'
import { isReactive, isRef, onMounted, onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'
import 'aieditor/dist/style.css'

export type {
  AiEditorOptions,
}
export interface AiEditorReturns {
  value: Ref<string | undefined>
  domRef: Ref<HTMLElement | undefined>
  aiEditor: ShallowRef<AiEditor | null | undefined>
  readonly: Ref<boolean>
}
export function useAiEditor(defaultValue?: Ref<string> | string, darkMode?: ComputedRef<boolean>, language?: ComputedRef<'zh' | 'en'>, options?: Omit<AiEditorOptions, 'element'>): AiEditorReturns {
  const value = ref(isRef(defaultValue) ? toValue(defaultValue.value) : isReactive(defaultValue) ? toValue(defaultValue) : defaultValue)
  if (isRef(defaultValue)) {
    watchEffect(() => {
      value.value = toValue(defaultValue.value)
    })
  }
  const domRef = ref<HTMLElement>()
  const aiEditor = shallowRef<AiEditor | null>()
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
  function render() {
    if (domRef.value) {
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
    }
  }
  function destroy() {
    aiEditor.value?.destroy()
    aiEditor.value = undefined
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
  }
}
