# UseJsPDF

## 功能描述

**UseJsPDF** 是一个用于 PDF 操作的工具库，支持 PDF 文档的创建、编辑、渲染和导出，可用于生成和处理 PDF 文件。

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

## 基本使用

<demo vue="./js-pdf.vue" title="UseJsPDF" />

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

### `canvas2Zip(canvases, fileName)`

将 Canvas 数组转换为 ZIP 并下载。

### `readPdfFile(buffer)`

从 ArrayBuffer 读取 PDF 文件。

## 类型定义

```ts
type Color = string | [number, number, number, number]

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
   * 线宽
   */
  lineWidth?: number
  /**
   * 样式
   */
  style?: 'S' | 'F' | 'FD' | 'DF' | null
}

type PDFStyle = TextStyle & DrawStyle

type PDFDataRow<T extends PDFDataType = PDFDataType> = {
  type: T
} & (
  T extends 'text' ? OTextOptions
    : T extends 'image' ? OImageOptions
      : T extends 'circle' ? OCircleOptions
        : T extends 'line' ? OLineOptions
          : T extends 'lines' ? OLinesOptions
            : never
)

export declare function generatePDF(data: PDFDataRow[], options?: jsPDFOptions, globalStyle?: PDFStyle): Promise<{ pdf: jsPDF }>
export declare function openPdf(url?: string | URL | File): Promise<{ pdf: PDFDocumentProxy, pages: PDFPageProxy[], id: string, canvases: HTMLCanvasElement[] } | undefined>
export declare function canvas2Pdf(canvases: HTMLCanvasElement[], fileName: string): void
export declare function canvas2Zip(canvases: HTMLCanvasElement[], fileName: string): Promise<unknown>
export declare function readPdfFile(buffer: ArrayBuffer): Promise<{ pdf: PDFDocumentProxy, pages: PDFPageProxy[], id: string, canvases: HTMLCanvasElement[] }>
```

## 使用示例

### 生成简单 PDF

```ts
import { generatePDF } from '@oiij/js-pdf'

const { pdf } = await generatePDF([
  {
    type: 'text',
    text: 'Hello World',
    x: 10,
    y: 10,
    fontSize: 20
  }
])

pdf.save('hello.pdf')
```

### 生成带图片的 PDF

```ts
import { generatePDF } from '@oiij/js-pdf'

const { pdf } = await generatePDF([
  {
    type: 'text',
    text: '带图片的 PDF',
    x: 10,
    y: 10
  },
  {
    type: 'image',
    imageData: () => {
      return new Promise((resolve) => {
        const img = document.createElement('img')
        img.src = 'https://example.com/image.jpg'
        img.onload = () => resolve(img)
      })
    },
    x: 10,
    y: 20,
    width: 100,
    height: 100
  }
])

pdf.save('image.pdf')
```

### 生成带图形的 PDF

```ts
import { generatePDF } from '@oiij/js-pdf'

const { pdf } = await generatePDF([
  {
    type: 'circle',
    x: 50,
    y: 50,
    r: 20,
    fillColor: 'red',
    style: 'F'
  },
  {
    type: 'line',
    x1: 10,
    y1: 80,
    x2: 100,
    y2: 80,
    drawColor: 'blue',
    lineWidth: 2
  },
  {
    type: 'lines',
    lines: [[10, 0], [0, 10], [-10, 0], [0, -10]],
    x: 80,
    y: 50,
    drawColor: 'green',
    closed: true
  }
])

pdf.save('shapes.pdf')
```

### 读取并渲染 PDF

```ts
import { openPdf } from '@oiij/js-pdf'

const result = await openPdf('https://example.com/file.pdf')
if (result) {
  const { canvases } = result
  // 将 Canvas 添加到页面
  canvases.forEach((canvas) => {
    document.body.appendChild(canvas)
  })
}
```

### 读取 PDF 并导出为 ZIP

```ts
import { canvas2Zip, openPdf } from '@oiij/js-pdf'

const result = await openPdf('file.pdf')
if (result) {
  await canvas2Zip(result.canvases, 'pdf-pages')
}
```

### 全局样式配置

```ts
import { generatePDF } from '@oiij/js-pdf'

const { pdf } = await generatePDF(
  [
    { type: 'text', text: '标题', x: 10, y: 10 },
    { type: 'text', text: '正文内容', x: 10, y: 30 }
  ],
  { orientation: 'landscape' },
  {
    fontSize: 16,
    fontName: 'helvetica',
    textColor: '#333333'
  }
)

pdf.save('styled.pdf')
```
