# @oiij/js-pdf

[![NPM version](https://img.shields.io/npm/v/@oiij/js-pdf)](https://www.npmjs.com/package/@oiij/js-pdf)
[![MIT-license](https://img.shields.io/npm/l/@oiij/js-pdf)](https://github.com/oiij/use/blob/main/packages/js-pdf/LICENSE)

## 简介

Use JS-PDF 是基于 jsPDF 和 pdfjs-dist 的工具库，提供 PDF 生成、读取、转换等功能，帮助开发者在浏览器端处理 PDF 文件。

## 特点

### 📄 PDF 生成

- 📝 支持文本、图片、圆形、线条等元素
- 🖼️ 支持异步图片加载
- 🎨 支持自定义样式配置

### 📖 PDF 读取

- 🔗 支持从 URL 或 File 对象读取 PDF
- 🖥️ 支持渲染 PDF 为 Canvas
- 📑 支持多页 PDF 处理

### 📦 导出功能

- 📥 支持将 Canvas 导出为 PDF
- 📦 支持将 Canvas 打包为 ZIP

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/js-pdf

# 使用 npm
npm install @oiij/js-pdf

# 使用 yarn
yarn add @oiij/js-pdf
```

## 依赖

- `jspdf`: ^2.0.0
- `pdfjs-dist`: ^4.0.0
- `file-saver`: ^2.0.0
- `jszip`: ^3.0.0
- `nanoid`: ^5.0.0

## 示例

### 生成 PDF

```ts
import { generatePDF } from '@oiij/js-pdf'

const { pdf } = await generatePDF([
  {
    type: 'text',
    text: 'Hello World',
    x: 10,
    y: 10,
    fontSize: 20
  },
  {
    type: 'image',
    imageData: 'data:image/png;base64,...',
    x: 10,
    y: 30,
    width: 100,
    height: 100
  },
  {
    type: 'circle',
    x: 50,
    y: 80,
    r: 20,
    fillColor: 'red'
  }
])

pdf.save('example.pdf')
```

### 读取 PDF

```ts
import { openPdf } from '@oiij/js-pdf'

// 从 URL 读取
const result = await openPdf('https://example.com/file.pdf')

// 从 File 读取
const file = document.querySelector('input[type="file"]').files[0]
const result = await openPdf(file)

// result.pdf - PDF 文档
// result.pages - 页面数组
// result.canvases - Canvas 数组
```

### Canvas 转 PDF

```ts
import { canvas2Pdf, openPdf } from '@oiij/js-pdf'

const { canvases } = await openPdf('file.pdf')
canvas2Pdf(canvases, 'output.pdf')
```

### Canvas 转 ZIP

```ts
import { canvas2Zip, openPdf } from '@oiij/js-pdf'

const { canvases } = await openPdf('file.pdf')
await canvas2Zip(canvases, 'output')
```

## API

### `generatePDF(data, options?, globalStyle?)`

生成 PDF 文档。

#### 参数

| 参数          | 类型           | 说明             |
| ------------- | -------------- | ---------------- |
| `data`        | `PDFDataRow[]` | PDF 数据行数组   |
| `options`     | `jsPDFOptions` | jsPDF 初始化选项 |
| `globalStyle` | `PDFStyle`     | 全局样式         |

#### 返回值

| 属性  | 类型    | 说明       |
| ----- | ------- | ---------- |
| `pdf` | `jsPDF` | jsPDF 实例 |

### `openPdf(url?)`

打开并读取 PDF 文件。

#### 参数

| 参数  | 类型                    | 说明                        |
| ----- | ----------------------- | --------------------------- |
| `url` | `string \| URL \| File` | PDF 文件的 URL 或 File 对象 |

#### 返回值

| 属性       | 类型                  | 说明         |
| ---------- | --------------------- | ------------ |
| `pdf`      | `PDFDocumentProxy`    | PDF 文档对象 |
| `pages`    | `PDFPageProxy[]`      | 页面数组     |
| `id`       | `string`              | 唯一 ID      |
| `canvases` | `HTMLCanvasElement[]` | Canvas 数组  |

### `canvas2Pdf(canvases, fileName)`

将 Canvas 数组转换为 PDF 并下载。

#### 参数

| 参数       | 类型                  | 说明        |
| ---------- | --------------------- | ----------- |
| `canvases` | `HTMLCanvasElement[]` | Canvas 数组 |
| `fileName` | `string`              | 文件名      |

### `canvas2Zip(canvases, fileName)`

将 Canvas 数组转换为 ZIP 并下载。

#### 参数

| 参数       | 类型                  | 说明        |
| ---------- | --------------------- | ----------- |
| `canvases` | `HTMLCanvasElement[]` | Canvas 数组 |
| `fileName` | `string`              | 文件名      |

### `readPdfFile(buffer)`

从 ArrayBuffer 读取 PDF 文件。

#### 参数

| 参数     | 类型          | 说明                   |
| -------- | ------------- | ---------------------- |
| `buffer` | `ArrayBuffer` | PDF 文件的 ArrayBuffer |

## PDFDataRow 类型

### text 类型

```ts
type TextDataRow = {
  type: 'text'
  text: string
  x: number
  y: number
  fontSize?: number
  fontName?: string
  fontStyle?: string
  fontWeight?: string
  textColor?: Color
  align?: string
  baseline?: string
}
```

### image 类型

```ts
type ImageDataRow = {
  type: 'image'
  imageData: string | HTMLImageElement | (() => Promise<HTMLImageElement>)
  x: number
  y: number
  width: number
  height: number
  alias?: string
  compression?: string
  rotation?: number
}
```

### circle 类型

```ts
type CircleDataRow = {
  type: 'circle'
  x: number
  y: number
  r: number
  fillColor?: Color
  drawColor?: Color
  lineWidth?: number
  style?: 'S' | 'F' | 'FD' | 'DF'
}
```

### line 类型

```ts
type LineDataRow = {
  type: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
  drawColor?: Color
  lineWidth?: number
  style?: 'S' | 'F' | 'FD' | 'DF'
}
```

### lines 类型

```ts
type LinesDataRow = {
  type: 'lines'
  lines: number[][]
  x: number
  y: number
  scale?: [number, number]
  closed?: boolean
  drawColor?: Color
  lineWidth?: number
  style?: 'S' | 'F' | 'FD' | 'DF'
}
```

## 类型定义

```ts
type Color = string | [number, number, number, number]

type PDFStyle = {
  fontSize?: number
  fontName?: string
  fontStyle?: string
  fontWeight?: string
  textColor?: Color
  drawColor?: Color
  fillColor?: Color
  lineWidth?: number
}

type PDFDataRow = {
  type: 'text' | 'image' | 'circle' | 'line' | 'lines'
  // ... 具体选项根据 type 不同
}

export declare function generatePDF(data: PDFDataRow[], options?: jsPDFOptions, globalStyle?: PDFStyle): Promise<{ pdf: jsPDF }>
export declare function openPdf(url?: string | URL | File): Promise<{ pdf: PDFDocumentProxy, pages: PDFPageProxy[], id: string, canvases: HTMLCanvasElement[] }>
export declare function canvas2Pdf(canvases: HTMLCanvasElement[], fileName: string): void
export declare function canvas2Zip(canvases: HTMLCanvasElement[], fileName: string): Promise<unknown>
export declare function readPdfFile(buffer: ArrayBuffer): Promise<{ pdf: PDFDocumentProxy, pages: PDFPageProxy[], id: string, canvases: HTMLCanvasElement[] }>
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/js-pdf/js-pdf)
