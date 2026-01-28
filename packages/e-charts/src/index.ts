import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts'
import type { DatasetComponentOption, GridComponentOption, LegendComponentOption, TitleComponentOption, ToolboxComponentOption, TooltipComponentOption } from 'echarts/components'
import type { ComposeOption, ECharts, EChartsInitOpts } from 'echarts/core'
import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue'
import { createEventHook, useDebounceFn } from '@vueuse/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent, TransformComponent } from 'echarts/components'
import { init, use } from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'
import { watchElementSize } from '../../_utils/custom-watch'

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
export const BASE_CHARTS = [
  BarChart,
  LineChart,
  PieChart,
]
use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  ...BASE_CHARTS,

])
export function register(ext: Parameters<typeof use>[0]) {
  use(ext)
}
export type UseEChartsOptions = {
  chartOption?: MaybeRefOrGetter<EChartsOption>
  darkMode?: MaybeRefOrGetter<boolean>
  initOptions?: EChartsInitOpts
  debug?: boolean
}

export function useECharts(templateRef: TemplateRef<HTMLElement>, options?: UseEChartsOptions) {
  const { chartOption, darkMode, initOptions, debug } = options ?? {}
  function debugLog(msg: string) {
    if (debug) {
      console.error(msg)
    }
  }
  const eChartInst = shallowRef<ECharts | null>(null)

  const chartOptionRef = ref(toValue(chartOption)) as Ref<EChartsOption | undefined>
  watchEffect(() => chartOptionRef.value = toValue(chartOption) as EChartsOption | undefined)
  watch(chartOptionRef, setOption)

  const darkModeRef = ref(toValue(darkMode))
  watchEffect(() => darkModeRef.value = toValue(darkMode))
  watch(darkModeRef, updateTheme)

  const onRenderEvent = createEventHook<[ECharts]>()
  const onUpdateEvent = createEventHook<[EChartsOption]>()
  const onResizeEvent = createEventHook<[{ width: number, height: number }]>()
  const onDisposeEvent = createEventHook()

  function setOption(option?: EChartsOption) {
    if (option) {
      chartOptionRef.value = option
    }
    const chartOption = chartOptionRef.value ?? {} as EChartsOption
    eChartInst.value?.setOption(chartOption)
    onUpdateEvent.trigger(chartOption)
    debugLog(`update: ${JSON.stringify(chartOption)}`)
  }
  function updateTheme(darkMode?: boolean) {
    if (darkMode) {
      darkModeRef.value = darkMode
    }
    const theme = darkModeRef.value ? 'dark' : 'default'
    eChartInst.value?.setTheme(theme)
    eChartInst.value?.setOption(chartOptionRef.value ?? {})
    debugLog(`updateTheme: ${theme}`)
  }

  function render() {
    if (templateRef.value) {
      if (eChartInst.value) {
        return
      }
      const theme = darkModeRef?.value ? 'dark' : 'default'
      eChartInst.value = init(templateRef.value, theme, { ...initOptions })
      setOption(chartOptionRef.value)
      onRenderEvent.trigger(eChartInst.value)
      debugLog(`render: ${eChartInst.value}`)
    }
  }
  function resize(width: number, height: number) {
    eChartInst.value?.resize()
    onResizeEvent.trigger({ width, height })
    debugLog(`resize: ${width} x ${height}`)
  }
  const debounceResize = useDebounceFn(resize, 100)

  watchElementSize(templateRef, ({ width, height }) => {
    debounceResize(width, height)
    render()
  })

  function destroy() {
    eChartInst.value?.dispose()
    eChartInst.value = null
    onDisposeEvent.trigger()
    debugLog(`dispose:  `)
  }
  onUnmounted(() => {
    destroy()
  })

  return {
    templateRef,
    eChartInst,
    chartOptionRef,
    darkModeRef,
    onRender: onRenderEvent.on,
    onUpdate: onUpdateEvent.on,
    onResize: onResizeEvent.on,
    onDispose: onDisposeEvent.on,
  }
}
