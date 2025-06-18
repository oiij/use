import type { BundledLanguage, BundledTheme, CodeToHastOptions } from 'shiki'
import type { ComputedRef, Ref } from 'vue'
import { codeToHtml } from 'shiki'
import { isReactive, isRef, onMounted, ref, toValue, watch, watchEffect } from 'vue'

export type {
  BundledLanguage,
  BundledTheme,
  CodeToHastOptions,
}
export function useShiki(defaultValue?: string | Ref<string>, darkMode?: ComputedRef<boolean>, options?: CodeToHastOptions<BundledLanguage, BundledTheme>) {
  const _options = {
    lang: 'javascript',
    theme: `vitesse-${darkMode?.value ? 'dark' : 'light'}`,
    ...options,
  }
  const value = ref(isRef(defaultValue) ? toValue(defaultValue.value) : isReactive(defaultValue) ? toValue(defaultValue) : defaultValue)
  if (isRef(defaultValue)) {
    watchEffect(() => {
      value.value = toValue(defaultValue.value)
    })
  }
  const html = ref('')
  const domRef = ref<HTMLElement>()
  function format(value: string, options?: CodeToHastOptions<BundledLanguage, BundledTheme>) {
    let isCancel = false
    function cancel() {
      isCancel = true
    }
    function promise() {
      return new Promise<string>((resolve, reject) => {
        codeToHtml(value, { ..._options, ...options }).then((result) => {
          if (!isCancel) {
            html.value = result
            if (domRef.value) {
              domRef.value.innerHTML = result
            }
            resolve(result)
          }
        }).catch((err) => {
          if (!isCancel) {
            reject(err)
          }
        })
      })
    }
    return {
      promise,
      cancel,
    }
  }
  onMounted(() => {
    if (value.value) {
      const { promise } = format(value.value)
      promise()
    }
  })
  let lastCancel: (() => void) | null = null
  watch(value, (v) => {
    if (typeof lastCancel === 'function') {
      lastCancel()
    }
    const { promise, cancel } = format(v ?? '')
    lastCancel = cancel
    promise()
  })
  watch(() => darkMode?.value, () => {
    const theme = _options.theme
    if (typeof theme === 'string') {
      _options.theme = theme.replace(/light|dark/, darkMode?.value ? 'dark' : 'light')
    }
    if (value.value) {
      const { promise } = format(value.value)
      promise()
    }
  })
  return {
    value,
    html,
    domRef,
    format,
  }
}

export type UseShikiReturns = ReturnType<typeof useShiki>
