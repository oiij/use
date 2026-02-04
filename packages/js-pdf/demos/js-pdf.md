# JsPDF

[官方文档](https://www.jspdf.top/)

## 安装

```bash
pnpm add @oiij/js-pdf
```

## 示例

<demo vue="./js-pdf.vue" />

## Types

```ts
declare function openPdf(url?: string | URL | File): Promise<{
  pdf: pdfjs_dist_types_src_display_api0.PDFDocumentProxy
  pages: pdfjs_dist_types_src_display_api0.PDFPageProxy[]
  id: string
  canvases: HTMLCanvasElement[]
} | undefined>
declare function canvas2Pdf(canvases: HTMLCanvasElement[], fileName: string): void
declare function canvas2Zip(canvases: HTMLCanvasElement[], fileName: string): Promise<unknown>
declare function readPdfFile(buffer: ArrayBuffer): Promise<{
  pdf: pdfjs_dist_types_src_display_api0.PDFDocumentProxy
  pages: pdfjs_dist_types_src_display_api0.PDFPageProxy[]
  id: string
  canvases: HTMLCanvasElement[]
}>
// #endregion
// #region src/index.d.ts
type Color = string | [number, number, number, number]
type TextStyle = {
  fontSize?: number
  fontName?: string
  fontStyle?: HTMLFontFace['style']
  fontWeight?: HTMLFontFace['weight']
  textColor?: Color
}
type DrawStyle = {
  drawColor?: Color
  fillColor?: Color
  charSpace?: number
  lineWidth?: number
  style?: 'S' | 'F' | 'FD' | 'DF' | null
}
type PDFStyle = TextStyle & DrawStyle & {}
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
type PDFDataRow<T extends PDFDataType = PDFDataType> = {
  type: T
} & (T extends 'text' ? OTextOptions : T extends 'image' ? OImageOptions : T extends 'circle' ? OCircleOptions : T extends 'line' ? OLineOptions : T extends 'lines' ? OLinesOptions : never)
declare function generatePDF(data: PDFDataRow[], options?: jsPDFOptions, globalStyle?: PDFStyle): Promise<{
  pdf: jsPDF
}>
```
