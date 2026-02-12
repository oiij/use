/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 * @example
 * // 返回 1-10 之间的随机数
 * random(1, 10)
 */
export const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)

/**
 * 向数字添加序号后缀
 * @param {number} n - 要添加后缀的数字
 * @returns {string} 带有序号后缀的字符串
 * @example
 * // 返回 "1st"
 * addOrdinal(1)
 * // 返回 "2nd"
 * addOrdinal(2)
 */
export const addOrdinal = (n: number): string => `${n}${['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th'}`

/**
 * 计算多个数字的平均数
 * @param {number[]} args - 要计算的数字
 * @returns {number} 平均数
 * @example
 * // 返回 3
 * average(1, 2, 3, 4, 5)
 */
export const average = (...args: number[]): number => args.reduce((a, b) => a + b) / args.length

/**
 * 计算斐波那契数列的第 n 项
 * @param {number} n - 项数
 * @param {Record<string, number>} [memo] - 缓存对象，用于优化性能
 * @returns {number} 斐波那契数列的第 n 项
 * @example
 * // 返回 5
 * fibo(5)
 */
export const fibo = (n: number, memo: Record<string, number> = {}): number => memo[n] || (n <= 2 ? 1 : (memo[n] = fibo(n - 1, memo) + fibo(n - 2, memo)))

/**
 * 计算多个数字的余数
 * @param {number[]} args - 要计算的数字
 * @returns {number} 余数
 * @example
 * // 返回 1
 * remainder(10, 3)
 */
export const remainder = (...args: number[]): number => args.reduce((a, b) => a % b)

/**
 * 计算多个数字的除法
 * @param {number[]} args - 要计算的数字
 * @returns {number} 除法结果
 * @example
 * // 返回 2
 * division(10, 5)
 */
export const division = (...args: number[]): number => args.reduce((a, b) => a / b)

/**
 * 计算数字的阶乘
 * @param {number} n - 要计算阶乘的数字
 * @returns {number} 阶乘结果
 * @example
 * // 返回 120
 * factorial(5)
 */
export const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1))

/**
 * 计算两个数字的最大公约数
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 最大公约数
 * @example
 * // 返回 5
 * gcd(10, 15)
 */
export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/**
 * 计算集合索引模组
 * @param {number} a - 被除数
 * @param {number} b - 除数
 * @returns {number} 模组结果
 * @example
 * // 返回 1
 * mod(-1, 2)
 */
export const mod = (a: number, b: number): number => ((a % b) + b) % b

/**
 * 将数字转换为数字数组
 * @param {number} n - 要转换的数字
 * @returns {number[]} 数字数组
 * @example
 * // 返回 [1, 2, 3]
 * digitize(123)
 */
export const digitize = (n: number): number[] => [...`${n}`].map(v => Number.parseInt(v, 10))

/**
 * 将数字限制在指定范围内
 * @param {number} val - 要限制的数字
 * @param {number} [min] - 最小值
 * @param {number} [max] - 最大值
 * @returns {number} 限制在范围内的数字
 * @example
 * // 返回 5
 * clamp(10, 0, 5)
 */
export const clamp = (val: number, min = 0, max = 1): number => Math.max(min, Math.min(max, val))

/**
 * 将数字转换为等效的字母
 * @param {number} n - 要转换的数字
 * @returns {string} 等效的字母
 * @example
 * // 返回 "A"
 * toChars(0)
 * // 返回 "AB"
 * toChars(27)
 */
export const toChars = (n: number): string => `${n >= 26 ? toChars(Math.floor(n / 26) - 1) : ''}${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[n % 26]}`

/**
 * 指定位数四舍五入
 * @param {number} n - 要四舍五入的数字
 * @param {number} d - 小数位数
 * @returns {number} 四舍五入后的数字
 * @example
 * // 返回 1.23
 * round(1.234, 2)
 */
export const round = (n: number, d: number): number => Number(`${Math.round(Number(`${n}e${d}`))}e-${d}`)

/**
 * 计算多个数字的总和
 * @param {number[]} args - 要计算的数字
 * @returns {number} 总和
 * @example
 * // 返回 15
 * sum(1, 2, 3, 4, 5)
 */
export const sum = (...args: number[]): number => args.reduce((a, b) => a + b)

/**
 * 计算多个数字的乘积
 * @param {number[]} args - 要计算的数字
 * @returns {number} 乘积
 * @example
 * // 返回 120
 * mul(1, 2, 3, 4, 5)
 */
export const mul = (...args: number[]): number => args.reduce((a, b) => a * b)

/**
 * 计算多个数字的减法
 * @param {number[]} args - 要计算的数字
 * @returns {number} 减法结果
 * @example
 * // 返回 1
 * subtract(5, 2, 2)
 */
export const subtract = (...args: number[]): number => args.reduce((a, b) => a - b)

/**
 * 截断数字到指定小数位数
 * @param {number} n - 要截断的数字
 * @param {number} fixed - 小数位数
 * @returns {number} 截断后的数字
 * @example
 * // 返回 1.23
 * toFixed(1.2345, 2)
 */
export const toFixed = (n: number, fixed: number): number => ~~(10 ** fixed * n) / 10 ** fixed

/**
 * 为整数添加前导零
 * @param {number} n - 要添加前导零的数字
 * @param {number} length - 目标长度
 * @returns {string} 带前导零的字符串
 * @example
 * // 返回 "001"
 * prefixWithZeros(1, 3)
 */
export const prefixWithZeros = (n: number, length: number): string => String(n).padStart(length, '0')

/**
 * 截断小数部分，返回整数
 * @param {number} n - 要截断的数字
 * @returns {number} 截断后的整数
 * @example
 * // 返回 1
 * truncate(1.999)
 */
export const truncate = (n: number): number => ~~n

/**
 * 将数字包装在指定范围内
 * @param {number} num - 要包装的数字
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 包装后的数字
 * @example
 * // 返回 1
 * wrap(11, 1, 10)
 */
export const wrap = (num: number, min: number, max: number): number => ((((num - min) % (max - min)) + (max - min)) % (max - min)) + min

/**
 * 将十进制数字转换为二进制
 * @param {number} num - 要转换的十进制数字
 * @returns {number} 二进制数字
 * @example
 * // 返回 101
 * decToBi(5)
 */
export const decToBi = (num: number): number => (num === 0 ? 0 : (num % 2) + 10 * decToBi(~~(num / 2)))
