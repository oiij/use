import type { Options } from 'markdown-it'
import type { Ref } from 'vue'
import markdownIt from 'markdown-it'
import { isReactive, isRef, onMounted, ref, toValue, watch, watchEffect } from 'vue'

export type { Options }
export interface MarkdownItReturns {
  value: Ref<string | undefined>
  html: Ref<string>
  domRef: Ref<HTMLElement | undefined>
  md: markdownIt
  render: (value: string) => void
}
export function useMarkdownIt(defaultValue?: Ref<string> | string, options?: Options): MarkdownItReturns {
  const value = ref(isRef(defaultValue) ? toValue(defaultValue.value) : isReactive(defaultValue) ? toValue(defaultValue) : defaultValue)
  if (isRef(defaultValue)) {
    watchEffect(() => {
      value.value = toValue(defaultValue.value)
    })
  }
  const html = ref('')
  const domRef = ref<HTMLElement>()

  const md = markdownIt({
    ...options,
  })
  function render(value: string) {
    html.value = md.render(value)
    if (domRef.value) {
      domRef.value.innerHTML = html.value
    }
  }
  watch(value, (v) => {
    render(v ?? '')
  })
  onMounted(() => {
    if (value.value) {
      render(value.value)
    }
  })
  return {
    value,
    html,
    domRef,
    md,
    render,
  }
}
