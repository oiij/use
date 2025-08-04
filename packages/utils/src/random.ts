/** 随机布尔值 */
export const randomBoolean = (): boolean => Math.random() >= 0.5
/** 随机整数 */
export const randomInteger = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
/** 随机浮点数 */
export const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min
/** 随机颜色 */
export const randomColor = (): string => `#${(~~(Math.random() * (1 << 24))).toString(16)}`
/** 随机ip */
export const randomIp = (): string => Array.from({ length: 4 }).fill(0).map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0)).join('.')
/** 随机字符串 */
export const generateString = (length: number, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') => Array.from({ length }).fill('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
/** 随机符号 */
export const randomSign = (): number => (Math.random() >= 0.5 ? 1 : -1)
/** 生成范围内随机整数 */
export const randomArrayInRange = (min: number, max: number, n: number): number[] => Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)
/** 随机删除一项 */
export const removeRandomItem = <T>(arr: T[]): T => arr.splice((Math.random() * arr.length) | 0, 1) as unknown as T
/** 获取随机项 */
export const getRandomItem = <T, _>(arr: T[]): T => arr[(Math.random() * arr.length) | 0]
/** 获取对象随机属性 */
export const randomProp = (obj: object): any => Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0]
