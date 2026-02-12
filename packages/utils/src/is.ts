import { toString } from './string'

/**
 * 检查值是否已定义
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否已定义
 * @example
 * // 返回 true
 * isDef('hello')
 * // 返回 false
 * isDef(undefined)
 */
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'

/**
 * 检查值是否为布尔类型
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为布尔类型
 * @example
 * // 返回 true
 * isBoolean(true)
 * // 返回 false
 * isBoolean('false')
 */
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'

/**
 * 检查值是否为函数
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为函数
 * @example
 * // 返回 true
 * isFunction(() => {})
 * // 返回 false
 * isFunction('function')
 */
// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = <T extends Function> (val: any): val is T => typeof val === 'function'

/**
 * 检查值是否为普通对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为普通对象
 * @example
 * // 返回 true
 * isObject({})
 * // 返回 false
 * isObject([])
 */
export const isObject = (val: any): val is object => toString(val) === '[object Object]'

/**
 * 检查值是否为 undefined
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 undefined
 * @example
 * // 返回 true
 * isUndefined(undefined)
 * // 返回 false
 * isUndefined(null)
 */
export const isUndefined = (val: any): val is undefined => toString(val) === '[object Undefined]'

/**
 * 检查值是否为 null
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 null
 * @example
 * // 返回 true
 * isNull(null)
 * // 返回 false
 * isNull(undefined)
 */
export const isNull = (val: any): val is null => toString(val) === '[object Null]'

/**
 * 检查值是否为正则表达式
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为正则表达式
 * @example
 * // 返回 true
 * isRegExp(/test/)
 * // 返回 false
 * isRegExp('test')
 */
export const isRegExp = (val: any): val is RegExp => toString(val) === '[object RegExp]'

/**
 * 检查值是否为日期对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为日期对象
 * @example
 * // 返回 true
 * isDate(new Date())
 * // 返回 false
 * isDate('2024-01-01')
 */
export const isDate = (val: any): val is Date => toString(val) === '[object Date]'

/**
 * 检查值是否为文件对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为文件对象
 * @example
 * // 返回 true
 * isFile(new File([], 'test.txt'))
 * // 返回 false
 * isFile({ name: 'test.txt' })
 */
export const isFile = (val: any): val is File => toString(val) === '[object File]'

/**
 * 检查值是否为 Map 对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 Map 对象
 * @example
 * // 返回 true
 * isMap(new Map())
 * // 返回 false
 * isMap({})
 */
export const isMap = (val: any): val is Map<any, any> => toString(val) === '[object Map]'

/**
 * 检查值是否为 Set 对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 Set 对象
 * @example
 * // 返回 true
 * isSet(new Set())
 * // 返回 false
 * isSet([])
 */
export const isSet = (val: any): val is Set<any> => toString(val) === '[object Set]'

/**
 * 检查值是否为数组
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为数组
 * @example
 * // 返回 true
 * isArray([])
 * // 返回 false
 * isArray({})
 */
export const isArray = (val: any): val is Array<any> => Array.isArray(val)

/**
 * 检查值是否为 Blob 对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 Blob 对象
 * @example
 * // 返回 true
 * isBlob(new Blob())
 * // 返回 false
 * isBlob({ size: 0, type: '' })
 */
export const isBlob = (val: any): val is Blob => toString(val) === '[object Blob]'

/**
 * 检查值是否为 FormData 对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 FormData 对象
 * @example
 * // 返回 true
 * isFormData(new FormData())
 * // 返回 false
 * isFormData({})
 */
export const isFormData = (val: any): val is FormData => toString(val) === '[object FormData]'

/**
 * 检查值是否为 URLSearchParams 对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 URLSearchParams 对象
 * @example
 * // 返回 true
 * isURLSearchParams(new URLSearchParams())
 * // 返回 false
 * isURLSearchParams({})
 */
export const isURLSearchParams = (val: any): val is URLSearchParams => toString(val) === '[object URLSearchParams]'

