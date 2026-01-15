import type { TemplateRef } from 'vue'
import { useRafFn } from '@vueuse/core'

export type SpectrumBarOptions = {
  width?: number
  minHeight?: number
  spacing?: number
  radius?: number
  color?: [string, string] | string
  shadow?: boolean
}
export type SpectrumLineOptions = {
  width?: number
  spacing?: number
  color?: [string, string] | string
  smoothness?: number
  fill?: boolean
  shadow?: boolean
}

export type SpectrumCircleBarOptions = {
  width?: number
  minHeight?: number
  spacing?: number
  radius?: number
  barRadius?: number
  color?: [string, string] | string
  startAngle?: number
  endAngle?: number
  shadow?: boolean
}
export type SpectrumCircleLineOptions = {
  width?: number
  spacing?: number
  radius?: number
  color?: [string, string] | string
  smoothness?: number
  fill?: boolean
  startAngle?: number
  endAngle?: number
  shadow?: boolean

}
export type SpectrumOptions = {
  type?: 'bar' | 'line' | 'circle-bar' | 'circle-line'
  color?: [string, string] | string
  shadow?: boolean
  barOptions?: SpectrumBarOptions
  lineOptions?: SpectrumLineOptions
  circleBarOptions?: SpectrumCircleBarOptions
  circleLineOptions?: SpectrumCircleLineOptions
  animationSpeed?: number
  manual?: boolean
}
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}
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
// 将极坐标转换为笛卡尔坐标
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInRadians: number) {
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  }
}
function setupShadow(ctx: CanvasRenderingContext2D, shadow: boolean) {
  if (shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 5
  }
}
export function useSpectrum(canvasRef: TemplateRef<HTMLCanvasElement>, frequencyDataGetter: () => Uint8Array<ArrayBuffer>, options?: SpectrumOptions) {
  const { type = 'bar', color: defaultColor = '#00FFAA', shadow: defaultShadow = true, barOptions, lineOptions, circleBarOptions, circleLineOptions, animationSpeed = 0.5, manual } = options ?? {}
  const dpr = window.devicePixelRatio || 1
  let smoothedData: number[] = []
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
  function draw() {
    const canvas = canvasRef.value
    if (!canvas) {
      throw new Error('canvasRef is not a valid canvas element')
    }
    canvas.width = canvasRef.value.clientWidth * dpr
    canvas.height = canvasRef.value.clientHeight * dpr

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('canvasRef is not a valid canvas element')
    }
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updateFrequencyData()

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
  function drawBarSpectrum(ctx: CanvasRenderingContext2D) {
    const { width = 8, minHeight = 8, spacing = 2, radius = 4, color = defaultColor, shadow = defaultShadow } = barOptions ?? {}
    const canvas = ctx.canvas
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    // 设置阴影效果
    setupShadow(ctx, shadow)

    // 计算柱形数量
    const availableWidth = canvasWidth
    const barCount = Math.min(
      smoothedData.length,
      Math.floor(availableWidth / (width + spacing)),
    )

    // 如果没有数据，不绘制
    if (barCount === 0)
      return

    // 创建渐变
    let fillStyle: CanvasGradient | string
    if (Array.isArray(color)) {
      fillStyle = ctx.createLinearGradient(
        0,
        canvasHeight,
        0,
        0,
      )
      fillStyle.addColorStop(0, color[0])
      fillStyle.addColorStop(1, color[1])
    }
    else {
      fillStyle = color
    }

    // 设置填充样式
    ctx.fillStyle = fillStyle

    // 计算采样步长，确保频谱数据完整显示
    const sampleStep = smoothedData.length / barCount

    // 绘制每个柱形
    for (let i = 0; i < barCount; i++) {
      // 计算采样索引，从完整的频谱数据中均匀采样
      const dataIndex = Math.floor(i * sampleStep)
      // 使用平滑后的数据
      const frequencyValue = smoothedData[dataIndex] || 0

      // 计算柱形高度（带非线性映射，使低频更明显）
      const normalizedValue = frequencyValue / 255
      const easedValue = easeInOutCubic(normalizedValue)
      const barHeight = Math.max(
        minHeight,
        easedValue * canvasHeight * 0.8,
      )

      // 计算柱形位置
      const x = i * (width + spacing)
      const y = canvasHeight - barHeight

      // 绘制圆角柱形
      drawRoundedRect(ctx, x, y, width, barHeight, radius)
    }

    // 重置阴影
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  }
  function drawLineSpectrum(ctx: CanvasRenderingContext2D) {
    const { width = 1, spacing = 20, color = defaultColor, smoothness = 0.5, fill = true, shadow = defaultShadow } = lineOptions ?? {}
    const canvas = ctx.canvas
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // 设置阴影效果
    setupShadow(ctx, shadow)

    // 计算采样点数量
    const availableWidth = canvasWidth
    const pointCount = Math.min(
      smoothedData.length,
      Math.floor(availableWidth / spacing),
    )

    // 如果没有数据，不绘制
    if (pointCount === 0)
      return

    // 创建渐变
    let strokeStyle: CanvasGradient | string
    let fillStyle: CanvasGradient | string | null = null

    if (Array.isArray(color)) {
      strokeStyle = ctx.createLinearGradient(
        0,
        canvasHeight,
        0,
        0,
      )
      strokeStyle.addColorStop(0, color[0])
      strokeStyle.addColorStop(1, color[1])

      if (fill) {
        fillStyle = ctx.createLinearGradient(
          0,
          canvasHeight,
          0,
          0,
        )
        fillStyle.addColorStop(0, `${color[0]}80`) // 添加透明度
        fillStyle.addColorStop(1, `${color[1]}20`) // 添加透明度
      }
    }
    else {
      strokeStyle = color
      if (fill) {
        fillStyle = `${color}40` // 添加透明度
      }
    }

    // 设置线条样式
    ctx.strokeStyle = strokeStyle
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // 计算采样步长
    const sampleStep = smoothedData.length / pointCount

    // 收集所有点的坐标
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

    // 开始绘制路径
    ctx.beginPath()

    // 绘制第一个点
    ctx.moveTo(0, canvasHeight)

    // 使用二次贝塞尔曲线绘制平滑线条
    for (let i = 1; i < points.length - 1; i++) {
      const curr = points[i]
      const next = points[i + 1]

      // 计算控制点
      const cp1x = curr.x + (next.x - curr.x) * smoothness
      const cp1y = curr.y
      const cp2x = next.x - (next.x - curr.x) * smoothness
      const cp2y = next.y

      // 绘制三次贝塞尔曲线
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y)
    }
    ctx.lineTo(canvasWidth, canvasHeight)
    // 如果有填充，闭合路径并填充
    if (fill && fillStyle) {
      ctx.fillStyle = fillStyle
      ctx.fill()
    }

    // 绘制线条
    ctx.stroke()

    // 重置阴影
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  }
  // 绘制圆环形式的柱状频谱
  function drawCircleBarSpectrum(ctx: CanvasRenderingContext2D) {
    const { radius = Math.min(canvasRef.value!.width, canvasRef.value!.height) * 0.3, width = 8, minHeight = 8, barRadius = 4, spacing = 2, color = defaultColor, shadow = defaultShadow, startAngle = 0, endAngle = Math.PI * 2 } = circleBarOptions ?? {}
    const canvas = ctx.canvas
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // 设置阴影效果
    setupShadow(ctx, shadow)

    // 计算柱形数量
    const circumference = 2 * Math.PI * radius
    const barCount = Math.min(
      smoothedData.length,
      Math.floor(circumference / (width + spacing)),
    )

    // 如果没有数据，不绘制
    if (barCount === 0)
      return

    // 创建渐变
    let fillStyle: CanvasGradient | string
    if (Array.isArray(color)) {
      fillStyle = ctx.createLinearGradient(
        centerX - radius,
        centerY,
        centerX + radius,
        centerY,
      )
      fillStyle.addColorStop(0, color[0])
      fillStyle.addColorStop(1, color[1])
    }
    else {
      fillStyle = color
    }

    // 设置填充样式
    ctx.fillStyle = fillStyle

    // 计算采样步长，确保频谱数据完整显示
    const sampleStep = smoothedData.length / barCount
    const angleStep = (endAngle - startAngle) / barCount

    // 绘制每个柱形
    for (let i = 0; i < barCount; i++) {
      // 计算采样索引，从完整的频谱数据中均匀采样
      const dataIndex = Math.floor(i * sampleStep)
      // 使用平滑后的数据
      const frequencyValue = smoothedData[dataIndex] || 0

      // 计算柱形高度（带非线性映射，使低频更明显）
      const normalizedValue = frequencyValue / 255
      const easedValue = easeInOutCubic(normalizedValue)
      const barHeight = Math.max(
        minHeight,
        easedValue * radius * 0.8,
      )

      // 计算柱形位置和角度
      const angle = startAngle + i * angleStep
      // 计算圆条的起点位置（在圆环上）
      const barStartX = centerX + radius * Math.cos(angle)
      const barStartY = centerY + radius * Math.sin(angle)

      // 手动处理旋转
      ctx.save()

      // 平移到圆条的起点位置
      ctx.translate(barStartX, barStartY)

      // 旋转到正确的角度
      ctx.rotate(angle + Math.PI / 2)

      // 绘制圆角柱形
      drawRoundedRect(ctx, -width / 2, -barHeight, width, barHeight, barRadius)

      // 恢复上下文状态
      ctx.restore()
    }

    // 重置阴影
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  }
  // 绘制圆环形式的线性频谱
  function drawCircleLineSpectrum(ctx: CanvasRenderingContext2D) {
    const { radius = Math.min(canvasRef.value!.width, canvasRef.value!.height) * 0.3, width = 1, spacing = 10, color = defaultColor, shadow = defaultShadow, smoothness = 0.5, fill = true, startAngle = 0, endAngle = Math.PI * 2 } = circleLineOptions ?? {}
    const canvas = ctx.canvas
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    // 设置阴影效果
    setupShadow(ctx, shadow)

    // 计算采样点数量
    const circumference = 2 * Math.PI * radius
    const pointCount = Math.min(
      smoothedData.length,
      Math.floor(circumference / spacing),
    )

    // 如果没有数据，不绘制
    if (pointCount === 0)
      return

    // 创建渐变
    let strokeStyle: CanvasGradient | string
    let fillStyle: CanvasGradient | string | null = null

    if (Array.isArray(color)) {
      strokeStyle = ctx.createLinearGradient(
        centerX - radius,
        centerY,
        centerX + radius,
        centerY,
      )
      strokeStyle.addColorStop(0, color[0])
      strokeStyle.addColorStop(1, color[1])

      if (fill) {
        fillStyle = ctx.createLinearGradient(
          centerX - radius,
          centerY,
          centerX + radius,
          centerY,
        )
        fillStyle.addColorStop(0, `${color[0]}80`) // 添加透明度
        fillStyle.addColorStop(1, `${color[1]}20`) // 添加透明度
      }
    }
    else {
      strokeStyle = color
      if (fill) {
        fillStyle = `${color}40` // 添加透明度
      }
    }

    // 设置线条样式
    ctx.strokeStyle = strokeStyle
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // 计算采样步长和角度步长
    const sampleStep = smoothedData.length / pointCount
    const angleStep = (endAngle - startAngle) / pointCount

    // 收集所有点的坐标
    const points: { x: number, y: number }[] = []

    for (let i = 0; i < pointCount; i++) {
      const dataIndex = Math.floor(i * sampleStep)
      const frequencyValue = smoothedData[dataIndex] || 0
      const normalizedValue = frequencyValue / 255
      const easedValue = easeInOutCubic(normalizedValue)

      // 计算当前角度
      const angle = startAngle + i * angleStep
      // 计算点的半径（基础半径 + 频率高度），将第一个点固定在圆环之上
      const pointRadius = i === 0 ? radius : radius + easedValue * radius * 0.8
      // 将极坐标转换为笛卡尔坐标
      points.push(polarToCartesian(centerX, centerY, pointRadius, angle))
    }

    // 开始绘制路径
    ctx.beginPath()

    // 绘制第一个点
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y)
    }

    // 使用三次贝塞尔曲线绘制平滑线条
    for (let i = 1; i < points.length - 1; i++) {
      const curr = points[i]
      const next = points[i + 1]

      // 计算控制点
      // 对于圆形路径，我们需要根据角度计算控制点的位置
      const currAngle = startAngle + i * angleStep
      const nextAngle = startAngle + (i + 1) * angleStep

      // 计算当前点和下一个点的半径
      const currRadius = Math.sqrt((curr.x - centerX) ** 2 + (curr.y - centerY) ** 2)
      const nextRadius = Math.sqrt((next.x - centerX) ** 2 + (next.y - centerY) ** 2)

      // 计算控制点1：当前点沿切线方向向外延伸
      const cp1Angle = currAngle + (nextAngle - currAngle) * smoothness
      const cp1Radius = currRadius + (nextRadius - currRadius) * smoothness
      const cp1 = polarToCartesian(centerX, centerY, cp1Radius, cp1Angle)

      // 计算控制点2：下一个点沿切线方向向内延伸
      const cp2Angle = nextAngle - (nextAngle - currAngle) * smoothness
      const cp2Radius = nextRadius - (nextRadius - currRadius) * smoothness
      const cp2 = polarToCartesian(centerX, centerY, cp2Radius, cp2Angle)

      // 绘制三次贝塞尔曲线
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, next.x, next.y)
    }

    // 如果有填充，绘制填充区域（只填充频谱曲线和基础圆环之间的部分）
    if (fill && fillStyle && points.length > 0) {
    // 绘制回到基础圆环的路径
      const lastAngle = startAngle + (pointCount - 1) * angleStep

      // 移动到基础圆环上的对应点
      ctx.lineTo(centerX + radius * Math.cos(lastAngle), centerY + radius * Math.sin(lastAngle))

      // 绘制基础圆环的曲线回到起点
      if (Math.abs(endAngle - startAngle) >= 2 * Math.PI - 0.001) {
      // 完整圆环，使用圆弧绘制基础圆环
        ctx.arc(centerX, centerY, radius, lastAngle, startAngle, true)
      }
      else {
      // 部分圆环，使用直线或曲线连接回起点
        const startPointOnBase = polarToCartesian(centerX, centerY, radius, startAngle)
        ctx.lineTo(startPointOnBase.x, startPointOnBase.y)
      }

      // 闭合路径
      ctx.closePath()

      // 填充路径
      ctx.fillStyle = fillStyle
      ctx.fill()

      // 重新开始绘制线条路径
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      // 重新绘制频谱曲线
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

    // 绘制线条
    ctx.stroke()

    // 绘制中心固定圆环
    ctx.save()
    ctx.shadowColor = 'transparent' // 中心圆环不需要阴影
    ctx.shadowBlur = 0
    ctx.strokeStyle = Array.isArray(color) ? color[0] : `${color}AA` // 使用主色调的半透明版本
    ctx.lineWidth = width // 中心圆环宽度
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2) // 绘制中心圆环，半径为基础半径的80%
    ctx.stroke()
    ctx.restore()

    // 重置阴影
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
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
