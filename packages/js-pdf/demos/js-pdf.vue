<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { PDFDataRow } from '@oiij/js-pdf'
import { generatePDF, readPdfFile } from '@oiij/js-pdf'
import { NButton, NCard, NFlex } from 'naive-ui'
import { useTemplateRef } from 'vue'

const domRef = useTemplateRef('domRef')
const data: PDFDataRow[] = [
  {
    type: 'text',
    text: 'Hello, world',
    x: 10,
    y: 5,
    imageData: '',
  },
  {
    type: 'image',
    imageData: () => {
      return new Promise((resolve) => {
        const img = document.createElement('img')
        img.src = 'https://picsum.photos/200'
        img.onload = () => {
          resolve(img)
        }
      })
    },
    x: 10,
    y: 10,
    width: 100,
    height: 100,
  },
  {
    type: 'circle',
    x: 60,
    y: 80,
    r: 20,
    fillColor: 'red',
    drawColor: 'red',
    style: 'S',
    lineWidth: 5,
  },
  {
    type: 'line',
    x1: 30,
    y1: 50,
    x2: 100,
    y2: 50,
  },
  {
    type: 'lines',
    lines: [
      [10, 0],
      [0, 10],
      [-10, 0],
      [0, -10],
    ],
    x: 50,
    y: 40,
    drawColor: 'red',
    lineWidth: 2,
  },
]
async function handleClick() {
  const { pdf } = await generatePDF(data)
  const { canvases } = await readPdfFile(pdf.output('arraybuffer'))
  if (domRef.value) {
    domRef.value.innerHTML = ''
  }
  for (const canvas of canvases) {
    domRef.value?.appendChild(canvas)
  }
}
</script>

<template>
  <NFlex vertical>
    <NButton @click="handleClick">
      生成PDF
    </NButton>
    <NCard>
      <div ref="domRef" />
    </NCard>
  </NFlex>
</template>

<style scoped>

</style>
