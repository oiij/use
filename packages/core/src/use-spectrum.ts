import type { TemplateRef } from 'vue'
import { useRafFn } from '@vueuse/core'

/**
 * 柱状频谱选项
 */
export type SpectrumBarOptions = {
  /** 柱形宽度，默认值：8 */
  width?: number
  /** 柱形最小高度，默认值：8 */
  minHeight?: number
  /** 柱形间距，默认值：2 */
  spacing?: number
  /** 柱形圆角半径，默认值：4 */
  radius?: number
  /** 颜色，可以是单个颜色字符串或渐变色数组，默认值：继承自 SpectrumOptions */
  color?: [string, string] | string
  /** 是否显示阴影，默认值：继承自 SpectrumOptions */
  shadow?: boolean
}

/**
 * 线性频谱选项
 */
export type SpectrumLineOptions = {
  /** 线条宽度，默认值：1 */
  width?: number
  /** 采样点间距，默认值：20 */
  spacing?: number
  /** 颜色，可以是单个颜色字符串或渐变色数组，默认值：继承自 SpectrumOptions */
  color?: [string, string] | string
  /** 平滑度，取值范围 0-1，默认值：0.5 */
  smoothness?: number
  /** 是否填充线条下方区域，默认值：true */
  fill?: boolean
  /** 是否显示阴影，默认值：继承自 SpectrumOptions */
  shadow?: boolean
}

/**
 * 环形柱状频谱选项
 */
export type SpectrumCircleBarOptions = {
  /** 柱形宽度，默认值：8 */
  width?: number
  /** 柱形最小高度，默认值：8 */
  minHeight?: number
  /** 柱形间距，默认值：2 */
  spacing?: number
  /** 基础圆环半径，默认值：画布最小边的 30% */
  radius?: number
  /** 柱形圆角半径，默认值：4 */
  barRadius?: number
  /** 颜色，可以是单个颜色字符串或渐变色数组，默认值：继承自 SpectrumOptions */
  color?: [string, string] | string
  /** 起始角度，默认值：0 */
  startAngle?: number
  /** 结束角度，默认值：Math.PI * 2 */
  endAngle?: number
  /** 是否显示阴影，默认值：继承自 SpectrumOptions */
  shadow?: boolean
}

/**
 * 环形线性频谱选项
 */
export type SpectrumCircleLineOptions = {
  /** 线条宽度，默认值：1 */
  width?: number
  /** 采样点间距，默认值：10 */
  spacing?: number
  /** 基础圆环半径，默认值：画布最小边的 30% */
  radius?: number
  /** 颜色，可以是单个颜色字符串或渐变色数组，默认值：继承自 SpectrumOptions */
  color?: [string, string] | string
  /** 平滑度，取值范围 0-1，默认值：0.5 */
  smoothness?: number
  /** 是否填充线条下方区域，默认值：true */
  fill?: boolean
  /** 起始角度，默认值：0 */
  startAngle?: number
  /** 结束角度，默认值：Math.PI * 2 */
  endAngle?: number
  /** 是否显示阴影，默认值：继承自 SpectrumOptions */
  shadow?: boolean
}

/**
 * 频谱配置选项
 */
export type SpectrumOptions = {
  /** 频谱类型，可选值：'bar' | 'line' | 'circle-bar' | 'circle-line'，默认值：'bar' */
  type?: 'bar' | 'line' | 'circle-bar' | 'circle-line'
  /** 默认颜色，可以是单个颜色字符串或渐变色数组，默认值：'#00FFAA' */
  color?: [string, string] | string
  /** 是否显示阴影，默认值：true */
  shadow?: boolean
  /** 柱状频谱选项 */
  barOptions?: SpectrumBarOptions
  /** 线性频谱选项 */
  lineOptions?: SpectrumLineOptions
  /** 环形柱状频谱选项 */
  circleBarOptions?: SpectrumCircleBarOptions
  /** 环形线性频谱选项 */
  circleLineOptions?: SpectrumCircleLineOptions
  /** 动画速度，取值范围 0-1，默认值：0.5 */
  animationSpeed?: number
  /** 是否手动控制绘制，默认值：false */
  manual?: boolean
}
/**
 * 三次方缓动函数，用于平滑动画效果
 * @param {number} t - 时间参数，取值范围 0-1
 * @returns {number} - 缓动后的值，取值范围 0-1
 * @example
 * // 使用缓动函数处理值
 * const easedValue = easeInOutCubic(0.5); // 返回 0.5
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

/**
 * 绘制圆角矩形
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
 * @param {number} x - 矩形左上角 x 坐标
 * @param {number} y - 矩形左上角 y 坐标
 * @param {number} width - 矩形宽度
 * @param {number} height - 矩形高度
 * @param {number} radius - 圆角半径
 * @example
 * // 绘制一个圆角矩形
 * drawRoundedRect(ctx, 10, 10, 100, 50, 8);
 */
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  // 确保半径不会超过宽高的一半
  const r = Math.min(radius, width / 2, height / 2)

  // 开始绘制圆角矩形路径
  ctx.beginPath()

  // 左上角
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)

  // 右上角
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)

  // 右下角
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)

  // 左下角
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)

  // 关闭路径并填充
  ctx.closePath()
  ctx.fill()
}

