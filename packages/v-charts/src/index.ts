import type { IInitOption, ISpec } from '@visactor/vchart'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { registerAllMarks, registerAnimate, registerAreaChart, registerBarChart, registerBrush, registerCartesianBandAxis, registerCartesianCrossHair, registerCartesianLinearAxis, registerCartesianLogAxis, registerCartesianTimeAxis, registerContinuousLegend, registerCustomMark, registerDataZoom, registerDiscreteLegend, registerDomTooltipHandler, registerLineChart, registerMarkArea, registerMarkLine, registerMarkPoint, registerPieChart, registerPolarBandAxis, registerPolarCrossHair, registerPolarLinearAxis, registerScrollBar, registerTitle, registerTooltip, VChart } from '@visactor/vchart'
import { createEventHook, useDebounceFn, useElementSize } from '@vueuse/core'
import { nextTick, onUnmounted, shallowRef, toRaw, toValue, watch } from 'vue'

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
 * const { onRendered } = useVCharts(chartRef, {
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
 * onRendered((instance) => {
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
  const instanceRef = shallowRef<VChart | null>(null)

  watch(() => toValue(chartOption), () => setOption())

  watch(() => toValue(darkMode), () => setDarkMode())

  const onRenderedEvent = createEventHook<[VChart]>()
  const onUpdateEvent = createEventHook<[ISpec]>()
  const onResizeEvent = createEventHook<[{ width: number, height: number }]>()
  const onDisposeEvent = createEventHook()

  /**
   * 设置图表配置
   */
  function setOption() {
    const option = toRaw(toValue(chartOption))
    if (option) {
      instanceRef.value?.updateSpec(option)
      onUpdateEvent.trigger(option)
    }
  }

  /**
   * 更新图表主题
   */
  function setDarkMode() {
    destroy()
    render()
  }

  /**
   * 渲染图表
   */
  async function render() {
    if (!templateRef.value || instanceRef.value) {
      return
    }
    await nextTick()
    if (!templateRef.value || instanceRef.value) {
      return
    }
    const theme = toValue(darkMode) ? 'dark' : 'light'
    instanceRef.value = new VChart({} as ISpec, {
      dom: templateRef.value,
      theme,
      ...initOptions,
    })
    onRenderedEvent.trigger(instanceRef.value)
    setOption()
  }

  /**
   * 调整图表大小
   *
   * @param width - 宽度
   * @param height - 高度
   */
  function resize(width: number, height: number) {
    instanceRef.value?.resizeSync(width, height)
    onResizeEvent.trigger({ width, height })
  }

  const debounceResize = useDebounceFn(resize, 100)

  const { width, height } = useElementSize(templateRef)
  watch([width, height], ([width, height]) => {
    if (width > 0 && height > 0) {
      debounceResize(width, height)
      render()
    }
  })

  /**
   * 销毁图表
   */
  function destroy() {
    instanceRef.value?.release()
    instanceRef.value = null
    onDisposeEvent.trigger()
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    templateRef,
    instanceRef,
    onRendered: onRenderedEvent.on,
    onUpdate: onUpdateEvent.on,
    onResize: onResizeEvent.on,
    onDispose: onDisposeEvent.on,
  }
}
