import type { IInitOption, ISpec } from '@visactor/vchart'
import type { ComputedRef, Ref } from 'vue'
import { registerAllMarks, registerAnimate, registerAreaChart, registerBarChart, registerBrush, registerCartesianBandAxis, registerCartesianCrossHair, registerCartesianLinearAxis, registerCartesianLogAxis, registerCartesianTimeAxis, registerContinuousLegend, registerCustomMark, registerDataZoom, registerDiscreteLegend, registerDomTooltipHandler, registerLineChart, registerMarkArea, registerMarkLine, registerMarkPoint, registerPieChart, registerPolarBandAxis, registerPolarCrossHair, registerPolarLinearAxis, registerScrollBar, registerTitle, registerTooltip, VChart } from '@visactor/vchart'
import { createEventHook, useDebounceFn, useElementSize } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

export const registerBase = [
  registerDiscreteLegend,
  registerContinuousLegend,
  registerCustomMark,
  registerAllMarks,
  registerTitle,
  registerTooltip,
  registerDomTooltipHandler,
]
export const registerPolar = [
  registerPolarLinearAxis,
  registerPolarBandAxis,
  registerPolarCrossHair,
  registerBrush,
  registerDataZoom,
  ...registerBase,
]
export const registerCartesian = [
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
  ...registerBase,
]
export const baseChat = [
  registerLineChart,
  registerAreaChart,
  registerBarChart,
  registerPieChart,
]
VChart.useRegisters([...registerCartesian, ...baseChat, registerAnimate])
export type {
  ISpec,
}
export function register(comps: (() => void)[]) {
  VChart.useRegisters(comps)
}
export function useVCharts(options?: Ref<ISpec> | ISpec, darkMode?: ComputedRef<boolean>, initOptions?: IInitOption & { treeShaking?: boolean }) {
  const domRef = ref<HTMLElement>()
  const vChart = shallowRef<VChart | null>(null)
  const optionsRef: Ref<ISpec | undefined> = ref(toValue(options)) as Ref<ISpec | undefined>

  watchEffect(() => {
    optionsRef.value = toValue(options)
  })

  const { width, height } = useElementSize(domRef)

  const onRenderEvent = createEventHook<VChart>()
  const onUpdateEvent = createEventHook<ISpec>()
  const onResizeEvent = createEventHook<{ width: number, height: number }>()
  const onDisposeEvent = createEventHook()

  function setOption(spec: ISpec) {
    if (vChart.value) {
      vChart.value.updateSpec(spec)
      vChart.value.renderSync()
      onUpdateEvent.trigger(spec)
    }
  }

  function render() {
    if (domRef.value) {
      if (vChart.value) {
        resize()
        return
      }
      const theme = darkMode?.value ? 'dark' : 'light'

      if (optionsRef.value) {
        vChart.value = new VChart(optionsRef.value, {
          dom: domRef.value,
          theme,
          ...initOptions,
        })
        vChart.value.renderSync()
        onRenderEvent.trigger(vChart.value)
      }
    }
  }
  const renderDebounce = useDebounceFn(render, 100)

  function resize() {
    vChart.value?.resizeSync(width.value, height.value)
    onResizeEvent.trigger({ width: width.value, height: height.value })
  }
  const resizeDebounce = useDebounceFn(resize, 100)
  function destroy() {
    vChart.value?.release()
    vChart.value = null
    onDisposeEvent.trigger()
  }
  function updateTheme() {
    vChart.value?.setCurrentThemeSync(darkMode?.value ? 'dark' : 'light')
  }
  watch([width, height], ([width, height]) => {
    if (width > 0 && height > 0) {
      if (vChart.value) {
        resizeDebounce()
      }
      else {
        renderDebounce()
      }
    }
  })
  watch(optionsRef, (v) => {
    if (v) {
      if (vChart.value) {
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
    vChart,
    options: optionsRef,
    onRender: onRenderEvent.on,
    onUpdate: onUpdateEvent.on,
    onResize: onResizeEvent.on,
    onDispose: onDisposeEvent.on,
  }
}