/**
 * 将极坐标转换为笛卡尔坐标
 * @param {number} centerX - 中心点 x 坐标
 * @param {number} centerY - 中心点 y 坐标
 * @param {number} radius - 半径
 * @param {number} angleInRadians - 角度（弧度）
 * @returns {{ x: number, y: number }} - 笛卡尔坐标
 * @example
 * // 将极坐标转换为笛卡尔坐标
 * const point = polarToCartesian(100, 100, 50, Math.PI / 4);
 * // 返回 { x: 135.35533905932738, y: 135.35533905932738 }
 */
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInRadians: number) {
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  }
}

/**
 * 设置 Canvas 阴影效果
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
 * @param {boolean} shadow - 是否启用阴影
 * @example
 * // 启用阴影效果
 * setupShadow(ctx, true);
 * // 禁用阴影效果
 * setupShadow(ctx, false);
 */
function setupShadow(ctx: CanvasRenderingContext2D, shadow: boolean) {
  if (shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 5
  }
}

/**
 * 重置 Canvas 阴影效果
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
 */
function resetShadow(ctx: CanvasRenderingContext2D) {
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
}

/**
 * 创建线性渐变或纯色样式
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
 * @param {[string, string] | string} color - 颜色配置，可以是渐变色数组或纯色字符串
 * @param {number} x0 - 渐变起点 x 坐标
 * @param {number} y0 - 渐变起点 y 坐标
 * @param {number} x1 - 渐变终点 x 坐标
 * @param {number} y1 - 渐变终点 y 坐标
 * @param {boolean} [withAlpha] - 是否为填充样式添加透明度
 * @returns {CanvasGradient | string} - 渐变或纯色样式
 */
function createColorStyle(ctx: CanvasRenderingContext2D, color: [string, string] | string, x0: number, y0: number, x1: number, y1: number, withAlpha = false): CanvasGradient | string {
  if (Array.isArray(color)) {
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
    gradient.addColorStop(0, withAlpha ? `${color[0]}80` : color[0])
    gradient.addColorStop(1, withAlpha ? `${color[1]}20` : color[1])
    return gradient
  }
  return withAlpha ? `${color}40` : color
}
/**
 * 音频频谱可视化钩子函数
 * @param {TemplateRef<HTMLCanvasElement>} canvasRef - Canvas 元素的模板引用
 * @param {() => Uint8Array<ArrayBuffer>} frequencyDataGetter - 获取频率数据的函数
 * @param {SpectrumOptions} [options] - 频谱配置选项
 * @returns {{ canvasRef: TemplateRef<HTMLCanvasElement>, pause: () => void, resume: () => void, isActive: boolean }} - 返回值包含画布引用、暂停/恢复函数和活动状态
 * @example
 * // 基本使用示例
 * <template>
 *   <canvas ref="canvasRef" width="400" height="200"></canvas>
 * </template>
 *
 * <script setup lang="ts">
 * import { ref, onMounted } from 'vue';
 * import { useSpectrum } from '@use/core';
 * import { useAudioContext } from '@vueuse/core';
 *
 * const canvasRef = ref<HTMLCanvasElement | null>(null);
 * let frequencyData: Uint8Array;
 *
 * // 初始化音频上下文和分析器
 * onMounted(async () => {
 *   const { audioContext, mediaElementSource } = useAudioContext();
 *   const audioElement = document.createElement('audio');
 *   audioElement.src = 'your-audio-file.mp3';
 *
 *   const analyser = audioContext.createAnalyser();
 *   analyser.fftSize = 256;
 *   frequencyData = new Uint8Array(analyser.frequencyBinCount);
 *
 *   mediaElementSource.connect(analyser);
 *   analyser.connect(audioContext.destination);
 *
 *   // 使用频谱
 *   const { resume } = useSpectrum(canvasRef, () => {
 *     analyser.getByteFrequencyData(frequencyData);
 *     return frequencyData;
 *   }, {
 *     type: 'bar',
 *     color: ['#00FFAA', '#0088FF'],
 *     animationSpeed: 0.3
 *   });
 *
 *   // 开始播放音频
 *   audioElement.play();
 *   resume();
 * });
 * </script>
 *
 * @example
 * // 使用环形线性频谱
 * const { resume } = useSpectrum(canvasRef, () => {
 *   analyser.getByteFrequencyData(frequencyData);
 *   return frequencyData;
 * }, {
 *   type: 'circle-line',
 *   color: '#FF6B6B',
 *   circleLineOptions: {
 *     radius: 80,
 *     smoothness: 0.7,
 *     fill: true
 *   }
 * });
 */