/**
 * 检查值是否为原生错误对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为原生错误对象
 * @example
 * // 返回 true
 * isNativeError(new Error())
 * // 返回 false
 * isNativeError({ message: 'error' })
 */
export const isNativeError = (val: any): val is Error => toString(val) === '[object Error]'

/**
 * 检查值是否为 Document 对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 Document 对象
 * @example
 * // 返回 true
 * isDocument(document)
 * // 返回 false
 * isDocument({})
 */
export const isDocument = (val: any): val is Document => toString(val) === '[object Document]'

/**
 * 检查值是否为 Window 对象
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为 Window 对象
 * @example
 * // 返回 true
 * isWindow(window)
 * // 返回 false
 * isWindow({})
 */
export const isWindow = (val: any): boolean => typeof window !== 'undefined' && toString(val) === '[object Window]'

/**
 * 是否在 Node.js 环境中
 */
// eslint-disable-next-line node/prefer-global/process
export const isNode: boolean = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

/**
 * 是否在浏览器环境中
 */
export const isBrowser = typeof window === 'object'

/**
 * 是否为暗黑模式
 */
export const isDarkMode: boolean = isBrowser ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false

/**
 * 检查一个元素是否是另一个元素的后代
 * @param {Node} child - 子元素
 * @param {Node} parent - 父元素
 * @returns {boolean} 子元素是否是父元素的后代
 * @example
 * // 返回 true
 * isDescendant(childElement, parentElement)
 */
export const isDescendant = (child: Node, parent: Node): boolean => parent.contains(child)

/**
 * 检测Internet Explorer浏览器
 * @returns {boolean} 是否是IE浏览器
 * @example
 * // 返回 true 或 false
 * isIE()
 */
export const isIE = !!(document as any).documentMode

/**
 * 检查用户是否滚动到页面底部
 * @returns {boolean} 是否滚动到页面底部
 * @example
 * // 返回 true 或 false
 * isAtBottom()
 */
export const isAtBottom = (): boolean => document.documentElement.clientHeight + window.scrollY >= document.documentElement.scrollHeight

/**
 * 检测macOS浏览器
 */
export const isMacBrowser: boolean = /Mac|iPod|iPhone|iPad/.test(navigator.platform)

/**
 * 对象是否相等
 * @param {object[]} objects - 要比较的对象列表
 * @returns {boolean} 对象是否相等
 * @example
 * // 返回 true
 * isEqualObject({ a: 1 }, { a: 1 })
 * // 返回 false
 * isEqualObject({ a: 1 }, { b: 1 })
 */
export const isEqualObject = (...objects: object[]): boolean => objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]))

/**
 * 比较两个数组，不考虑顺序
 * @param {any[]} a - 第一个数组
 * @param {any[]} b - 第二个数组
 * @returns {boolean} 数组是否相等
 * @example
 * // 返回 true
 * isEqualArray([1, 2], [2, 1])
 * // 返回 false
 * isEqualArray([1, 2], [3, 4])
 */
export const isEqualArray = <T, _>(a: T[], b: T[]): boolean => JSON.stringify([...(new Set(a))].sort()) === JSON.stringify([...(new Set(b))].sort())

/**
 * 是否普通对象
 * @param {any} v - 要检查的值
 * @returns {boolean} 是否为普通对象
 * @example
 * // 返回 true
 * isPlainObject({})
 * // 返回 false
 * isPlainObject([])
 */
// eslint-disable-next-line no-proto, no-restricted-properties
export const isPlainObject = (v: any): boolean => !!v && typeof v === 'object' && (v.__proto__ === null || v.__proto__ === Object.prototype)

/**
 * 检查平面数组是否有重复值
 * @param {any[]} arr - 要检查的数组
 * @returns {boolean} 是否有重复值
 * @example
 * // 返回 true
 * isHasDuplicateValues([1, 2, 2])
 * // 返回 false
 * isHasDuplicateValues([1, 2, 3])
 */
