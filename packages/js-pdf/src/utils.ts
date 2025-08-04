import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import { saveAs } from 'file-saver'
import { jsPDF as JsPDF } from 'jspdf'
import JsZip from 'jszip'
import { nanoid } from 'nanoid'
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`

function file2Buffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      return resolve(reader.result as ArrayBuffer)
    }
    reader.onerror = () => {
      return reject(reader.error?.message)
    }
    reader.readAsArrayBuffer(file)
  })
}
function createCanvas(width: number, height: number, id: string) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.id = id
  canvas.width = width
  canvas.height = height
  return {
    canvas,
    ctx,
  }
}
function page2Canvas(page: PDFPageProxy, id: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const pixelRatio = Math.max(window.devicePixelRatio, 2)
    const viewport = page.getViewport({ scale: pixelRatio })
    const { width, height } = viewport
    const { canvas, ctx } = createCanvas(width, height, `page-${id}-${page._pageIndex}`)
    canvas.style.width = `${width / pixelRatio}px`
    canvas.style.height = `${height / pixelRatio}px`
    page.render({
      canvasContext: ctx,
      canvas,
      viewport,
    }).promise.then(() => resolve(canvas)).catch(e => reject(e))
  })
}
async function pdf2Canvases(pdf: PDFDocumentProxy) {
  try {
    const pages = await Promise.all(Array.from({ length: pdf.numPages }).map((_, i) => pdf.getPage(i + 1)))
    const id = nanoid()
    const canvases = await Promise.all(pages.map(page => page2Canvas(page, id)))
    return {
      pages,
      id,
      canvases,
    }
  }
  catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}
export async function openPdf(url?: string | URL | File) {
  try {
    if (url && (typeof url === 'string' || url instanceof URL)) {
      const pdf = await getDocument(url).promise
      const { pages, id, canvases } = await pdf2Canvases(pdf)
      return {
        pdf,
        pages,
        id,
        canvases,
      }
    }
    if (url instanceof File) {
      const buffer = await file2Buffer(url)
      const pdf = await getDocument(buffer).promise
      const { pages, id, canvases } = await pdf2Canvases(pdf)
      return {
        pdf,
        pages,
        id,
        canvases,
      }
    }
  }
  catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}
function canvas2Blob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          return resolve(blob)
        }
        return reject(new Error('canvas to blob error'))
      })
    }
    catch (error) {
      return reject(error)
    }
  })
}
export function canvas2Pdf(canvases: HTMLCanvasElement[], fileName: string) {
  let doc: JsPDF | null = null

  canvases.forEach((canvas, i) => {
    const width = Number((canvas.width / 2 / 72 * 25.4).toFixed())
    const height = Number((canvas.height / 2 / 72 * 25.4).toFixed())

    if (!doc) {
      doc = new JsPDF({
        unit: 'mm',
        format: [width, height],
      })
    }
    if (i > 0) {
      doc.addPage([width, height])
    }
    doc.setPage(i + 1)

    doc.addImage(canvas, 'PNG', 0, 0, width, height)

    if (i === canvases.length - 1) {
      doc.save(fileName)
    }
    return doc
  })
}

export function canvas2Zip(canvases: HTMLCanvasElement[], fileName: string) {
  return new Promise((resolve, reject) => {
    const zip = new JsZip()
    Promise.all(canvases.map(canvas => canvas2Blob(canvas))).then((blobs) => {
      blobs.forEach((blob, i) => {
        zip.file(`${canvases[i].id}.jpg`, blob)
      })
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, `${fileName}.zip`)
        return resolve(blobs)
      }).catch(error => reject(error))
    }).catch(error => reject(error))
  })
}
export async function readPdfFile(buffer: ArrayBuffer) {
  const pdf = await getDocument(buffer).promise
  const { pages, id, canvases } = await pdf2Canvases(pdf)
  return {
    pdf,
    pages,
    id,
    canvases,
  }
}
