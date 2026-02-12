import type { HTMLFontFace, ImageOptions, jsPDFOptions, TextOptions } from 'jspdf'
import { jsPDF as JsPDF } from 'jspdf'

export * from './utils'

/**
 * 颜色类型
 */
type Color = string | [number, number, number, number]

/**
 * 文本样式类型
 */
type TextStyle = {
  /**
   * 字体大小
   */
  fontSize?: number
  /**
   * 字体名称
   */
  fontName?: string
  /**
   * 字体样式
   */
  fontStyle?: HTMLFontFace['style']
  /**
   * 字体粗细
   */
  fontWeight?: HTMLFontFace['weight']
  /**
   * 文本颜色
   */
  textColor?: Color
}

/**
 * 绘制样式类型
 */
type DrawStyle = {
  /**
   * 绘制颜色
   */
  drawColor?: Color
  /**
   * 填充颜色
   */
  fillColor?: Color
  /**
   * 字符间距
   */
  charSpace?: number
  /**
   * 线宽
   */
  lineWidth?: number
  /**
   * 样式
   */
  style?: 'S' | 'F' | 'FD' | 'DF' | null
}

/**
 * PDF 样式类型
 */
type PDFStyle = TextStyle & DrawStyle & {
}

/**
 * PDF 数据类型
 */
type PDFDataType = 'text' | 'image' | 'circle' | 'line' | 'lines'

/**
 * 文本选项类型
 */
type OTextOptions = TextOptions & TextStyle

/**
 * 图片选项类型
 */
type OImageOptions = Omit<ImageOptions, 'imageData'> & {
  /**
   * 图片数据
   */
  imageData: ImageOptions['imageData'] | (() => ImageOptions['imageData']) | (() => Promise<ImageOptions['imageData']>)
}

/**
 * 圆形选项类型
 */
type OCircleOptions = DrawStyle & {
  /**
   * x 坐标
   */
  x: number
  /**
   * y 坐标
   */
  y: number
  /**
   * 半径
   */
  r: number
}

/**
 * 线段选项类型
 */
type OLineOptions = DrawStyle & {
  /**
   * 起点 x 坐标
   */
  x1: number
  /**
   * 起点 y 坐标
   */
  y1: number
  /**
   * 终点 x 坐标
   */
  x2: number
  /**
   * 终点 y 坐标
   */
  y2: number
}

/**
 * 多线段选项类型
 */
type OLinesOptions = DrawStyle & {
  /**
   * 线段数组
   */
  lines: number[][]
  /**
   * x 坐标
   */
  x: number
  /**
   * y 坐标
   */
  y: number
  /**
   * 缩放比例
   */
  scale?: [number, number]
  /**
   * 是否闭合
   */
  closed?: boolean
}

/**
 * PDF 数据行类型
 */
export type PDFDataRow<T extends PDFDataType = PDFDataType> = {
  /**
   * 数据类型
   */
  type: T
} & (
  T extends 'text' ? OTextOptions
    : T extends 'image' ? OImageOptions
      : T extends 'circle' ? OCircleOptions
        : T extends 'line' ? OLineOptions
          : T extends 'lines' ? OLinesOptions
            : never)

function setDrawStyle(pdf: JsPDF, data: { fillColor: Color, drawColor: Color, lineWidth: number }) {
  const { drawColor, fillColor, lineWidth } = data
  if (typeof fillColor === 'string') {
    pdf.setFillColor(fillColor)
  }
  else {
    pdf.setFillColor(...fillColor)
  }
  if (typeof drawColor === 'string') {
    pdf.setDrawColor(drawColor)
  }
  else {
    pdf.setDrawColor(...drawColor)
  }
  pdf.setLineWidth(lineWidth)
}

/**
 * 生成 PDF
 *
 * @param data - PDF 数据行数组
 * @param options - jsPDF 选项
 * @param globalStyle - 全局样式
 * @returns PDF 实例
 *
 * @example
 * ```ts
 * import { generatePDF } from '@oiij/js-pdf'
 *
 * const { pdf } = await generatePDF([
 *   {
 *     type: 'text',
 *     text: 'Hello World',
 *     x: 10,
 *     y: 10
 *   }
 * ])
 *
 * // 保存 PDF
 * pdf.save('example.pdf')
 * ```
 */
export async function generatePDF(data: PDFDataRow[], options?: jsPDFOptions, globalStyle?: PDFStyle) {
  const pdf = new JsPDF(options)
  const font = pdf.getFont()
  const { fontSize: _fontSize = pdf.getFontSize(), fontName: _fontName = font.fontName, fontStyle: _fontStyle = font.fontStyle, fontWeight: _fontWeight = 'normal', textColor: _textColor = pdf.getTextColor() } = globalStyle ?? {}
  const { drawColor: _drawColor = pdf.getDrawColor(), fillColor: _fillColor = pdf.getDrawColor(), charSpace: _charSpace = pdf.getCharSpace(), lineWidth: _lineWidth = pdf.getLineWidth(), style: _style = 'S' } = globalStyle ?? {}

  function setText(data: Omit<PDFDataRow<'text'>, 'type'>) {
    const { text, x, y, fontSize = _fontSize, fontName = _fontName, fontStyle = _fontStyle, fontWeight = _fontWeight, ...textOpt } = data
    pdf.setFontSize(fontSize)
    pdf.setFont(fontName, fontStyle, fontWeight)
    pdf.text(text, x, y, textOpt)
  }
  async function setImage(data: Omit<PDFDataRow<'image'>, 'type'>) {
    const { imageData, x, y, width, height, alias, compression, rotation } = data
    const _imageData = typeof imageData === 'function' ? await Promise.try(imageData) : imageData
    pdf.addImage(_imageData, x, y, width, height, alias, compression, rotation)
  }
  function setCircle(data: Omit<PDFDataRow<'circle'>, 'type'>) {
    const { x, y, r } = data
    const { fillColor = _fillColor, drawColor = _drawColor, lineWidth = _lineWidth, style = _style } = data
    setDrawStyle(pdf, { fillColor, drawColor, lineWidth })

    pdf.circle(x, y, r, style)
  }
  function setLine(data: Omit<PDFDataRow<'line'>, 'type'>) {
    const { x1, y1, x2, y2 } = data
    const { fillColor = _fillColor, drawColor = _drawColor, lineWidth = _lineWidth, style = _style } = data
    setDrawStyle(pdf, { fillColor, drawColor, lineWidth })
    pdf.line(x1, y1, x2, y2, style)
  }
  function setLines(data: Omit<PDFDataRow<'lines'>, 'type'>) {
    const { lines, x, y, scale = [1, 1], closed = false } = data
    const { fillColor = _fillColor, drawColor = _drawColor, lineWidth = _lineWidth, style = _style } = data
    setDrawStyle(pdf, { fillColor, drawColor, lineWidth })
    pdf.lines(lines, x, y, scale, style, closed)
  }

  for (const { type, ...opt } of data) {
    switch (type) {
      case 'text':
        setText(opt as Omit<PDFDataRow<'text'>, 'type'>)
        break
      case 'image':
        await setImage(opt as Omit<PDFDataRow<'image'>, 'type'>)
        break
      case 'circle':
        setCircle(opt as Omit<PDFDataRow<'circle'>, 'type'>)
        break
      case 'line':
        setLine(opt as Omit<PDFDataRow<'line'>, 'type'>)
        break
      case 'lines':
        setLines(opt as Omit<PDFDataRow<'lines'>, 'type'>)
        break
      default:
        break
    }
  }

  return {
    pdf,
  }
}
