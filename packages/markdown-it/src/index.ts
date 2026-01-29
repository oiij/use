import type { Options } from 'markdown-it'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import DOMPurify from 'dompurify'
import markdownIt from 'markdown-it'
import { onMounted, onUnmounted, ref } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

export type UseMarkDownItOptions = {
  value?: MaybeRefOrGetter<string>
  manual?: boolean
  domPurify?: boolean
  markdownItOptions?: Options
}

export function useMarkdownIt(templateRef?: TemplateRef<HTMLElement>, options?: UseMarkDownItOptions) {
  const { value, manual = false, domPurify = true, markdownItOptions } = options ?? {}
  const valueRef = watchRefOrGetter(value, () => {
    if (!manual) {
      render()
    }
  })
  const htmlRef = ref('')

  const markdownItInst = markdownIt({ ...markdownItOptions })
  function render(value?: string) {
    if (value) {
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
export type MarkdownItReturns = ReturnType<typeof useMarkdownIt>
