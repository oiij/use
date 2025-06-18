import { useEventListener } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

type ImageVerifyType = 'operation' | 'character'
interface OperationConfig {
  figure?: number
  arith?: '+' | '-' | '*'
}
interface CharacterConfig {
  length?: number
}
export interface ImageVerifyOptions {
  width?: number
  height?: number
  refreshOnClick?: boolean
  type?: ImageVerifyType
  config?: OperationConfig & CharacterConfig
  disturbLine?: number
  disturbPoint?: number

}
const CHARACTER_POOL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
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
function drawLine(ctx: CanvasRenderingContext2D, width: number, height: number, length: number) {
  for (let i = 0; i < length; i += 1) {
    ctx.beginPath()
    ctx.moveTo(randomNum(0, width), randomNum(0, height))
    ctx.lineTo(randomNum(0, width), randomNum(0, height))
    ctx.strokeStyle = randomColor(180, 230)
    ctx.closePath()
    ctx.stroke()
  }
}
function drawPoint(ctx: CanvasRenderingContext2D, width: number, height: number, length: number) {
  for (let i = 0; i < length; i += 1) {
    ctx.beginPath()
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = randomColor(150, 200)
    ctx.fill()
  }
}
export function useImageVerify(options?: ImageVerifyOptions) {
  const { width = 120, height = 40, refreshOnClick = true, type = 'character', config, disturbLine = 10, disturbPoint = 40 } = options ?? {}
  const { length = 4, arith, figure = 10 } = config ?? {}
  const domRef = ref<HTMLCanvasElement>()
  const value = ref('')
  const code = ref('')
  const passed = computed(() => value.value.toUpperCase() === code.value.toUpperCase())
  function validate() {
    return new Promise((resolve, reject) => passed.value ? resolve(true) : reject(new Error('Failed to verify.')))
  }
  function reset() {
    value.value = ''
  }
  function refresh() {
    generate()
  }

  function generate() {
    const _code = _draw(type)
    code.value = _code
    return _code
  }

  function _draw(type: ImageVerifyOptions['type'] = 'character') {
    let imgCode = ''

    const ctx = domRef.value?.getContext('2d')
    if (!ctx)
      return imgCode
    ctx.fillStyle = randomColor(180, 230)
    ctx.fillRect(0, 0, width, height)

    if (type === 'character') {
      for (let i = 0; i < length; i += 1) {
        const text = CHARACTER_POOL[randomNum(0, CHARACTER_POOL.length)]
        imgCode += text

        ctx.fillStyle = randomColor(50, 160)
        ctx.font = `${randomNum((height * 2) / 4, (height * 3) / 4)}px SimHei`
        ctx.textBaseline = 'top'
        const x = i * ((width - 10) / length)
        const y = randomNum(5, height / 4)
        ctx.fillText(text, x + 5, y)
      }
    }
    if (type === 'operation') {
      let num1 = Math.floor(Math.random() * figure)
      let num2 = Math.floor(Math.random() * figure)
      let codeShow = ''
      const _arith = arith || ['+', '-', '*'][Math.floor(Math.random() * 3)]
      switch (_arith) {
        case '+':
          imgCode = (num1 + num2).toString()
          codeShow = `${num1} + ${num2} = ?`
          break
        case '-':
          if (num1 < num2) {
            const tempNum = num1
            num1 = num2
            num2 = tempNum
          }
          imgCode = (num1 - num2).toString()
          codeShow = `${num1} - ${num2} = ?`
          break

        case '*':
          imgCode = (num1 * num2).toString()
          codeShow = `${num1} × ${num2} = ?`
          break
      }
      for (let i = 0; i < codeShow.length; i += 1) {
        const text = codeShow[i]

        ctx.fillStyle = randomColor(50, 160)
        ctx.font = `${randomNum((height * 2) / 4, (height * 3) / 4)}px SimHei`
        ctx.textBaseline = 'top'
        const x = i * ((width - 10) / codeShow.length)
        const y = randomNum(5, height / 4)
        ctx.fillText(text, x + 5, y)
      }
    }
    drawLine(ctx, width, height, disturbLine)
    drawPoint(ctx, width, height, disturbPoint)
    return imgCode
  }
  useEventListener(domRef, 'click', () => {
    if (refreshOnClick) {
      generate()
    }
  })
  onMounted(() => {
    if (domRef.value) {
      domRef.value.width = width
      domRef.value.height = height
      domRef.value.style.width = `${width}px`
      domRef.value.style.height = `${height}px`
      generate()
    }
  })

  return {
    domRef,
    value,
    code,
    passed,
    validate,
    reset,
    refresh,
  }
}
export type UseImageVerifyReturns = ReturnType<typeof useImageVerify>