export const isHasDuplicateValues = <T, _>(arr: T[]): boolean => new Set(arr).size !== arr.length

/**
 * 所有项目是否相等
 * @param {any[]} arr - 要检查的数组
 * @returns {boolean} 所有项目是否相等
 * @example
 * // 返回 true
 * isAreEqual([1, 1, 1])
 * // 返回 false
 * isAreEqual([1, 2, 3])
 */
export const isAreEqual = <T, _>(arr: T[]): boolean => new Set(arr).size === 1

/**
 * 点是否在矩形内
 * @param {object} point - 点坐标 { x, y }
 * @param {number} point.x - 点的 x 坐标
 * @param {number} point.y - 点的 y 坐标
 * @param {object} rect - 矩形坐标 { bottom, left, top, right }
 * @param {number} rect.bottom - 矩形的下边界
 * @param {number} rect.left - 矩形的左边界
 * @param {number} rect.top - 矩形的上边界
 * @param {number} rect.right - 矩形的右边界
 * @returns {boolean} 点是否在矩形内
 * @example
 * // 返回 true
 * isInside({ x: 10, y: 10 }, { bottom: 20, left: 0, top: 0, right: 20 })
 */
export const isInside = (point: { x: number, y: number }, rect: { bottom: number, left: number, top: number, right: number }): boolean => point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom

/**
 * 是否是偶数
 * @param {number} num - 要检查的数字
 * @returns {boolean} 是否是偶数
 * @example
 * // 返回 true
 * isEven(2)
 * // 返回 false
 * isEven(3)
 */
export const isEven = (num: number): boolean => num % 2 === 0

/**
 * 是否是质数
 * @param {number} n - 要检查的数字
 * @returns {boolean} 是否是质数
 * @example
 * // 返回 true
 * isPrime(5)
 * // 返回 false
 * isPrime(4)
 */
export const isPrime = (n: number): boolean => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }).fill(0).map((_, i) => i + 2).every(i => n % i !== 0)

/**
 * 是否是2的幂
 * @param {number} n - 要检查的数字
 * @returns {boolean} 是否是2的幂
 * @example
 * // 返回 true
 * isPowerOfTwo(8)
 * // 返回 false
 * isPowerOfTwo(9)
 */
export const isPowerOfTwo = (n: number): boolean => (n & (n - 1)) === 0

/**
 * 数字是否在给定范围内
 * @param {number} num - 要检查的数字
 * @param {number} a - 范围的第一个值
 * @param {number} b - 范围的第二个值
 * @param {number} [threshold] - 阈值
 * @returns {boolean} 数字是否在范围内
 * @example
 * // 返回 true
 * inRange(5, 1, 10)
 * // 返回 false
 * inRange(15, 1, 10)
 */
export const inRange = (num: number, a: number, b: number, threshold = 0): boolean => Math.min(a, b) - threshold <= num && num <= Math.max(a, b) + threshold

/**
 * 是否是负数
 * @param {number} n - 要检查的数字
 * @returns {boolean} 是否是负数
 * @example
 * // 返回 true
 * isNegative(-1)
 * // 返回 false
 * isNegative(1)
 */
export const isNegative = (n: number): boolean => Math.sign(n) === -1

/**
 * 是否是奇数
 * @param {number} n - 要检查的数字
 * @returns {boolean} 是否是奇数
 * @example
 * // 返回 true
 * isOdd(3)
 * // 返回 false
 * isOdd(2)
 */
export const isOdd = (n: number): boolean => n % 2 !== 0

/**
 * 是否是正数
 * @param {number} n - 要检查的数字
 * @returns {boolean} 是否是正数
 * @example
 * // 返回 true
 * isPositive(1)
 * // 返回 false
 * isPositive(-1)
 */
export const isPositive = (n: number): boolean => Math.sign(n) === 1

/**
 * 是否包含数字
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否包含数字
 * @example
 * // 返回 true
 * isNumeric('123')
 * // 返回 false
 * isNumeric('abc')
 */
