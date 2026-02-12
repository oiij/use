/**
 * 随机布尔值
 * @returns {boolean} 随机生成的布尔值
 * @example
 * // 示例：生成随机布尔值
 * randomBoolean(); // => true 或 false
 */
export const randomBoolean = (): boolean => Math.random() >= 0.5
/**
 * 随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机生成的整数
 * @example
 * // 示例：生成随机整数
 * randomInteger(1, 10); // => 5（结果随机）
 */
export const randomInteger = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
/**
 * 随机浮点数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（不包含）
 * @returns {number} 随机生成的浮点数
 * @example
 * // 示例：生成随机浮点数
 * randomFloat(1, 10); // => 5.123（结果随机）
 */
export const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min
/**
 * 随机颜色
 * @returns {string} 随机生成的十六进制颜色
 * @example
 * // 示例：生成随机颜色
 * randomColor(); // => '#a3f2c1'（结果随机）
 */
export const randomColor = (): string => `#${(~~(Math.random() * (1 << 24))).toString(16)}`
/**
 * 随机IP地址
 * @returns {string} 随机生成的IP地址
 * @example
 * // 示例：生成随机IP地址
 * randomIp(); // => '192.168.1.1'（结果随机）
 */
export const randomIp = (): string => Array.from({ length: 4 }).fill(0).map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0)).join('.')
/**
 * 随机字符串
 * @param {number} length - 字符串长度
 * @param {string} [chars] - 可选字符集
 * @returns {string} 随机生成的字符串
 * @example
 * // 示例：生成随机字符串
 * generateString(8); // => 'aB3x9kLm'（结果随机）
 */
export const generateString = (length: number, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') => Array.from({ length }).fill('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
/**
 * 随机符号
 * @returns {number} 随机生成的符号（1 或 -1）
 * @example
 * // 示例：生成随机符号
 * randomSign(); // => 1 或 -1
 */
export const randomSign = (): number => (Math.random() >= 0.5 ? 1 : -1)
/**
 * 生成范围内随机整数数组
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @param {number} n - 数组长度
 * @returns {number[]} 随机生成的整数数组
 * @example
 * // 示例：生成范围内随机整数数组
 * randomArrayInRange(1, 10, 3); // => [5, 8, 2]（结果随机）
 */
export const randomArrayInRange = (min: number, max: number, n: number): number[] => Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)
/**
 * 随机删除一项
 * @param {T[]} arr - 原始数组
 * @returns {T} 被删除的随机项
 * @example
 * // 示例：随机删除数组中的一项
 * const arr = [1, 2, 3, 4, 5];
 * removeRandomItem(arr); // => 3（结果随机），arr 变为 [1, 2, 4, 5]
 */
export const removeRandomItem = <T>(arr: T[]): T => arr.splice((Math.random() * arr.length) | 0, 1) as unknown as T
/**
 * 获取随机项
 * @param {T[]} arr - 原始数组
 * @returns {T} 随机获取的一项
 * @example
 * // 示例：获取数组中的随机项
 * getRandomItem([1, 2, 3, 4, 5]); // => 3（结果随机）
 */
export const getRandomItem = <T, _>(arr: T[]): T => arr[(Math.random() * arr.length) | 0]
/**
 * 获取对象随机属性
 * @param {object} obj - 原始对象
 * @returns {any} 随机获取的属性名
 * @example
 * // 示例：获取对象的随机属性
 * randomProp({ a: 1, b: 2, c: 3 }); // => 'b'（结果随机）
 */
export const randomProp = (obj: object): any => Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0]
