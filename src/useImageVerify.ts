import { add, multiply, random, subtract } from 'lodash-es'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export interface ImageVerifyOptions {
  width?: number
  height?: number
  length?: number
  refreshOnClick?: boolean
  minFontSize?: number
  maxFontSize?: number
  type?: 'operation' | 'character'
  disturbLine?: number
  disturbPoint?: number
  figure?: number
  arith?: 0 | 1 | 2 | 3
}

function randomNum(min: number, max: number) {
  const num = Math.floor(Math.random() * (max - min) + min)
  return num
}

function randomColor(min: number, max: number) {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

export function useImageVerify(options?: ImageVerifyOptions) {
  const { width = 120, height = 40, length = 4, refreshOnClick = true, minFontSize = 20, maxFontSize = 50, type = 'character', disturbLine = 10, disturbPoint = 40, figure = 100, arith = 0 } = options ?? {}
  const domRef = ref<HTMLCanvasElement>()
  const code = ref('')
  const imgCode = ref('')
  const passed = computed(() => code.value.toUpperCase() === imgCode.value.toUpperCase())
  function validate() {
    const _passed = code.value.toUpperCase() === imgCode.value.toUpperCase()
    return _passed
  }
  function reset() {
    code.value = ''
  }
  function refresh() {
    drawImgCode()
  }

  function drawImgCode() {
    const _code = draw(type)
    imgCode.value = _code
    return _code
  }

  function onClick() {
    if (refreshOnClick)
      drawImgCode()
  }
  function draw(type: ImageVerifyOptions['type'] = 'character') {
    let imgCode = ''

    const ctx = domRef.value?.getContext('2d')
    if (!ctx)
      return imgCode
    ctx.fillStyle = randomColor(180, 230)
    ctx.fillRect(0, 0, width, height)
    if (type === 'character') {
      const NUMBER_STRING = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let i = 0; i < length; i += 1) {
        const text = NUMBER_STRING[randomNum(0, NUMBER_STRING.length)]
        imgCode += text
        const fontSize = randomNum(minFontSize, maxFontSize)
        const deg = randomNum(-45, 45)
        ctx.font = `${fontSize}px SimHei`
        ctx.textBaseline = 'top'
        ctx.fillStyle = randomColor(80, 150)
        ctx.save()
        ctx.translate(25 * i + 25, 15)
        ctx.rotate((deg * Math.PI) / 180)
        ctx.fillText(text, -15 + 5, -15)
        ctx.restore()
      }
    }
    if (type === 'operation') {
      let num1 = Math.floor(Math.random() * figure)
      let num2 = Math.floor(Math.random() * figure)
      let codeShow = ''
      const tempArith = arith === 0 ? Math.floor(Math.random() * 3) : arith
      switch (tempArith) {
        case 1:
          imgCode = add(num1, num2).toString()
          codeShow = `${num1} + ${num2} = ?`
          break
        case 2:
          if (num1 < num2) {
            const tempNum = num1
            num1 = num2
            num2 = tempNum
          }
          imgCode = subtract(num1, num2).toString()
          codeShow = `${num1} - ${num2} = ?`
          break
        default:
          imgCode = multiply(num1, num2).toString()
          codeShow = `${num1} × ${num2} = ?`
          break
      }
      for (let i = 0; i < codeShow.length; i += 1) {
        // 随机生成字体颜色
        ctx.fillStyle = randomColor(50, 160)
        // 随机生成字体大小(0.5 - 0.75)高的范围
        ctx.font = `${random((height * 2) / 4, (height * 3) / 4)}px SimHei`
        // 字体对齐位置
        ctx.textBaseline = 'top'
        const x = i * ((width - 10) / codeShow.length)
        const y = random(5, height / 4)
        ctx.fillText(codeShow[i], x + 5, y)
      }
    }
    drawLine(ctx)
    drawPoint(ctx)
    return imgCode
  }
  function drawLine(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < disturbLine; i += 1) {
      ctx.beginPath()
      ctx.moveTo(randomNum(0, width), randomNum(0, height))
      ctx.lineTo(randomNum(0, width), randomNum(0, height))
      ctx.strokeStyle = randomColor(180, 230)
      ctx.closePath()
      ctx.stroke()
    }
  }
  function drawPoint(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < disturbPoint; i += 1) {
      ctx.beginPath()
      ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fillStyle = randomColor(150, 200)
      ctx.fill()
    }
  }
  onMounted(() => {
    if (domRef.value) {
      domRef.value.width = width
      domRef.value.height = height
      domRef.value.style.width = `${width}px`
      domRef.value.style.height = `${height}px`
    }
    drawImgCode()
    domRef.value?.addEventListener('click', onClick)
  })

  onUnmounted(() => {
    domRef.value?.removeEventListener('click', onClick)
  })
  return {
    domRef,
    code,
    imgCode,
    passed,
    validate,
    reset,
    refresh,
    drawImgCode,
    draw,
  }
}
