import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
} from 'echarts/charts'
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import type { ComposeOption, ECharts, EChartsInitOpts } from 'echarts/core'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components'
import { init, use } from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { isReactive, isRef, onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

export type EChartsOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DatasetComponentOption
>
use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])
export interface EChartsReturns {
  domRef: Ref<HTMLElement | undefined>
  eChart: ShallowRef<ECharts | undefined>
  options: Ref<EChartsOption | undefined>
  onRender: (cb: (eChart: ECharts) => void) => void
}
export function useECharts(options?: Ref<EChartsOption> | EChartsOption, darkMode?: ComputedRef<boolean>, initOptions?: EChartsInitOpts): EChartsReturns {
  const domRef = ref<HTMLElement>()
  const eChart = shallowRef<ECharts>()
  const optionsRef = ref<EChartsOption | undefined>(isRef(options) ? toValue(options) : isReactive(options) ? toValue(options) : options)
  if (isRef(options)) {
    watchEffect(() => {
      optionsRef.value = toValue(options)
    })
  }

  const { width, height } = useElementSize(domRef)

  let onRender: ((eChart: ECharts) => void) | null = null

  function setOption(updateOptions: EChartsOption) {
    eChart.value?.setOption({ ...updateOptions, backgroundColor: 'transparent' })
  }

  function render() {
    if (domRef.value && !eChart.value) {
      if (optionsRef.value) {
        const theme = darkMode?.value ? 'dark' : 'light'
        eChart.value = init(domRef.value, theme, { ...initOptions })
        setOption(optionsRef.value)
        if (typeof onRender === 'function') {
          onRender(eChart.value)
        }
      }
    }
  }

  function resize() {
    eChart.value?.resize()
  }

  function destroy() {
    eChart.value?.dispose()
    eChart.value = undefined
  }

  function updateTheme() {
    destroy()
    render()
  }

  watch([width, height], () => {
    if (eChart.value) {
      resize()
    }
    else {
      render()
    }
  })

  watch(optionsRef, (v) => {
    if (v) {
      if (eChart.value) {
        setOption(v)
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
    eChart,
    options: optionsRef as Ref<EChartsOption | undefined>,
    onRender: (cb: (eChart: ECharts) => void) => {
      onRender = cb
    },
  }
}
