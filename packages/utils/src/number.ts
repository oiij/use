/** 是否是偶数 */
export const isEven = (num: number): boolean => num % 2 === 0
/** 随机数 */
export const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)
/** 向数字添加序号后缀 */
export const addOrdinal = (n: number): string => `${n}${['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th'}`
/** 平均数 */
export const average = (...args: number[]): number => args.reduce((a, b) => a + b) / args.length
/** 斐波那契数列 */
export const fibo = (n: number, memo: Record<string, number> = {}): number => memo[n] || (n <= 2 ? 1 : (memo[n] = fibo(n - 1, memo) + fibo(n - 2, memo)))
/** 余数 */
export const remainder = (...args: number[]): number => args.reduce((a, b) => a % b)
/** 相除 */
export const division = (...args: number[]): number => args.reduce((a, b) => a / b)
/** 阶乘 */
export const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1))
/** 公约数 */
export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
/** 集合索引模组 */
export const mod = (a: number, b: number): number => ((a % b) + b) % b
/** 数字组 */
export const digitize = (n: number): number[] => [...`${n}`].map(v => Number.parseInt(v, 10))
/** 两个值之间夹住一个数字 */
export const clamp = (val: number, min = 0, max = 1): number => Math.max(min, Math.min(max, val))
/** 数字转为等效字符 */
export const toChars = (n: number): string => `${n >= 26 ? toChars(Math.floor(n / 26) - 1) : ''}${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[n % 26]}`
/** 指定位数四舍五入 */
export const round = (n: number, d: number): number => Number(`${Math.round(Number(`${n}e${d}`))}e-${d}`)
/** 计算参数总和 */
export const sum = (...args: number[]): number => args.reduce((a, b) => a + b)
/** 参数相乘 */
export const mul = (...args: number[]): number => args.reduce((a, b) => a * b)
/** 参数相减 */
export const subtract = (...args: number[]): number => args.reduce((a, b) => a - b)
/** 截断 */
export const toFixed = (n: number, fixed: number): number => ~~(10 ** fixed * n) / 10 ** fixed
/** 整数前面加零 */
export const prefixWithZeros = (n: number, length: number): string => String(n).padStart(length, '0')
/** 截断小数 */
export const truncate = (n: number): number => ~~n
/** */
export const wrap = (num: number, min: number, max: number): number => ((((num - min) % (max - min)) + (max - min)) % (max - min)) + min
/** 十进制转二进制 */
export const decToBi = (num: number): number => (num === 0 ? 0 : (num % 2) + 10 * decToBi(~~(num / 2)))
/** 是否是质数 */
export const isPrime = (n: number): boolean => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }).fill(0).map((_, i) => i + 2).every(i => n % i !== 0)
/** 是否是2的幂 */
export const isPowerOfTwo = (n: number): boolean => (n & (n - 1)) === 0
/** 数字是否在给定范围内 */
export const inRange = (num: number, a: number, b: number, threshold = 0): boolean => Math.min(a, b) - threshold <= num && num <= Math.max(a, b) + threshold
/** 是否是负数 */
export const isNegative = (n: number): boolean => Math.sign(n) === -1
/** 是否是奇数 */
export const isOdd = (n: number): boolean => n % 2 !== 0
/** 是否是正数 */
export const isPositive = (n: number): boolean => Math.sign(n) === 1
/** 是否包含数字 */
export const isNumeric = (str: string): boolean => !/\D/.test(str)
/** 是否是number */
export const isNumber = (value: any): boolean => !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value)
export default {
  addOrdinal,
  average,
  clamp,
  decToBi,
  digitize,
  division,
  factorial,
  fibo,
  gcd,
  inRange,
  isEven,
  isNegative,
  isNumber,
  isNumeric,
  isOdd,
  isPositive,
  isPowerOfTwo,
  isPrime,
  mod,
  mul,
  prefixWithZeros,
  random,
  remainder,
  round,
  subtract,
  sum,
  toChars,
  toFixed,
  truncate,
  wrap,
}
