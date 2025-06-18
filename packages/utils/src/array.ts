/** 将对象数组转换为单个对象 */
export const toObject = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): Record<string, T> => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {})
/** 比较两个数组，不考虑顺序 */
export const isEqual = <T, _>(a: T[], b: T[]): boolean => JSON.stringify([...(new Set(a))].sort()) === JSON.stringify([...(new Set(b))].sort())
/** 计算数组中值的出现次数 */
export const countOccurrences = <T, _>(arr: T[], val: T): number => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
/** 在给定范围内创建数字数组 */
export const range = (min: number, max: number): number[] => [...Array.from({ length: max - min + 1 }).keys()].map(i => i + min)
/** 清空数组 */
export const empty = <T, _>(arr: T[]) => (arr.length = 0)
/** 创建累积总和数组 */
export const accumulate = (arr: number[]): number[] => arr.reduce((a, b, i) => (i === 0 ? [b] : [...a, b + a[i - 1]]), [0])
/** 将字符串数组转换为数字 */
export const toNumbers = (arr: string[]): number[] => arr.map(Number)
/** 创建笛卡尔乘积 */
export const cartesian = (...sets: number[][]) => sets.reduce((acc, set) => acc.flatMap(x => set.map(y => [...x, y])), [[]] as number[][])
/** 按对象数组的属性计数 */
// eslint-disable-next-line no-sequences
export const countBy = <T extends Record<string, string>, K extends keyof T>(arr: T[], prop: K): Record<string, number> => arr.reduce((prev, curr) => ((prev[curr[prop]] = ++prev[curr[prop]] || 1), prev), {} as Record<string, number>)
/** 查找数组中最后一个匹配项的索引 */
export const lastIndex = <T, _>(arr: T[], predicate: (a: T) => boolean): number => arr.reduce((prev, curr, index) => (predicate(curr) ? index : prev), -1)
/** 查找数组最小项的索引 */
export const indexOfMin = (arr: number[]): number => arr.reduce((prev, curr, i, a) => (curr < a[prev] ? i : prev), 0)
/** 查找数组中最长字符串的长度 */
export const findLongest = (words: string[]): number => Math.max(...words.map(el => el.length))
/** 通过给定键查找数组的最小项 */
export const minBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): T => arr.reduce((a, b) => (a[key] < b[key] ? a : b), {} as T)
/** 查找数组中最大项的索引 */
export const indexOfMax = (arr: number[]): number => arr.reduce((prev, curr, i, a) => (curr > a[prev] ? i : prev), 0)
/** 通过给定键查找数组的最大项 */
export const maxBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): T => arr.reduce((a, b) => (a[key] >= b[key] ? a : b), {} as T)
/** 查找数组的最小项 */
export const min = (arr: number[]): number => Math.min(...arr)
/** 平展数组 */
export const flat = <T = string | string[]>(arr: T[]): T[] => arr.reduce((a, b) => (Array.isArray(b) ? [...a, ...flat(b)] : [...a, b]), [] as T[])
/** 获取连续元素的所有数组 */
export const getConsecutiveArrays = <T, _>(arr: T[], size: number): T[][] => (size > arr.length ? [] : arr.slice(size - 1).map((_, i) => arr.slice(i, size + i)))
/** 从数组中查找最接近的数字 */
export const closest = (arr: number[], n: number): number => arr.reduce((prev, curr) => (Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev))
/** 获取数组中值的索引 */
export const indices = <T>(arr: T[], value: T): number[] => arr.reduce((acc, v, i) => (v === value ? [...acc, i] : acc), [] as number[])
/** 查找数组的最大项数 */
export const max = (arr: number[]): number => Math.max(...arr)
/** 获取数组的所有第 n 项 */
export const getNthItems = <T, _>(arr: T[], nth: number): T[] => arr.filter((_, i) => i % nth === nth - 1)
/** 生成字母字符数组 */
export const alphabet = (): string[] => Array.from({ length: 26 }).fill(0).map((_, i) => String.fromCharCode(i + 97))
/** 获取数组的平均值 */
export const average = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length
/** 获取数组的交集 */
export const getIntersection = <T, _>(a: T[], ...arr: T[][]): T[] => [...new Set(a)].filter(v => arr.every(b => b.includes(v)))
/** 获取数组的所有子集 */
export const getSubsets = <T>(arr: T[]): T[][] => arr.reduce((prev, curr) => prev.concat(prev.map(k => k.concat(curr))), [[]] as T[][])
/** 获取数字数组的排名 */
export const ranking = (arr: number[]): number[] => arr.map((x, y, z) => z.filter(w => w > x).length + 1)
/** 获取数组的唯一值 */
export const unique = <T>(arr: T[]): T[] => arr.reduce((acc, el) => (acc.includes(el) ? acc : [...acc, el]), [] as T[])
/** 获取数字数组的总和 */
export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)
/** 获取数组的联合 */
export const union = <T, _>(...arr: T[][]): T[] => [...new Set(arr.flat())]
/** 按键对对象数组进行分组 */
// eslint-disable-next-line no-sequences
export const groupBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {} as Record<string, T[]>)
/** 元素之间穿插元素 */
export const intersperse = <T>(a: T[], s: T): T[] => [...Array.from({ length: 2 * a.length - 1 })].map((_, i) => (i % 2 ? s : a[i / 2]))
/** 根据条件对阵列进行分区 */
// eslint-disable-next-line no-sequences
export const partition = <T, _>(arr: T[], criteria: (a: T) => boolean): T[][] => arr.reduce((acc, i) => (acc[criteria(i) ? 0 : 1].push(i), acc), [[], []] as T[][])
/** 合并两个数组 */
export const merge = <T, _>(a: T[], b: T[], d?: boolean): T[] => d ? [...new Set(a.concat(b))] : a.concat(b)
/** 删除数组中的重复值 */
export const removeDuplicate = <T, _>(arr: T[]): T[] => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i))
/** 重复一个数组 */
export const repeat = <T, _>(arr: T[], n: number): T[] => Array.from<T[]>({ length: n }).fill(arr).flat()
/** 随机播放数组 */
export const shuffle = <T, _>(arr: T[]): T[] => arr.map(a => ({ sort: Math.random(), value: a })).sort((a, b) => a.sort - b.sort).map(a => a.value)
/** 从数组中删除虚假值 */
export const removeFalsy = <T, _>(arr: T[]): T[] => arr.filter(Boolean)
/** 将数组拆分为块 */
// eslint-disable-next-line no-sequences
export const chunk = <T>(arr: T[], size: number): T[][] => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), [] as T[][])
/** 按给定键对项目数组进行排序 */
export const sortBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], k: K): T[] => arr.concat().sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0))
/** 交换矩阵的行和列 */
export const transpose = <T>(matrix: T[][]): T[][] => matrix.reduce((prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])), [] as T[][])
/** 检查平面数组是否有重复值 */
export const hasDuplicateValues = <T, _>(arr: T[]): boolean => new Set(arr).size !== arr.length
/** 是否偶数 */
export const isEven = (n: number): boolean => n % 2 === 0
/** 所有项目是否相等 */
export const areEqual = <T, _>(arr: T[]): boolean => new Set(arr).size === 1
export default {
  accumulate,
  alphabet,
  areEqual,
  average,
  cartesian,
  chunk,
  closest,
  countBy,
  countOccurrences,
  empty,
  findLongest,
  flat,
  getConsecutiveArrays,
  getIntersection,
  getNthItems,
  getSubsets,
  groupBy,
  hasDuplicateValues,
  indexOfMax,
  indexOfMin,
  indices,
  intersperse,
  isEqual,
  isEven,
  lastIndex,
  max,
  maxBy,
  merge,
  min,
  minBy,
  partition,
  range,
  ranking,
  removeDuplicate,
  removeFalsy,
  repeat,
  shuffle,
  sortBy,
  sum,
  toNumbers,
  toObject,
  transpose,
  union,
  unique,
}
