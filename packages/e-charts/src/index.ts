import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts'
import type { DatasetComponentOption, GridComponentOption, LegendComponentOption, TitleComponentOption, ToolboxComponentOption, TooltipComponentOption } from 'echarts/components'
import type { ComposeOption, ECharts, EChartsInitOpts } from 'echarts/core'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { createEventHook, useDebounceFn } from '@vueuse/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent, TransformComponent } from 'echarts/components'
import { init, use } from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { nextTick, onUnmounted, shallowRef, toRaw } from 'vue'
import { watchElementSize, watchRefOrGetter } from '../../_utils/custom-watch'

/**
 * ECharts 图表配置类型
 */
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

/**
 * 基础图表类型
 */
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

/**
 * 注册 ECharts 扩展
 *
 * @param ext - 扩展组件数组
 *
 * @example
 * ```ts
 * import { register } from '@oiij/e-charts'
 * import { RadarChart } from 'echarts/charts'
 *
 * register([RadarChart])
 * ```
 */
export function register(ext: Parameters<typeof use>[0]) {
  use(ext)
}

/**
 * 使用 ECharts 选项类型
 */
export type UseEChartsOptions = {
  /**
   * 图表配置
   */
  chartOption?: MaybeRefOrGetter<EChartsOption>
  /**
   * 是否开启暗黑模式
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 初始化选项
   */
  initOptions?: EChartsInitOpts
}

/**
 * 使用 ECharts
 *
 * @param templateRef - 图表容器的模板引用
 * @param options - 图表选项
 * @returns ECharts 实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useECharts } from '@oiij/e-charts'
 *
 * const chartRef = ref()
 * const { chartOption, onRender } = useECharts(chartRef, {
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
export function useECharts(templateRef: TemplateRef<HTMLElement>, options?: UseEChartsOptions) {
  const { chartOption, darkMode, initOptions } = options ?? {}
  const eChartInst = shallowRef<ECharts | null>(null)

  const chartOptionRef = watchRefOrGetter(chartOption, () => setOption())

  const darkModeRef = watchRefOrGetter(darkMode, () => setDarkMode())

  const onRenderEvent = createEventHook<[ECharts]>()
  const onUpdateEvent = createEventHook<[EChartsOption]>()
  const onResizeEvent = createEventHook<[{ width: number, height: number }]>()
  const onDisposeEvent = createEventHook()

  /**
   * 设置图表配置
   *
   * @param option - 图表配置
   */
  function setOption(option?: EChartsOption) {
    if (option !== undefined) {
      chartOptionRef.value = option
    }
    const chartOption = toRaw(chartOptionRef.value)
    if (chartOption) {
      eChartInst.value?.setOption(chartOption)
      onUpdateEvent.trigger(chartOption)
    }
  }

  /**
   * 更新图表主题
   *
   * @param darkMode - 是否开启暗黑模式
   */
  function setDarkMode(darkMode?: boolean) {
    if (darkMode !== undefined) {
      darkModeRef.value = darkMode
    }
    destroy()
    render()
  }

  /**
   * 渲染图表
   */
  async function render() {
    if (templateRef.value && !eChartInst.value) {
      const theme = darkModeRef?.value ? 'dark' : 'default'
      await nextTick()
      eChartInst.value = init(templateRef.value, theme, { ...initOptions })
      onRenderEvent.trigger(eChartInst.value)
      setOption()
    }
  }

  /**
   * 调整图表大小
   *
   * @param width - 宽度
   * @param height - 高度
   */
  function resize(width: number, height: number) {
    eChartInst.value?.resize()
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
    eChartInst.value?.dispose()
    eChartInst.value = null
    onDisposeEvent.trigger()
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    templateRef,
    eChartInst,
    chartOption: chartOptionRef,
    darkMode: darkModeRef,
    setOption,
    setDarkMode,
    onRender: onRenderEvent.on,
    onUpdate: onUpdateEvent.on,
    onResize: onResizeEvent.on,
    onDispose: onDisposeEvent.on,
  }
}