export function useSpectrum(canvasRef: TemplateRef<HTMLCanvasElement>, frequencyDataGetter: () => Uint8Array<ArrayBuffer>, options?: SpectrumOptions) {
  const { type = 'bar', color: defaultColor = '#00FFAA', shadow: defaultShadow = true, barOptions, lineOptions, circleBarOptions, circleLineOptions, animationSpeed = 0.5, manual } = options ?? {}
  const dpr = window.devicePixelRatio || 1
  let smoothedData: number[] = []
  /**
   * 更新频率数据并应用平滑处理
   */
  function updateFrequencyData() {
    const frequencyData = frequencyDataGetter()
    // 如果 smoothedData 为空，初始化它
    if (smoothedData.length !== frequencyData.length) {
      smoothedData = Array.from<number>({ length: frequencyData.length }).fill(0)
    }
    // 计算平滑因子，确保在 0 到 1 之间
    const smoothingFactor = Math.max(0, Math.min(1, animationSpeed))

    // 应用指数平滑
    for (let i = 0; i < frequencyData.length; i++) {
      const currentValue = frequencyData[i]
      smoothedData[i] = smoothedData[i] + smoothingFactor * (currentValue - smoothedData[i])
    }
  }
  /**
   * 主绘制函数
   */
  function draw() {
    const canvas = canvasRef.value
    if (!canvas) {
      throw new Error('canvasRef is not a valid canvas element')
    }
    // 设置画布尺寸，考虑设备像素比
    canvas.width = canvasRef.value.clientWidth * dpr
    canvas.height = canvasRef.value.clientHeight * dpr

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('canvasRef is not a valid canvas element')
    }
    // 缩放上下文以匹配设备像素比
    ctx.scale(dpr, dpr)
    // 清空画布
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    // 更新频率数据
    updateFrequencyData()

    // 根据频谱类型调用相应的绘制函数
    switch (type) {
      case 'bar':
        drawBarSpectrum(ctx)
        break
      case 'line':
        drawLineSpectrum(ctx)
        break
      case 'circle-bar':
        drawCircleBarSpectrum(ctx)
        break
      case 'circle-line':
        drawCircleLineSpectrum(ctx)
        break
    }
  }
  /**
   * 绘制柱状频谱
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
   */
  function drawBarSpectrum(ctx: CanvasRenderingContext2D) {
    const { width = 8, minHeight = 8, spacing = 2, radius = 4, color = defaultColor, shadow = defaultShadow } = barOptions ?? {}
    const canvas = ctx.canvas
    const canvasWidth = canvas.width / dpr
    const canvasHeight = canvas.height / dpr

    setupShadow(ctx, shadow)

    const availableWidth = canvasWidth
    const barCount = Math.min(
      smoothedData.length,
      Math.floor(availableWidth / (width + spacing)),
    )

    if (barCount === 0)
      return

    ctx.fillStyle = createColorStyle(ctx, color, 0, canvasHeight, 0, 0)

    const sampleStep = smoothedData.length / barCount

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor(i * sampleStep)
      const frequencyValue = smoothedData[dataIndex] || 0

      const normalizedValue = frequencyValue / 255
      const easedValue = easeInOutCubic(normalizedValue)
      const barHeight = Math.max(
        minHeight,
        easedValue * canvasHeight * 0.8,
      )

      const x = i * (width + spacing)
      const y = canvasHeight - barHeight

      drawRoundedRect(ctx, x, y, width, barHeight, radius)
    }

    resetShadow(ctx)
  }
  /**
   * 绘制线性频谱
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
   */
  function drawLineSpectrum(ctx: CanvasRenderingContext2D) {
    const { width = 1, spacing = 20, color = defaultColor, smoothness = 0.5, fill = true, shadow = defaultShadow } = lineOptions ?? {}
    const canvas = ctx.canvas
    const canvasWidth = canvas.width / dpr
    const canvasHeight = canvas.height / dpr

    setupShadow(ctx, shadow)

    const availableWidth = canvasWidth
    const pointCount = Math.min(
      smoothedData.length,
      Math.floor(availableWidth / spacing),
    )

    if (pointCount === 0)
      return

    ctx.strokeStyle = createColorStyle(ctx, color, 0, canvasHeight, 0, 0)
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const sampleStep = smoothedData.length / pointCount
    const points: { x: number, y: number }[] = []

    for (let i = 0; i < pointCount; i++) {
      const dataIndex = Math.floor(i * sampleStep)
      const frequencyValue = smoothedData[dataIndex] || 0
      const normalizedValue = frequencyValue / 255
      const easedValue = easeInOutCubic(normalizedValue)

      points.push({
        x: i * spacing,
        y: canvasHeight - easedValue * canvasHeight * 0.8,
      })
    }

    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)

    for (let i = 1; i < points.length - 1; i++) {
      const curr = points[i]
      const next = points[i + 1]

      const cp1x = curr.x + (next.x - curr.x) * smoothness
      const cp1y = curr.y
      const cp2x = next.x - (next.x - curr.x) * smoothness
      const cp2y = next.y

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y)
    }
    ctx.lineTo(canvasWidth, canvasHeight)

    if (fill) {
      ctx.fillStyle = createColorStyle(ctx, color, 0, canvasHeight, 0, 0, true)
      ctx.fill()
    }

    ctx.stroke()

    resetShadow(ctx)
  }
  /**
   * 绘制环形柱状频谱
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
   */
  function drawCircleBarSpectrum(ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas
    const canvasWidth = canvas.width / dpr
    const canvasHeight = canvas.height / dpr
    const { radius = Math.min(canvasWidth, canvasHeight) * 0.3, width = 8, minHeight = 8, barRadius = 4, spacing = 2, color = defaultColor, shadow = defaultShadow, startAngle = 0, endAngle = Math.PI * 2 } = circleBarOptions ?? {}
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2

    setupShadow(ctx, shadow)

    const circumference = 2 * Math.PI * radius
    const barCount = Math.min(
      smoothedData.length,
      Math.floor(circumference / (width + spacing)),
    )

    if (barCount === 0)
      return

    ctx.fillStyle = createColorStyle(ctx, color, centerX - radius, centerY, centerX + radius, centerY)

    const sampleStep = smoothedData.length / barCount
    const angleStep = (endAngle - startAngle) / barCount

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor(i * sampleStep)
      const frequencyValue = smoothedData[dataIndex] || 0

      const normalizedValue = frequencyValue / 255
      const easedValue = easeInOutCubic(normalizedValue)
      const barHeight = Math.max(
        minHeight,
        easedValue * radius * 0.8,
      )

      const angle = startAngle + i * angleStep
      const barStartX = centerX + radius * Math.cos(angle)
      const barStartY = centerY + radius * Math.sin(angle)

      ctx.save()
      ctx.translate(barStartX, barStartY)
      ctx.rotate(angle + Math.PI / 2)
      drawRoundedRect(ctx, -width / 2, -barHeight, width, barHeight, barRadius)
      ctx.restore()
    }

    resetShadow(ctx)
  }
  /**
   * 绘制环形线性频谱
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
   */
  function drawCircleLineSpectrum(ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas
    const canvasWidth = canvas.width / dpr
    const canvasHeight = canvas.height / dpr
    const { radius = Math.min(canvasWidth, canvasHeight) * 0.3, width = 1, spacing = 10, color = defaultColor, shadow = defaultShadow, smoothness = 0.5, fill = true, startAngle = 0, endAngle = Math.PI * 2 } = circleLineOptions ?? {}
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2

    setupShadow(ctx, shadow)

    const circumference = 2 * Math.PI * radius
    const pointCount = Math.min(
      smoothedData.length,
      Math.floor(circumference / spacing),
    )

    if (pointCount === 0)
      return

    ctx.strokeStyle = createColorStyle(ctx, color, centerX - radius, centerY, centerX + radius, centerY)
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const sampleStep = smoothedData.length / pointCount
    const angleStep = (endAngle - startAngle) / pointCount
    const points: { x: number, y: number }[] = []

    for (let i = 0; i < pointCount; i++) {
      const dataIndex = Math.floor(i * sampleStep)
      const frequencyValue = smoothedData[dataIndex] || 0
      const normalizedValue = frequencyValue / 255
      const easedValue = easeInOutCubic(normalizedValue)

      const angle = startAngle + i * angleStep
      const pointRadius = i === 0 ? radius : radius + easedValue * radius * 0.8
      points.push(polarToCartesian(centerX, centerY, pointRadius, angle))
    }

    ctx.beginPath()

    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y)
    }

    for (let i = 1; i < points.length - 1; i++) {
      const curr = points[i]
      const next = points[i + 1]

      const currAngle = startAngle + i * angleStep
      const nextAngle = startAngle + (i + 1) * angleStep

      const currRadius = Math.sqrt((curr.x - centerX) ** 2 + (curr.y - centerY) ** 2)
      const nextRadius = Math.sqrt((next.x - centerX) ** 2 + (next.y - centerY) ** 2)

      const cp1Angle = currAngle + (nextAngle - currAngle) * smoothness
      const cp1Radius = currRadius + (nextRadius - currRadius) * smoothness
      const cp1 = polarToCartesian(centerX, centerY, cp1Radius, cp1Angle)

      const cp2Angle = nextAngle - (nextAngle - currAngle) * smoothness
      const cp2Radius = nextRadius - (nextRadius - currRadius) * smoothness
      const cp2 = polarToCartesian(centerX, centerY, cp2Radius, cp2Angle)

      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, next.x, next.y)
    }

    if (fill && points.length > 0) {
      const lastAngle = startAngle + (pointCount - 1) * angleStep

      ctx.lineTo(centerX + radius * Math.cos(lastAngle), centerY + radius * Math.sin(lastAngle))

      if (Math.abs(endAngle - startAngle) >= 2 * Math.PI - 0.001) {
        ctx.arc(centerX, centerY, radius, lastAngle, startAngle, true)
      }
      else {
        const startPointOnBase = polarToCartesian(centerX, centerY, radius, startAngle)
        ctx.lineTo(startPointOnBase.x, startPointOnBase.y)
      }

      ctx.closePath()
      ctx.fillStyle = createColorStyle(ctx, color, centerX - radius, centerY, centerX + radius, centerY, true)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length - 1; i++) {
        const curr = points[i]
        const next = points[i + 1]

        const currAngle = startAngle + i * angleStep
        const nextAngle = startAngle + (i + 1) * angleStep

        const currRadius = Math.sqrt((curr.x - centerX) ** 2 + (curr.y - centerY) ** 2)
        const nextRadius = Math.sqrt((next.x - centerX) ** 2 + (next.y - centerY) ** 2)

        const cp1Angle = currAngle + (nextAngle - currAngle) * smoothness
        const cp1Radius = currRadius + (nextRadius - currRadius) * smoothness
        const cp1 = polarToCartesian(centerX, centerY, cp1Radius, cp1Angle)

        const cp2Angle = nextAngle - (nextAngle - currAngle) * smoothness
        const cp2Radius = nextRadius - (nextRadius - currRadius) * smoothness
        const cp2 = polarToCartesian(centerX, centerY, cp2Radius, cp2Angle)

        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, next.x, next.y)
      }
    }

    ctx.stroke()

    ctx.save()
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.strokeStyle = Array.isArray(color) ? color[0] : `${color}AA`
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    resetShadow(ctx)
  }

  const { pause, resume, isActive } = useRafFn(() => {
    draw()
  }, { immediate: !manual })
  return {
    canvasRef,
    pause,
    resume,
    isActive,
  }
}
