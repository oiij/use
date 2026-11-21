import type { AiEditorOptions } from 'aieditor'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { createEventHook, watchOnce } from '@vueuse/core'
import { AiEditor } from 'aieditor'
import { nextTick, onUnmounted, shallowRef } from 'vue'
import { watchRefOrGetter } from './_utils'

import 'aieditor/style.css'

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
  language?: MaybeRefOrGetter<'zh-CN' | 'en-US'>
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
 *   language: 'zh-CN',
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
  const instanceRef = shallowRef<AiEditor | null>(null)

  const valueRef = watchRefOrGetter(value, () => setContent())

  const darkModeRef = watchRefOrGetter(darkMode, () => setDarkMode())

  const languageRef = watchRefOrGetter(language, () => setLanguage())

  const readonlyRef = watchRefOrGetter(readonly, () => setReadonly())

  const onRenderedEvent = createEventHook<[AiEditor]>()
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
    const currentContent = instanceRef.value?.getHTML()
    if (valueRef.value !== undefined && valueRef.value !== currentContent) {
      instanceRef.value?.setContent(valueRef.value)
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
    if (templateRef.value && instanceRef.value) {
      instanceRef.value.setTheme(theme)
    }
  }

  /**
   * 更新编辑器语言
   *
   * @param language - 要设置的语言
   */
  function setLanguage(language?: 'zh-CN' | 'en-US') {
    if (language !== undefined) {
      languageRef.value = language
    }
    instanceRef.value?.setLocale(languageRef.value ?? 'zh-CN')
    if (valueRef.value) {
      instanceRef.value?.setContent(valueRef.value)
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
    instanceRef.value?.setEditable(!readonlyRef.value)
  }

  async function render() {
    if (templateRef.value && !instanceRef.value) {
      const locale = languageRef.value ?? 'zh-CN'
      const theme = darkModeRef.value ? 'dark' : 'light'
      await nextTick()
      instanceRef.value = new AiEditor({
        element: templateRef.value,
        content: valueRef.value,
        locale,
        theme,
        editable: !readonlyRef.value,
        ...aiEditorOptions,
        onUpdate(editor, transaction) {
          if (valueRef.value !== editor.getHTML()) {
            valueRef.value = editor.getHTML()
            onUpdateValueEvent.trigger(valueRef.value)
          }
          aiEditorOptions?.onUpdate?.(editor, transaction)
        },
      })
      onRenderedEvent.trigger(instanceRef.value)
    }
  }

  function destroy() {
    instanceRef.value?.destroy()
    instanceRef.value = null
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
    instanceRef,
    value: valueRef,
    darkMode: darkModeRef,
    language: languageRef,
    readonly: readonlyRef,
    setContent,
    setDarkMode,
    setLanguage,
    setReadonly,
    onRendered: onRenderedEvent.on,
    onUpdateValue: onUpdateValueEvent.on,
  }
}

/**
 * 使用 AI 编辑器返回值类型
 */
export type UseAiEditorReturns = ReturnType<typeof useAiEditor>
