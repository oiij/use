/**
 * 点坐标类型
 * @property {number} x - x 坐标
 * @property {number} y - y 坐标
 */
type Point = {
  x: number
  y: number
}

/**
 * 矩形坐标类型
 * @property {number} bottom - 底部坐标
 * @property {number} left - 左侧坐标
 * @property {number} top - 顶部坐标
 * @property {number} right - 右侧坐标
 */
type Rect = {
  bottom: number
  left: number
  top: number
  right: number
}

/**
 * 计算两点之间的弧度角度
 * @param {Point} p1 - 第一个点的坐标
 * @param {Point} p2 - 第二个点的坐标
 * @returns {number} 弧度角度
 * @example
 * // 返回弧度值
 * radiansAngle({ x: 0, y: 0 }, { x: 1, y: 1 })
 */
export const radiansAngle = (p1: Point, p2: Point): number => Math.atan2(p2.y - p1.y, p2.x - p1.x)

/**
 * 计算两点之间的度数角度
 * @param {Point} p1 - 第一个点的坐标
 * @param {Point} p2 - 第二个点的坐标
 * @returns {number} 度数角度
 * @example
 * // 返回度数
 * degreesAngle({ x: 0, y: 0 }, { x: 1, y: 1 })
 */
export const degreesAngle = (p1: Point, p2: Point): number => (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI

/**
 * 线性插值
 * @param {number} a - 起始值
 * @param {number} b - 结束值
 * @param {number} amount - 插值量 (0-1)
 * @returns {number} 插值结果
 * @example
 * // 返回 15
 * lerp(10, 20, 0.5)
 */
export const lerp = (a: number, b: number, amount: number): number => (1 - amount) * a + amount * b

/**
 * 计算两点之间的中点
 * @param {Point} p1 - 第一个点的坐标
 * @param {Point} p2 - 第二个点的坐标
 * @returns {number[]} 中点坐标 [x, y]
 * @example
 * // 返回 [1.5, 2.5]
 * midpoint({ x: 1, y: 2 }, { x: 2, y: 3 })
 */
export const midpoint = (p1: Point, p2: Point): number[] => [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2]

/**
 * 检查矩形是否在另一个矩形内
 * @param {Rect} a - 外部矩形
 * @param {Rect} b - 内部矩形
 * @returns {boolean} 内部矩形是否在外部矩形内
 * @example
 * // 返回 true
 * contains({ bottom: 10, left: 0, top: 0, right: 10 }, { bottom: 5, left: 1, top: 1, right: 5 })
 */
export const contains = (a: Rect, b: Rect): boolean => a.top <= b.top && a.left <= b.left && a.bottom >= b.bottom && a.right >= b.right

/**
 * 度数转弧度
 * @param {number} deg - 度数
 * @returns {number} 弧度
 * @example
 * // 返回 Math.PI / 2
 * degsToRads(90)
 */
export const degsToRads = (deg: number): number => (deg * Math.PI) / 180.0

/**
 * 将一个数字在范围内的比率归一化
 * @param {number} value - 要归一化的值
 * @param {number} min - 范围最小值
 * @param {number} max - 范围最大值
 * @returns {number} 归一化后的比率 (0-1)
 * @example
 * // 返回 0.5
 * normalizeRatio(5, 0, 10)
 */
export const normalizeRatio = (value: number, min: number, max: number): number => (value - min) / (max - min)

/**
 * 将数字四舍五入到给定值的最接近的倍数
 * @param {number} value - 要四舍五入的值
 * @param {number} nearest - 倍数
 * @returns {number} 四舍五入后的结果
 * @example
 * // 返回 10
 * roundNearest(12, 5)
 */
export const roundNearest = (value: number, nearest: number): number => Math.round(value / nearest) * nearest

/**
 * 计算两点之间的距离
 * @param {Point} p1 - 第一个点的坐标
 * @param {Point} p2 - 第二个点的坐标
 * @returns {number} 两点之间的距离
 * @example
 * // 返回 Math.sqrt(2)
 * distance({ x: 0, y: 0 }, { x: 1, y: 1 })
 */
export const distance = (p1: Point, p2: Point): number => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)

/**
 * 将弧度转换为度
 * @param {number} rad - 弧度
 * @returns {number} 度数
 * @example
 * // 返回 90
 * radsToDegs(Math.PI / 2)
 */
export const radsToDegs = (rad: number): number => (rad * 180) / Math.PI

/**
 * 掷骰子
 * @returns {number} 骰子点数 (1-6)
 * @example
 * // 返回 1-6 之间的随机数
 * throwdice()
 */
export const throwdice = (): number => ~~(Math.random() * 6) + 1

/**
 * 等待指定的毫秒数
 * @param {number} milliseconds - 等待时间（毫秒）
 * @returns {Promise<void>} 等待完成的 Promise
 * @example
 * // 等待 1000 毫秒
 * await wait(1000)
 */
export const wait = async (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds))
