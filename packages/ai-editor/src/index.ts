import type { AiEditorOptions } from 'aieditor'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { createEventHook, watchOnce } from '@vueuse/core'
import { AiEditor } from 'aieditor'
import { onUnmounted, shallowRef } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'
import 'aieditor/dist/style.css'

export type {
  AiEditorOptions,
}
export type UseAiEditorOptions = {
  value?: MaybeRefOrGetter<string>
  darkMode?: MaybeRefOrGetter<boolean>
  language?: MaybeRefOrGetter<'zh' | 'en'>
  readonly?: MaybeRefOrGetter<boolean>
  aiEditorOptions?: Omit<AiEditorOptions, 'element'>
}
export function useAiEditor(templateRef: TemplateRef<HTMLElement>, options?: UseAiEditorOptions) {
  const { value, darkMode, language, readonly, aiEditorOptions } = options ?? {}
  const aiEditorInst = shallowRef<AiEditor | null>(null)

  const valueRef = watchRefOrGetter(value, setContent)

  const darkModeRef = watchRefOrGetter(darkMode, updateTheme)

  const languageRef = watchRefOrGetter(language, updateLanguage)

  const readonlyRef = watchRefOrGetter(readonly, setReadonly)

  const onRenderEvent = createEventHook<[AiEditor]>()

  function setContent(value?: string) {
    if (value) {
      valueRef.value = value
    }
    aiEditorInst.value?.setContent(value ?? '')
  }
  function updateTheme(darkMode?: boolean) {
    if (darkMode) {
      darkModeRef.value = darkMode
    }
    const theme = darkModeRef.value ? 'dark' : 'light'
    if (templateRef.value && aiEditorInst.value) {
      aiEditorInst.value.options.theme = theme
      templateRef.value.classList.remove('aie-theme-light', 'aie-theme-dark')
      templateRef.value.classList.add(`aie-theme-${theme}`)
    }
  }
  function updateLanguage(language?: 'zh' | 'en') {
    if (language) {
      languageRef.value = language
    }
    aiEditorInst.value?.changeLang(languageRef.value ?? 'zh')
  }
  function setReadonly(readonly?: boolean) {
    if (readonly) {
      readonlyRef.value = readonly
    }
    aiEditorInst.value?.setEditable(!readonlyRef.value)
  }
  function render() {
    if (templateRef.value) {
      if (!aiEditorInst.value) {
        aiEditorInst.value = new AiEditor({
          element: templateRef.value,
          content: valueRef.value,
          lang: languageRef.value ?? 'zh',
          theme: darkModeRef.value ? 'dark' : 'light',
          editable: !readonlyRef.value,
          ...aiEditorOptions,
          onChange(aiEditorInst) {
            valueRef.value = aiEditorInst.getHtml()
            aiEditorOptions?.onChange?.(aiEditorInst)
          },
        })
        onRenderEvent.trigger(aiEditorInst.value)
      }
    }
  }
  function destroy() {
    aiEditorInst.value?.destroy()
    aiEditorInst.value = null
    if (templateRef.value) {
      templateRef.value.innerHTML = ''
    }
  }

  watchOnce(templateRef, render)
  onUnmounted(() => {
    destroy()
  })
  return {
    templateRef,
    value: valueRef,
    darkMode: darkModeRef,
    language: languageRef,
    readonly: readonlyRef,
    aiEditorInst,
    setContent,
    updateTheme,
    updateLanguage,
    setReadonly,
    onRender: onRenderEvent.on,
  }
}
export type UseAiEditorReturns = ReturnType<typeof useAiEditor>