export const isNumeric = (str: string): boolean => !/\D/.test(str)

/**
 * 是否是数字
 * @param {any} val - 要检查的值
 * @returns {boolean} 是否是数字
 * @example
 * // 返回 true
 * isNumber(123)
 * // 返回 false
 * isNumber('123')
 */
export const isNumber = (val: any): val is number => typeof val === 'number'

/**
 * 是否是number 严格模式
 * @param {any} value - 要检查的值
 * @returns {boolean} 是否是有效的数字
 * @example
 * // 返回 true
 * isNumberStrict('123')
 * // 返回 false
 * isNumberStrict('abc')
 */
export const isNumberStrict = (value: any): boolean => !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value)

/**
 * 是否是16进制数
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否是16进制数
 * @example
 * // 返回 true
 * isHexadecimal('A1B2C3')
 * // 返回 false
 * isHexadecimal('GHIJKL')
 */
export const isHexadecimal = (str: string): boolean => /^[A-F0-9]+$/i.test(str)

/**
 * 是否是mongodb id
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否是mongodb id
 * @example
 * // 返回 true
 * isMongoId('507f191e810c19729de860ea')
 * // 返回 false
 * isMongoId('12345')
 */
export const isMongoId = (str: string): boolean => str.length === 24 && /^[A-F0-9]+$/i.test(str)

/**
 * 检查日期是否有效
 * @param {string} val - 要检查的日期字符串
 * @returns {boolean} 日期是否有效
 * @example
 * // 返回 true
 * isDateValid('2024-01-01')
 * // 返回 false
 * isDateValid('invalid-date')
 */
export const isDateValid = (val: string): boolean => !Number.isNaN(new Date(val).valueOf())

/**
 * 是否工作日
 * @param {Date} [date] - 要检查的日期
 * @returns {boolean} 是否是工作日
 * @example
 * // 返回 true
 * isWeekday(new Date('2024-01-01')) // 周一
 * // 返回 false
 * isWeekday(new Date('2024-01-06')) // 周六
 */
export const isWeekday = (date = new Date()): boolean => date.getDay() % 6 !== 0

/**
 * 检查给定的日期是否在给定的日期范围内
 * @param {Date} date - 要检查的日期
 * @param {Date} min - 最小日期
 * @param {Date} max - 最大日期
 * @returns {boolean} 日期是否在范围内
 * @example
 * // 返回 true
 * isBetween(new Date('2024-01-02'), new Date('2024-01-01'), new Date('2024-01-03'))
 * // 返回 false
 * isBetween(new Date('2024-01-04'), new Date('2024-01-01'), new Date('2024-01-03'))
 */
export const isBetween = (date: Date, min: Date, max: Date): boolean => date.getTime() >= min.getTime() && date.getTime() <= max.getTime()

/**
 * 检查给定的日期是否是今天
 * @param {Date} date - 要检查的日期
 * @returns {boolean} 日期是否是今天
 * @example
 * // 返回 true
 * isToday(new Date())
 * // 返回 false
 * isToday(new Date('2023-01-01'))
 */
export const isToday = (date: Date): boolean => date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)

/**
 * 检查给定的日期是否是周末
 * @param {Date} [date] - 要检查的日期
 * @returns {boolean} 日期是否是周末
 * @example
 * // 返回 true
 * isWeekend(new Date('2024-01-06')) // 周六
 * // 返回 false
 * isWeekend(new Date('2024-01-01')) // 周一
 */
export const isWeekend = (date = new Date()): boolean => date.getDay() % 6 === 0

/**
 * 检查给定的日期是否是当前年份
 * @param {Date} date - 要检查的日期
 * @returns {boolean} 日期是否是当前年份
 * @example
 * // 返回 true
 * isCurrentYear(new Date('2024-01-01'))
 * // 返回 false
 * isCurrentYear(new Date('2023-01-01'))
 */
