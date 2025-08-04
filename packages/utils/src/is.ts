import { toString } from './string'

export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = <T extends Function> (val: any): val is T => typeof val === 'function'
export const isObject = (val: any): val is object => toString(val) === '[object Object]'
export const isUndefined = (val: any): val is undefined => toString(val) === '[object Undefined]'
export const isNull = (val: any): val is null => toString(val) === '[object Null]'
export const isRegExp = (val: any): val is RegExp => toString(val) === '[object RegExp]'
export const isDate = (val: any): val is Date => toString(val) === '[object Date]'
export const isFile = (val: any): val is File => toString(val) === '[object File]'
export const isMap = (val: any): val is Map<any, any> => toString(val) === '[object Map]'
export const isSet = (val: any): val is Set<any> => toString(val) === '[object Set]'
export const isArray = (val: any): val is Array<any> => Array.isArray(val)
export const isBlob = (val: any): val is Blob => toString(val) === '[object Blob]'
export const isFormData = (val: any): val is FormData => toString(val) === '[object FormData]'
export const isURLSearchParams = (val: any): val is URLSearchParams => toString(val) === '[object URLSearchParams]'
export const isNativeError = (val: any): val is Error => toString(val) === '[object Error]'
export const isDocument = (val: any): val is Document => toString(val) === '[object Document]'
export const isWindow = (val: any): boolean => typeof window !== 'undefined' && toString(val) === '[object Window]'
// eslint-disable-next-line node/prefer-global/process
export const isNode: boolean = typeof process !== 'undefined' && process.versions != null && process.versions.node != null
export const isBrowser = typeof window === 'object'
export const isDarkMode: boolean = isBrowser ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false
/** 检查一个元素是否是另一个元素的后代 */
export const isDescendant = (child: Node, parent: Node): boolean => parent.contains(child)
/** 检测Internet Explorer浏览器 */
export const isIE = !!(document as any).documentMode
/** 检查用户是否滚动到页面底部 */
export const isAtBottom = (): boolean => document.documentElement.clientHeight + window.scrollY >= document.documentElement.scrollHeight
/** 检测macOS浏览器 */
export const isMacBrowser: boolean = /Mac|iPod|iPhone|iPad/.test(navigator.platform)

/** 对象是否相等 */
export const isEqualObject = (...objects: object[]): boolean => objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]))
/** 比较两个数组，不考虑顺序 */
export const isEqualArray = <T, _>(a: T[], b: T[]): boolean => JSON.stringify([...(new Set(a))].sort()) === JSON.stringify([...(new Set(b))].sort())
/** 是否普通对象 */
// eslint-disable-next-line no-proto, no-restricted-properties
export const isPlainObject = (v: any): boolean => !!v && typeof v === 'object' && (v.__proto__ === null || v.__proto__ === Object.prototype)
/** 检查平面数组是否有重复值 */
export const isHasDuplicateValues = <T, _>(arr: T[]): boolean => new Set(arr).size !== arr.length
/** 所有项目是否相等 */
export const isAreEqual = <T, _>(arr: T[]): boolean => new Set(arr).size === 1

/** 点是否在矩形内 */
export const isInside = (point: { x: number, y: number }, rect: { bottom: number, left: number, top: number, right: number }): boolean => point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom
/** 是否是偶数 */
export const isEven = (num: number): boolean => num % 2 === 0
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
/** 是否是数字 */
export const isNumber = (val: any): val is number => typeof val === 'number'
/** 是否是number 严格模式 */
export const isNumberStrict = (value: any): boolean => !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value)
/** 是否是16进制数 */
export const isHexadecimal = (str: string): boolean => /^[A-F0-9]+$/i.test(str)
/** 是否是mongodb id */
export const isMongoId = (str: string): boolean => str.length === 24 && /^[A-F0-9]+$/i.test(str)

/** 检查日期是否有效 */
export const isDateValid = (val: string): boolean => !Number.isNaN(new Date(val).valueOf())
/** 是否工作日 */
export const isWeekday = (date = new Date()): boolean => date.getDay() % 6 !== 0
/** 检查给定的日期是否在给定的日期范围内 */
export const isBetween = (date: Date, min: Date, max: Date): boolean => date.getTime() >= min.getTime() && date.getTime() <= max.getTime()
/** 检查给定的日期是否是今天 */
export const isToday = (date: Date): boolean => date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
/** 检查给定的日期是否是周末 */
export const isWeekend = (date = new Date()): boolean => date.getDay() % 6 === 0
/** 检查给定的日期是否是当前年份 */
export const isCurrentYear = (date: Date): boolean => date.getUTCFullYear() === new Date().getUTCFullYear()

export const isString = (val: unknown): val is string => typeof val === 'string'
/** 是否是16进制颜色 */
export const isHexColor = (color: string): boolean => /^#(?:[0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color)
/** 是否相对路径 */
export const isRelative = (path: string): boolean => !/^(?:[a-z]+:)?[\\/]/i.test(path)
/** 是否绝对网址 */
export const isAbsoluteUrl = (url: string): boolean => /^[a-z][a-z0-9+.-]*:/.test(url)
/** 字符串是否是abcba */
export const isPalindrome = (str: string): boolean => str === str.split('').reverse().join('')
/** 是否包含ASCII码 */
// eslint-disable-next-line no-control-regex
export const isAscii = (str: string): boolean => /^[\x00-\x7F]+$/.test(str)
/** 是否包含字母和数字 */
export const isAlphanumeric = (str: string): boolean => /^[0-9A-Z]+$/i.test(str)
/** 是否包含字母 */
export const isAlpha = (str: string): boolean => /^[A-Z]+$/i.test(str)
/** 是否是八进制 */
export const isOctal = (str: string): boolean => /^(?:0o)?[0-7]+$/i.test(str)
/** 实否银行识别码 */
export const isBIC = (value: string): boolean => /^[a-z]{6}[a-z0-9]{2}(?:[a-z0-9]{3})?$/i.test(value)
/** 是否为大写 */
export const isUpperCase = (str: string): boolean => str === str.toUpperCase()
/** 是否是小写 */
export const isLowerCase = (str: string): boolean => str === str.toLowerCase()
