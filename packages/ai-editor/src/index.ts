import type { AiEditorOptions } from 'aieditor'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { createEventHook, watchOnce } from '@vueuse/core'
import { AiEditor } from 'aieditor'
import { nextTick, onUnmounted, shallowRef } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

import 'aieditor/dist/style.css'

export type {
  AiEditorOptions,
}
/**
 * AI 编辑器选项类型
 */
export type UseAiEditorOptions = {
  /**
   * 编辑器内容
   */
  value?: MaybeRefOrGetter<string>
  /**
   * 是否开启暗黑模式
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 编辑器语言
   */
  language?: MaybeRefOrGetter<'zh' | 'en'>
  /**
   * 是否只读
   */
  readonly?: MaybeRefOrGetter<boolean>
  /**
   * AI 编辑器选项
   */
  aiEditorOptions?: Omit<AiEditorOptions, 'element'>
}

/**
 * 使用 AI 编辑器
 *
 * @param templateRef - 编辑器容器的模板引用
 * @param options - 编辑器选项
 * @returns AI 编辑器实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useAiEditor } from '@oiij/ai-editor'
 *
 * const editorRef = ref()
 * const { value, setContent, setDarkMode } = useAiEditor(editorRef, {
 *   value: '<p>Hello World</p>',
 *   darkMode: false,
 *   language: 'zh',
 * })
 * </script>
 *
 * <template>
 *   <div ref="editorRef"></div>
 * </template>
 * ```
 */
export function useAiEditor(templateRef: TemplateRef<HTMLElement>, options?: UseAiEditorOptions) {
  const { value, darkMode, language, readonly, aiEditorOptions } = options ?? {}
  const aiEditorInst = shallowRef<AiEditor | null>(null)

  const valueRef = watchRefOrGetter(value, () => setContent())

  const darkModeRef = watchRefOrGetter(darkMode, () => setDarkMode())

  const languageRef = watchRefOrGetter(language, () => setLanguage())

  const readonlyRef = watchRefOrGetter(readonly, () => setReadonly())

  const onRenderEvent = createEventHook<[AiEditor]>()
  const onUpdateValueEvent = createEventHook<[string]>()
  /**
   * 设置编辑器内容
   *
   * @param value - 要设置的内容
   */
  function setContent(value?: string) {
    if (value !== undefined) {
      valueRef.value = value
    }
    const currentContent = aiEditorInst.value?.getHtml()
    if (valueRef.value && valueRef.value !== currentContent) {
      aiEditorInst.value?.setContent(valueRef.value)
    }
  }

  /**
   * 更新编辑器主题
   *
   * @param darkMode - 是否开启暗黑模式
   */
  function setDarkMode(darkMode?: boolean) {
    if (darkMode !== undefined) {
      darkModeRef.value = darkMode
    }
    const theme = darkModeRef.value ? 'dark' : 'light'
    if (templateRef.value && aiEditorInst.value) {
      aiEditorInst.value.options.theme = theme
      templateRef.value.classList.remove('aie-theme-light', 'aie-theme-dark')
      templateRef.value.classList.add(`aie-theme-${theme}`)
    }
  }

  /**
   * 更新编辑器语言
   *
   * @param language - 要设置的语言
   */
  function setLanguage(language?: 'zh' | 'en') {
    if (language !== undefined) {
      languageRef.value = language
    }
    aiEditorInst.value?.changeLang(languageRef.value ?? 'zh')
    if (valueRef.value) {
      aiEditorInst.value?.setContent(valueRef.value)
    }
  }

  /**
   * 设置编辑器只读状态
   *
   * @param readonly - 是否只读
   */
  function setReadonly(readonly?: boolean) {
    if (readonly !== undefined) {
      readonlyRef.value = readonly
    }
    aiEditorInst.value?.setEditable(!readonlyRef.value)
  }

  async function render() {
    if (templateRef.value && !aiEditorInst.value) {
      const lang = languageRef.value ?? 'zh'
      const theme = darkModeRef.value ? 'dark' : 'light'
      await nextTick()
      aiEditorInst.value = new AiEditor({
        element: templateRef.value,
        content: valueRef.value,
        lang,
        theme,
        editable: !readonlyRef.value,
        ...aiEditorOptions,
        onChange(aiEditorInst) {
          if (valueRef.value !== aiEditorInst.getHtml()) {
            valueRef.value = aiEditorInst.getHtml()
            onUpdateValueEvent.trigger(valueRef.value)
          }
          aiEditorOptions?.onChange?.(aiEditorInst)
        },
      })
      onRenderEvent.trigger(aiEditorInst.value)
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
    setDarkMode,
    setLanguage,
    setReadonly,
    onRender: onRenderEvent.on,
    onUpdateValue: onUpdateValueEvent.on,
  }
}

/**
 * 使用 AI 编辑器返回值类型
 */
export type UseAiEditorReturns = ReturnType<typeof useAiEditor>
