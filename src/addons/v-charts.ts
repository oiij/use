import type { IInitOption, ISpec } from '@visactor/vchart'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import { VChart } from '@visactor/vchart'
import { useElementSize } from '@vueuse/core'
import { isReactive, isRef, onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

export type {
  ISpec,
}
VChart.useRegisters([])
export interface VChartsReturns {
  domRef: Ref<HTMLElement | undefined>
  vChart: ShallowRef<VChart | undefined>
  options: Ref<ISpec | undefined>
  onRender: (cb: (eChart: VChart) => void) => void
}
export function useVCharts(options: Ref<ISpec> | ISpec, darkMode?: ComputedRef<boolean>, initOptions?: IInitOption): VChartsReturns {
  const domRef = ref<HTMLElement>()
  const vChart = shallowRef<VChart>()
  const optionsRef = ref<ISpec | undefined>(isRef(options) ? toValue(options) : isReactive(options) ? toValue(options) : options)
  if (isRef(options)) {
    watchEffect(() => {
      if (options.value) {
        optionsRef.value = toValue(options)
      }
    })
  }

  const { width, height } = useElementSize(domRef)

  let onRender: ((vChart: VChart) => void) | null = null

  function setOption(spec: ISpec) {
    vChart.value?.updateSpec(spec)
    vChart.value?.renderSync()
  }

  function render() {
    if (domRef.value && !vChart.value) {
      if (optionsRef.value) {
        const theme = darkMode?.value ? 'dark' : 'light'
        vChart.value = new VChart(optionsRef.value as ISpec, {
          dom: domRef.value,
          theme,
          ...initOptions,
        })
        vChart.value.renderSync()
        if (typeof onRender === 'function') {
          onRender(vChart.value)
        }
      }
    }
  }
  function resize() {
    vChart.value?.resizeSync(width.value, height.value)
  }
  function destroy() {
    vChart.value?.release()
    vChart.value = undefined
  }
  function updateTheme() {
    vChart.value?.setCurrentThemeSync(darkMode?.value ? 'dark' : 'light')
  }
  watch([width, height], () => {
    if (vChart.value) {
      if (!vChart.value) {
        resize()
      }
      else {
        render()
      }
    }
  })
  watch(optionsRef, (v) => {
    if (v) {
      if (vChart.value) {
        setOption(v as ISpec)
      }
      else {
        render()
      }
    }
  })
  watch(() => darkMode?.value, () => {
    updateTheme()
  })
  onUnmounted(() => {
    destroy()
  })
  return {
    domRef,
    vChart,
    options: optionsRef as Ref<ISpec | undefined>,
    onRender: (cb: (eChart: VChart) => void) => {
      onRender = cb
    },
  }
}
