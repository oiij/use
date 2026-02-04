# UseJsPDF

## 功能描述

**UseJsPDF** 是一个用于 PDF 操作的 Vue 组合式函数，支持 PDF 文档的创建、编辑、渲染和导出，可用于生成和处理 PDF 文件。

## 安装

```bash
# 使用 npm
npm install @oiij/js-pdf

# 使用 yarn
yarn add @oiij/js-pdf

# 使用 pnpm
pnpm add @oiij/js-pdf
```

## 基本使用

<demo vue="./js-pdf.vue" title="UseJsPDF" />

## API

### 函数签名

```ts
declare function openPdf(url?: string | URL | File): Promise<{ pdf: PDFDocumentProxy, pages: PDFPageProxy[], id: string, canvases: HTMLCanvasElement[] } | undefined>
declare function canvas2Pdf(canvases: HTMLCanvasElement[], fileName: string): void
declare function canvas2Zip(canvases: HTMLCanvasElement[], fileName: string): Promise<unknown>
declare function readPdfFile(buffer: ArrayBuffer): Promise<{ pdf: PDFDocumentProxy, pages: PDFPageProxy[], id: string, canvases: HTMLCanvasElement[] }>
declare function generatePDF(data: PDFDataRow[], options?: jsPDFOptions, globalStyle?: PDFStyle): Promise<{ pdf: jsPDF }>
```

## 类型定义

```ts
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
declare function openPdf(url?: string | URL | File): Promise<{ pdf: PDFDocumentProxy, pages: PDFPageProxy[], id: string, canvases: HTMLCanvasElement[] } | undefined>
declare function canvas2Pdf(canvases: HTMLCanvasElement[], fileName: string): void
declare function canvas2Zip(canvases: HTMLCanvasElement[], fileName: string): Promise<unknown>
declare function readPdfFile(buffer: ArrayBuffer): Promise<{ pdf: PDFDocumentProxy, pages: PDFPageProxy[], id: string, canvases: HTMLCanvasElement[] }>
declare function generatePDF(data: PDFDataRow[], options?: jsPDFOptions, globalStyle?: PDFStyle): Promise<{ pdf: jsPDF }>
```