export const isCurrentYear = (date: Date): boolean => date.getUTCFullYear() === new Date().getUTCFullYear()

/**
 * 检查值是否为字符串
 * @param {any} val - 要检查的值
 * @returns {boolean} 值是否为字符串
 * @example
 * // 返回 true
 * isString('hello')
 * // 返回 false
 * isString(123)
 */
export const isString = (val: unknown): val is string => typeof val === 'string'

/**
 * 是否是16进制颜色
 * @param {string} color - 要检查的颜色字符串
 * @returns {boolean} 是否是16进制颜色
 * @example
 * // 返回 true
 * isHexColor('#FF5733')
 * // 返回 false
 * isHexColor('red')
 */
export const isHexColor = (color: string): boolean => /^#(?:[0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color)

/**
 * 是否相对路径
 * @param {string} path - 要检查的路径
 * @returns {boolean} 是否是相对路径
 * @example
 * // 返回 true
 * isRelative('./path')
 * // 返回 false
 * isRelative('/absolute/path')
 */
export const isRelative = (path: string): boolean => !/^(?:[a-z]+:)?[\\/]/i.test(path)

/**
 * 是否绝对网址
 * @param {string} url - 要检查的URL
 * @returns {boolean} 是否是绝对网址
 * @example
 * // 返回 true
 * isAbsoluteUrl('https://example.com')
 * // 返回 false
 * isAbsoluteUrl('./path')
 */
export const isAbsoluteUrl = (url: string): boolean => /^[a-z][a-z0-9+.-]*:/.test(url)

/**
 * 字符串是否是回文
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否是回文
 * @example
 * // 返回 true
 * isPalindrome('abcba')
 * // 返回 false
 * isPalindrome('hello')
 */
export const isPalindrome = (str: string): boolean => str === str.split('').reverse().join('')

/**
 * 是否包含ASCII码
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否只包含ASCII字符
 * @example
 * // 返回 true
 * isAscii('Hello')
 * // 返回 false
 * isAscii('你好')
 */
// eslint-disable-next-line no-control-regex
export const isAscii = (str: string): boolean => /^[\x00-\x7F]+$/.test(str)

/**
 * 是否包含字母和数字
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否只包含字母和数字
 * @example
 * // 返回 true
 * isAlphanumeric('Hello123')
 * // 返回 false
 * isAlphanumeric('Hello!')
 */
export const isAlphanumeric = (str: string): boolean => /^[0-9A-Z]+$/i.test(str)

/**
 * 是否包含字母
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否只包含字母
 * @example
 * // 返回 true
 * isAlpha('Hello')
 * // 返回 false
 * isAlpha('Hello123')
 */
export const isAlpha = (str: string): boolean => /^[A-Z]+$/i.test(str)

/**
 * 是否是八进制
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否是八进制
 * @example
 * // 返回 true
 * isOctal('0o123')
 * // 返回 false
 * isOctal('890')
 */
export const isOctal = (str: string): boolean => /^(?:0o)?[0-7]+$/i.test(str)

/**
 * 是否是银行识别码
 * @param {string} value - 要检查的字符串
 * @returns {boolean} 是否是银行识别码
 * @example
 * // 返回 true
 * isBIC('DEUTDEFF')
 * // 返回 false
 * isBIC('INVALID')
 */
export const isBIC = (value: string): boolean => /^[a-z]{6}[a-z0-9]{2}(?:[a-z0-9]{3})?$/i.test(value)

/**
 * 是否为大写
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否全为大写
 * @example
 * // 返回 true
 * isUpperCase('HELLO')
 * // 返回 false
 * isUpperCase('Hello')
 */
export const isUpperCase = (str: string): boolean => str === str.toUpperCase()

/**
 * 是否是小写
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否全为小写
 * @example
 * // 返回 true
 * isLowerCase('hello')
 * // 返回 false
 * isLowerCase('Hello')
 */
export const isLowerCase = (str: string): boolean => str === str.toLowerCase()
