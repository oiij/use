import type { IInitOption, ISpec } from '@visactor/vchart'
import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue'
import { registerAllMarks, registerAnimate, registerAreaChart, registerBarChart, registerBrush, registerCartesianBandAxis, registerCartesianCrossHair, registerCartesianLinearAxis, registerCartesianLogAxis, registerCartesianTimeAxis, registerContinuousLegend, registerCustomMark, registerDataZoom, registerDiscreteLegend, registerDomTooltipHandler, registerLineChart, registerMarkArea, registerMarkLine, registerMarkPoint, registerPieChart, registerPolarBandAxis, registerPolarCrossHair, registerPolarLinearAxis, registerScrollBar, registerTitle, registerTooltip, VChart } from '@visactor/vchart'
import { createEventHook, useDebounceFn } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'
import { watchElementSize } from '../../_utils/custom-watch'

export const REGISTER_BASE = [
  registerDiscreteLegend,
  registerContinuousLegend,
  registerCustomMark,
  registerAllMarks,
  registerTitle,
  registerTooltip,
  registerDomTooltipHandler,
]
export const REGISTER_POLAR = [
  registerPolarLinearAxis,
  registerPolarBandAxis,
  registerPolarCrossHair,
  registerBrush,
  registerDataZoom,
  ...REGISTER_BASE,
]
export const REGISTER_CARTESIAN = [
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis,
  registerCartesianLogAxis,
  registerCartesianCrossHair,
  registerBrush,
  registerDataZoom,
  registerMarkArea,
  registerMarkLine,
  registerMarkPoint,
  registerScrollBar,
  ...REGISTER_BASE,
]
export const BASE_CHARTS = [
  registerLineChart,
  registerAreaChart,
  registerBarChart,
  registerPieChart,
]
VChart.useRegisters([...REGISTER_CARTESIAN, ...BASE_CHARTS, registerAnimate])

export type {
  ISpec,
}
export {
  VChart,
}
export function register(comps: (() => void)[]) {
  VChart.useRegisters(comps)
}
export type UseVChartsOptions = {
  chartOption?: MaybeRefOrGetter<ISpec>
  darkMode?: MaybeRefOrGetter<boolean>
  initOptions?: IInitOption
  debug?: boolean
}

export function useVCharts(templateRef: TemplateRef<HTMLElement>, options?: UseVChartsOptions) {
  const { chartOption, darkMode, initOptions, debug } = options ?? {}
  function debugLog(msg: string) {
    if (debug) {
      console.error(msg)
    }
  }
  const vChartInst = shallowRef<VChart | null>(null)

  const chartOptionRef = ref(toValue(chartOption)) as Ref<ISpec | undefined>
  watchEffect(() => chartOptionRef.value = toValue(chartOption) as ISpec | undefined)
  watch(chartOptionRef, setOption)

  const darkModeRef = ref(toValue(darkMode))
  watchEffect(() => darkModeRef.value = toValue(darkMode))
  watch(darkModeRef, updateTheme)

  const onRenderEvent = createEventHook<[VChart]>()
  const onUpdateEvent = createEventHook<[ISpec]>()
  const onResizeEvent = createEventHook<[{ width: number, height: number }]>()
  const onDisposeEvent = createEventHook()

  function setOption(option?: ISpec) {
    if (option) {
      chartOptionRef.value = option
    }
    const chartOption = chartOptionRef.value ?? {} as ISpec
    vChartInst.value?.updateSpec(chartOption)
    onUpdateEvent.trigger(chartOption)
    debugLog(`update: ${JSON.stringify(chartOption)}`)
  }
  function updateTheme(darkMode?: boolean) {
    if (darkMode) {
      darkModeRef.value = darkMode
    }
    const theme = darkModeRef.value ? 'dark' : 'light'
    vChartInst.value?.setCurrentThemeSync(theme)
    debugLog(`updateTheme: ${theme}`)
  }

  function render() {
    if (templateRef.value) {
      if (vChartInst.value) {
        return
      }
      const theme = darkModeRef?.value ? 'dark' : 'light'
      vChartInst.value = new VChart(chartOptionRef.value ?? {} as ISpec, {
        dom: templateRef.value,
        ...initOptions,
      })
      vChartInst.value.setCurrentThemeSync(theme)
      vChartInst.value.renderSync()
      onRenderEvent.trigger(vChartInst.value)
      debugLog(`render: ${vChartInst.value}`)
    }
  }

  function resize(width: number, height: number) {
    vChartInst.value?.resizeSync(width, height)
    onResizeEvent.trigger({ width, height })
    debugLog(`resize: ${width} x ${height}`)
  }
  const debounceResize = useDebounceFn(resize, 100)

  watchElementSize(templateRef, ({ width, height }) => {
    debounceResize(width, height)
    render()
  })
  function destroy() {
    vChartInst.value?.release()
    vChartInst.value = null
    onDisposeEvent.trigger()
    debugLog(`dispose:  `)
  }
  onUnmounted(() => {
    destroy()
  })
  return {
    templateRef,
    vChartInst,
    chartOption: chartOptionRef,
    darkMode: darkModeRef,
    onRender: onRenderEvent.on,
    onUpdate: onUpdateEvent.on,
    onResize: onResizeEvent.on,
    onDispose: onDisposeEvent.on,
  }
}
