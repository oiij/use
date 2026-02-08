import type { TemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import { computed, onMounted, readonly, ref, shallowRef } from 'vue'

/**
 * 算术运算验证码配置
 */
type OperationConfig = {
  /** 运算数字范围（0到figure-1） */
  figure?: number
  /** 运算符类型，不指定则随机选择 */
  arith?: '+' | '-' | '*'
}

/**
 * 字符验证码配置
 */
type CharacterConfig = {
  /** 验证码长度 */
  length?: number
  /** 字符池，从中随机选择字符 */
  characterPool?: string
}

/**
 * 图片验证码基础配置选项
 */
type ImageVerifyOptionsBase = {
  /** 画布宽度（像素） */
  width?: number
  /** 画布高度（像素） */
  height?: number
  /** 点击画布时是否刷新验证码 */
  refreshOnClick?: boolean
  /** 干扰线数量 */
  disturbLine?: number
  /** 干扰点数量 */
  disturbPoint?: number
}

/**
 * 图片验证码配置选项
 */
export type ImageVerifyOptions = (ImageVerifyOptionsBase & {
  type: 'operation'
  config?: OperationConfig
}) | (ImageVerifyOptionsBase & {
  type: 'character'
  config?: CharacterConfig
})

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（不包含）
 * @returns 随机整数
 *
 * @example
 * ```ts
 * randomNum(0, 10) // 返回 0-9 之间的随机整数
 * randomNum(5, 15) // 返回 5-14 之间的随机整数
 * ```
 */
function randomNum(min: number, max: number) {
  const num = Math.floor(Math.random() * (max - min) + min)
  return num
}

/**
 * 生成指定范围内的随机RGB颜色
 * @param min 最小值（包含）
 * @param max 最大值（不包含）
 * @returns RGB颜色字符串，格式为 "rgb(r,g,b)"
 *
 * @example
 * ```ts
 * randomColor(180, 230) // 返回如 "rgb(200,210,190)" 的浅色
 * randomColor(50, 160)  // 返回如 "rgb(80,120,100)" 的深色
 * ```
 */
function randomColor(min: number, max: number) {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

/**
 * 在画布上绘制干扰线
 * @param ctx Canvas 2D 渲染上下文
 * @param width 画布宽度
 * @param height 画布高度
 * @param length 干扰线数量
 */
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

/**
 * 在画布上绘制干扰点
 * @param ctx Canvas 2D 渲染上下文
 * @param width 画布宽度
 * @param height 画布高度
 * @param length 干扰点数量
 */
function drawPoint(ctx: CanvasRenderingContext2D, width: number, height: number, length: number) {
  for (let i = 0; i < length; i += 1) {
    ctx.beginPath()
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = randomColor(150, 200)
    ctx.fill()
  }
}

/**
 * 绘制单个字符到画布
 * @param ctx Canvas 2D 渲染上下文
 * @param text 要绘制的字符
 * @param index 字符索引，用于计算位置
 * @param total 总字符数，用于计算位置
 * @param width 画布宽度
 * @param height 画布高度
 */
function drawCharacter(ctx: CanvasRenderingContext2D, text: string, index: number, total: number, width: number, height: number) {
  ctx.fillStyle = randomColor(50, 160)
  ctx.font = `${randomNum((height * 2) / 4, (height * 3) / 4)}px SimHei`
  ctx.textBaseline = 'top'
  const x = index * ((width - 10) / total)
  const y = randomNum(5, height / 4)
  ctx.fillText(text, x + 5, y)
}

/**
 * 生成算术运算验证码
 * @param config 运算配置
 * @returns 包含验证码答案和显示文本的对象
 */
function generateOperationCode(config: OperationConfig) {
  const { figure = 10, arith } = config
  let num1 = Math.floor(Math.random() * figure)
  let num2 = Math.floor(Math.random() * figure)
  let answer = ''
  let display = ''

  const _arith = arith ?? ['+', '-', '*'][Math.floor(Math.random() * 3)]

  switch (_arith) {
    case '+':
      answer = (num1 + num2).toString()
      display = `${num1} + ${num2} = ?`
      break
    case '-':
      if (num1 < num2) {
        const tempNum = num1
        num1 = num2
        num2 = tempNum
      }
      answer = (num1 - num2).toString()
      display = `${num1} - ${num2} = ?`
      break
    case '*':
      answer = (num1 * num2).toString()
      display = `${num1} × ${num2} = ?`
      break
  }

  return { answer, display }
}

/**
 * 生成字符验证码
 * @param config 字符配置
 * @returns 包含验证码答案和显示文本的对象
 */
function generateCharacterCode(config: CharacterConfig) {
  const { length = 4, characterPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' } = config
  let answer = ''
  const display: string[] = []

  for (let i = 0; i < length; i += 1) {
    const char = characterPool[randomNum(0, characterPool.length)]
    answer += char
    display.push(char)
  }

  return { answer, display: display.join('') }
}

/**
 * 图片验证码 Composable
 *
 * 用于创建和管理图片验证码，支持字符验证码和算术运算验证码两种类型。
 *
 * @param templateRef Canvas 元素的模板引用
 * @param options 验证码配置选项
 * @returns 验证码相关的响应式数据和方法
 *
 * @example
 * ```ts
 * // 字符验证码
 * const canvasRef = ref<HTMLCanvasElement>()
 * const { value, code, passed, validate, reset, refresh } = useImageVerify(canvasRef, {
 *   type: 'character',
 *   width: 120,
 *   height: 40,
 *   config: {
 *     length: 4,
 *     characterPool: '0123456789'
 *   }
 * })
 *
 * // 算术运算验证码
 * const { value, code, passed, validate } = useImageVerify(canvasRef, {
 *   type: 'operation',
 *   config: {
 *     figure: 10,
 *     arith: '+'
 *   }
 * })
 *
 * // 验证
 * value.value = '1234'
 * await validate() // 验证通过
 *
 * // 重置
 * reset()
 *
 * // 刷新
 * refresh()
 * ```
 */
export function useImageVerify(templateRef: TemplateRef<HTMLCanvasElement>, options: ImageVerifyOptions = { type: 'character' }) {
  const { width = 120, height = 40, refreshOnClick = true, disturbLine = 10, disturbPoint = 40 } = options ?? {}

  const valueRef = ref('')
  const codeRef = shallowRef('')

  const passed = computed(() => valueRef.value.toUpperCase() === codeRef.value.toUpperCase())

  /**
   * 验证用户输入
   * @returns Promise，验证通过 resolve true，失败 reject 错误
   *
   * @example
   * ```ts
   * try {
   *   await validate()
   *   console.log('验证通过')
   * } catch (error) {
   *   console.log('验证失败')
   * }
   * ```
   */
  function validate() {
    return new Promise((resolve, reject) => passed.value ? resolve(true) : reject(new Error('Failed to verify.')))
  }

  /**
   * 重置用户输入
   *
   * @example
   * ```ts
   * reset()
   * ```
   */
  function reset() {
    valueRef.value = ''
  }

  /**
   * 刷新验证码
   *
   * @example
   * ```ts
   * refresh()
   * ```
   */
  function refresh() {
    generate()
  }

  /**
   * 生成新的验证码
   * @returns 验证码答案
   */
  function generate() {
    const _code = _draw()
    codeRef.value = _code
    return _code
  }

  /**
   * 在画布上绘制验证码
   * @returns 验证码答案
   */
  function _draw() {
    let answer = ''

    const ctx = templateRef.value?.getContext('2d')
    if (!ctx)
      return answer

    ctx.fillStyle = randomColor(180, 230)
    ctx.fillRect(0, 0, width, height)

    if (options?.type === 'character') {
      const { answer: charAnswer, display } = generateCharacterCode(options?.config ?? {})
      answer = charAnswer

      for (let i = 0; i < display.length; i += 1) {
        drawCharacter(ctx, display[i], i, display.length, width, height)
      }
    }

    if (options?.type === 'operation') {
      const { answer: opAnswer, display } = generateOperationCode(options?.config ?? {})
      answer = opAnswer

      for (let i = 0; i < display.length; i += 1) {
        drawCharacter(ctx, display[i], i, display.length, width, height)
      }
    }

    drawLine(ctx, width, height, disturbLine)
    drawPoint(ctx, width, height, disturbPoint)

    return answer
  }

  useEventListener(templateRef, 'click', () => {
    if (refreshOnClick) {
      generate()
    }
  })

  onMounted(() => {
    if (templateRef.value) {
      templateRef.value.width = width
      templateRef.value.height = height
      templateRef.value.style.width = `${width}px`
      templateRef.value.style.height = `${height}px`
      generate()
    }
  })

  return {
    templateRef,
    value: valueRef,
    code: readonly(codeRef),
    passed,
    validate,
    reset,
    refresh,
  }
}

/**
 * useImageVerify 返回类型
 */
export type UseImageVerifyReturns = ReturnType<typeof useImageVerify>
