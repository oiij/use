import type { HTMLFontFace, ImageOptions, jsPDFOptions, TextOptions } from 'jspdf'
import { jsPDF as JsPDF } from 'jspdf'

export * from './utils'
type Color = string | [number, number, number, number]
interface TextStyle {
  fontSize?: number
  fontName?: string
  fontStyle?: HTMLFontFace['style']
  fontWeight?: HTMLFontFace['weight']
  textColor?: Color

}
interface DrawStyle {
  drawColor?: Color
  fillColor?: Color
  charSpace?: number
  lineWidth?: number
  style?: 'S' | 'F' | 'FD' | 'DF' | null
}
type PDFStyle = TextStyle & DrawStyle & {

}
type PDFDataType = 'text' | 'image' | 'circle' | 'line' | 'lines'

type OTextOptions = TextOptions & TextStyle
type OImageOptions = Omit<ImageOptions, 'imageData'> & {
  imageData: ImageOptions['imageData'] | (() => ImageOptions['imageData']) | (() => Promise<ImageOptions['imageData']>)
}
type OCircleOptions = DrawStyle & {
  x: number
  y: number
  r: number
}
type OLineOptions = DrawStyle & {
  x1: number
  y1: number
  x2: number
  y2: number
}
type OLinesOptions = DrawStyle & {
  lines: number[][]
  x: number
  y: number
  scale?: [number, number]
  closed?: boolean
}
export type PDFDataRow<T extends PDFDataType = PDFDataType> = {
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
