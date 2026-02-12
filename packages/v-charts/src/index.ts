import type { IInitOption, ISpec } from '@visactor/vchart'
import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue'
import { registerAllMarks, registerAnimate, registerAreaChart, registerBarChart, registerBrush, registerCartesianBandAxis, registerCartesianCrossHair, registerCartesianLinearAxis, registerCartesianLogAxis, registerCartesianTimeAxis, registerContinuousLegend, registerCustomMark, registerDataZoom, registerDiscreteLegend, registerDomTooltipHandler, registerLineChart, registerMarkArea, registerMarkLine, registerMarkPoint, registerPieChart, registerPolarBandAxis, registerPolarCrossHair, registerPolarLinearAxis, registerScrollBar, registerTitle, registerTooltip, VChart } from '@visactor/vchart'
import { createEventHook, useDebounceFn } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'
import { watchElementSize } from '../../_utils/custom-watch'

/**
 * 基础注册组件
 */
export const REGISTER_BASE = [
  registerDiscreteLegend,
  registerContinuousLegend,
  registerCustomMark,
  registerAllMarks,
  registerTitle,
  registerTooltip,
  registerDomTooltipHandler,
]

/**
 * 极坐标系注册组件
 */
export const REGISTER_POLAR = [
  registerPolarLinearAxis,
  registerPolarBandAxis,
  registerPolarCrossHair,
  registerBrush,
  registerDataZoom,
  ...REGISTER_BASE,
]

/**
 * 笛卡尔坐标系注册组件
 */
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

/**
 * 基础图表类型
 */
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

/**
 * 注册 VChart 组件
 *
 * @param comps - 组件注册函数数组
 *
 * @example
 * ```ts
 * import { register } from '@oiij/v-charts'
 * import { registerRadarChart } from '@visactor/vchart'
 *
 * register([registerRadarChart])
 * ```
 */
export function register(comps: (() => void)[]) {
  VChart.useRegisters(comps)
}

/**
 * 使用 VCharts 选项类型
 */
export type UseVChartsOptions = {
  /**
   * 图表配置
   */
  chartOption?: MaybeRefOrGetter<ISpec>
  /**
   * 是否开启暗黑模式
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 初始化选项
   */
  initOptions?: IInitOption
}

/**
 * 使用 VCharts
 *
 * @param templateRef - 图表容器的模板引用
 * @param options - 图表选项
 * @returns VCharts 实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useVCharts } from '@oiij/v-charts'
 *
 * const chartRef = ref()
 * const { chartOption, onRender } = useVCharts(chartRef, {
 *   chartOption: {
 *     title: {
 *       text: '示例图表'
 *     },
 *     series: [
 *       {
 *         type: 'bar',
 *         data: [10, 20, 30, 40, 50]
 *       }
 *     ]
 *   }
 * })
 *
 * onRender((instance) => {
 *   console.log('图表渲染完成', instance)
 * })
 * </script>
 *
 * <template>
 *   <div ref="chartRef" style="width: 100%; height: 400px;"></div>
 * </template>
 * ```
 */
export function useVCharts(templateRef: TemplateRef<HTMLElement>, options?: UseVChartsOptions) {
  const { chartOption, darkMode, initOptions } = options ?? {}
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

  /**
   * 设置图表配置
   *
   * @param option - 图表配置
   */
  function setOption(option?: ISpec) {
    if (option !== undefined && option !== chartOptionRef.value) {
      chartOptionRef.value = option
    }
    const chartOption = chartOptionRef.value ?? {} as ISpec
    vChartInst.value?.updateSpec(chartOption)
    onUpdateEvent.trigger(chartOption)
  }

  /**
   * 更新图表主题
   *
   * @param darkMode - 是否开启暗黑模式
   */
  function updateTheme(darkMode?: boolean) {
    if (darkMode !== undefined && darkMode !== darkModeRef.value) {
      darkModeRef.value = darkMode
    }
    const theme = darkModeRef.value ? 'dark' : 'light'
    vChartInst.value?.setCurrentThemeSync(theme)
  }

  /**
   * 渲染图表
   */
  function render() {
    if (templateRef.value && !vChartInst.value) {
      const theme = darkModeRef?.value ? 'dark' : 'light'
      vChartInst.value = new VChart(chartOptionRef.value ?? {} as ISpec, {
        dom: templateRef.value,
        ...initOptions,
      })
      vChartInst.value.setCurrentThemeSync(theme)
      vChartInst.value.renderSync()
      onRenderEvent.trigger(vChartInst.value)
    }
  }

  /**
   * 调整图表大小
   *
   * @param width - 宽度
   * @param height - 高度
   */
  function resize(width: number, height: number) {
    vChartInst.value?.resizeSync(width, height)
    onResizeEvent.trigger({ width, height })
  }

  const debounceResize = useDebounceFn(resize, 100)

  watchElementSize(templateRef, ({ width, height }) => {
    debounceResize(width, height)
    render()
  })

  /**
   * 销毁图表
   */
  function destroy() {
    vChartInst.value?.release()
    vChartInst.value = null
    onDisposeEvent.trigger()
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
