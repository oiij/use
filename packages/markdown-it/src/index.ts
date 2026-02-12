import type { Options } from 'markdown-it'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import DOMPurify from 'dompurify'
import markdownIt from 'markdown-it'
import { onMounted, onUnmounted, ref } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

/**
 * 使用 MarkdownIt 选项类型
 */
export type UseMarkDownItOptions = {
  /**
   * Markdown 内容
   */
  value?: MaybeRefOrGetter<string>
  /**
   * 是否手动渲染
   * @default false
   */
  manual?: boolean
  /**
   * 是否使用 DOM 净化
   * @default true
   */
  domPurify?: boolean
  /**
   * MarkdownIt 选项
   */
  markdownItOptions?: Options
}

/**
 * 使用 MarkdownIt
 *
 * @param templateRef - 渲染容器的模板引用
 * @param options - MarkdownIt 选项
 * @returns MarkdownIt 实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useMarkdownIt } from '@oiij/markdown-it'
 *
 * const content = ref('# 标题\n\n这是一段 **Markdown** 内容')
 * const { html, render } = useMarkdownIt({
 *   value: content
 * })
 * </script>
 *
 * <template>
 *   <div v-html="html"></div>
 * </template>
 * ```
 */
export function useMarkdownIt(templateRef?: TemplateRef<HTMLElement>, options?: UseMarkDownItOptions) {
  const { value, manual = false, domPurify = true, markdownItOptions } = options ?? {}
  const valueRef = watchRefOrGetter(value, () => {
    if (!manual) {
      render()
    }
  })
  const htmlRef = ref('')

  const markdownItInst = markdownIt({ ...markdownItOptions })

  /**
   * 渲染 Markdown 内容
   *
   * @param value - Markdown 内容
   * @returns 渲染后的 HTML 内容
   *
   * @example
   * ```ts
   * import { useMarkdownIt } from '@oiij/markdown-it'
   *
   * const { render } = useMarkdownIt()
   * const html = render('# 标题')
   * console.log(html) // <h1>标题</h1>
   * ```
   */
  function render(value?: string) {
    if (value !== undefined && value !== valueRef.value) {
      valueRef.value = value
    }
    const mdValue = markdownItInst.render(valueRef.value ?? '')
    htmlRef.value = domPurify ? DOMPurify.sanitize(mdValue) : mdValue
    if (templateRef?.value) {
      templateRef.value.innerHTML = htmlRef.value
    }
    return htmlRef.value
  }

  onMounted(() => {
    if (!manual) {
      render()
    }
  })

  onUnmounted(() => {
    if (templateRef?.value) {
      templateRef.value.innerHTML = ''
    }
  })

  return {
    templateRef,
    value: valueRef,
    html: htmlRef,
    markdownItInst,
    render,
  }
}

/**
 * MarkdownIt 返回值类型
 */
export type MarkdownItReturns = ReturnType<typeof useMarkdownIt>
