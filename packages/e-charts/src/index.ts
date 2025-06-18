import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts'
import type { DatasetComponentOption, GridComponentOption, LegendComponentOption, TitleComponentOption, ToolboxComponentOption, TooltipComponentOption } from 'echarts/components'
import type { ComposeOption, ECharts, EChartsInitOpts } from 'echarts/core'
import type { ComputedRef, Ref } from 'vue'
import { createEventHook, useDebounceFn, useElementSize } from '@vueuse/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent, TransformComponent } from 'echarts/components'
import { init, use } from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

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
export const baseChat = [
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
  ...baseChat,

])
export function register(ext: Parameters<typeof use>[0]) {
  use(ext)
}
export function useECharts(options?: Ref<EChartsOption> | EChartsOption, darkMode?: ComputedRef<boolean>, initOptions?: EChartsInitOpts) {
  const domRef = shallowRef<HTMLElement>()
  const eChart = shallowRef<ECharts | null>(null)
  const optionsRef: Ref<EChartsOption | undefined> = ref(toValue(options))

  watchEffect(() => {
    optionsRef.value = toValue(options)
  })

  const { width, height } = useElementSize(domRef)

  const onRenderEvent = createEventHook<ECharts>()
  const onUpdateEvent = createEventHook<EChartsOption>()
  const onResizeEvent = createEventHook<{ width: number, height: number }>()
  const onDisposeEvent = createEventHook()

  function setOption(updateOptions: EChartsOption) {
    if (eChart.value) {
      eChart.value.setOption({ ...updateOptions, backgroundColor: 'transparent' })
      onUpdateEvent.trigger(updateOptions)
    }
  }

  function render() {
    if (domRef.value) {
      if (eChart.value) {
        resize()
        return
      }
      const theme = darkMode?.value ? 'dark' : 'light'
      if (optionsRef.value) {
        eChart.value = init(domRef.value, theme, { ...initOptions })
        setOption(optionsRef.value)
        onRenderEvent.trigger(eChart.value)
      }
    }
  }
  const renderDebounce = useDebounceFn(render, 100)
  function resize() {
    if (eChart.value) {
      eChart.value.resize()
      onResizeEvent.trigger({ width: width.value, height: height.value })
    }
  }
  const resizeDebounce = useDebounceFn(resize, 100)

  function destroy() {
    eChart.value?.dispose()
    eChart.value = null
    onDisposeEvent.trigger()
  }

  function updateTheme() {
    destroy()
    render()
  }

  watch([width, height], ([width, height]) => {
    if (width > 0 && height > 0) {
      if (eChart.value) {
        resizeDebounce()
      }
      else {
        renderDebounce()
      }
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
    options: optionsRef,
    onRender: onRenderEvent.on,
    onUpdate: onUpdateEvent.on,
    onResize: onResizeEvent.on,
    onDispose: onDisposeEvent.on,
  }
}
