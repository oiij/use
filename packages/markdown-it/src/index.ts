import type { Options } from 'markdown-it'
import type { Ref, TemplateRef } from 'vue'
import DOMPurify from 'dompurify'
import markdownIt from 'markdown-it'
import { isReactive, isRef, ref, toValue, watch, watchEffect } from 'vue'

export type MarkDownItOptions = Options & {
  manual?: boolean
  domPurify?: boolean
}

export function useMarkdownIt(templateRef?: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, options?: MarkDownItOptions) {
  const { manual = false, domPurify = true, ..._options } = options ?? {}
  const value = ref(isRef(defaultValue) ? toValue(defaultValue.value) : isReactive(defaultValue) ? toValue(defaultValue) : defaultValue)
  if (isRef(defaultValue)) {
    watchEffect(() => {
      value.value = toValue(defaultValue.value)
    })
  }
  const html = ref('')

  const md = markdownIt({
    ..._options,
  })
  function render(value: string) {
    const mdValue = md.render(value)
    html.value = domPurify ? DOMPurify.sanitize(mdValue) : mdValue
    if (templateRef && templateRef.value) {
      templateRef.value.innerHTML = html.value
    }
    return html.value
  }
  if (!manual) {
    render(value.value ?? '')
    watch(value, (v) => {
      render(v ?? '')
    })
  }

  return {
    value,
    html,
    templateRef,
    md,
    render,
  }
}
export type MarkdownItReturns = ReturnType<typeof useMarkdownIt>
