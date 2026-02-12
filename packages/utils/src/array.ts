/**
 * 将对象数组转换为单个对象
 * @param {T[]} arr - 对象数组
 * @param {K} key - 用作键的属性
 * @returns {Record<string, T>} 转换后的对象
 * @example
 * // 示例：将用户数组转换为以 ID 为键的对象
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * toObject(users, 'id'); // => { '1': { id: 1, name: 'Alice' }, '2': { id: 2, name: 'Bob' } }
 */
export const toObject = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): Record<string, T> => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {})
/**
 * 计算数组中值的出现次数
 * @param {T[]} arr - 要搜索的数组
 * @param {T} val - 要计数的值
 * @returns {number} 值在数组中出现的次数
 * @example
 * // 示例：计算数组中数字 2 的出现次数
 * const numbers = [1, 2, 2, 3, 2, 4];
 * countOccurrences(numbers, 2); // => 3
 */
export const countOccurrences = <T, _>(arr: T[], val: T): number => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
/**
 * 在给定范围内创建数字数组
 * @param {number} min - 范围的最小值（包含）
 * @param {number} max - 范围的最大值（包含）
 * @returns {number[]} 包含范围内所有数字的数组
 * @example
 * // 示例：创建 1 到 5 的数字数组
 * range(1, 5); // => [1, 2, 3, 4, 5]
 */
export const range = (min: number, max: number): number[] => [...Array.from({ length: max - min + 1 }).keys()].map(i => i + min)
/**
 * 清空数组
 * @param {T[]} arr - 要清空的数组
 * @returns {number} 返回 0，表示数组已清空
 * @example
 * // 示例：清空数组
 * const arr = [1, 2, 3];
 * empty(arr); // => 0
 * console.log(arr); // => []
 */
export const empty = <T, _>(arr: T[]) => (arr.length = 0)
/**
 * 创建累积总和数组
 * @param {number[]} arr - 数字数组
 * @returns {number[]} 累积总和数组
 * @example
 * // 示例：创建累积总和数组
 * accumulate([1, 2, 3, 4]); // => [1, 3, 6, 10]
 */
export const accumulate = (arr: number[]): number[] => arr.reduce((a, b, i) => (i === 0 ? [b] : [...a, b + a[i - 1]]), [0])
/**
 * 将字符串数组转换为数字
 * @param {string[]} arr - 字符串数组
 * @returns {number[]} 转换后的数字数组
 * @example
 * // 示例：将字符串数组转换为数字
 * toNumbers(['1', '2', '3']); // => [1, 2, 3]
 */
export const toNumbers = (arr: string[]): number[] => arr.map(Number)
/**
 * 创建笛卡尔乘积
 * @param {number[][]} sets - 数字数组的数组
 * @returns {number[][]} 笛卡尔乘积结果
 * @example
 * // 示例：创建两个数组的笛卡尔乘积
 * cartesian([1, 2], [3, 4]); // => [[1, 3], [1, 4], [2, 3], [2, 4]]
 */
export const cartesian = (...sets: number[][]) => sets.reduce((acc, set) => acc.flatMap(x => set.map(y => [...x, y])), [[]] as number[][])
/**
 * 按对象数组的属性计数
 * @param {T[]} arr - 对象数组
 * @param {K} prop - 要计数的属性
 * @returns {Record<string, number>} 按属性值计数的结果
 * @example
 * // 示例：按用户角色计数
 * const users = [{ role: 'admin' }, { role: 'user' }, { role: 'admin' }];
 * countBy(users, 'role'); // => { 'admin': 2, 'user': 1 }
 */
// eslint-disable-next-line no-sequences
export const countBy = <T extends Record<string, string>, K extends keyof T>(arr: T[], prop: K): Record<string, number> => arr.reduce((prev, curr) => ((prev[curr[prop]] = ++prev[curr[prop]] || 1), prev), {} as Record<string, number>)
/**
 * 查找数组中最后一个匹配项的索引
 * @param {T[]} arr - 要搜索的数组
 * @param {Function} predicate - 匹配条件函数
 * @returns {number} 最后一个匹配项的索引，未找到返回 -1
 * @example
 * // 示例：查找最后一个大于 5 的元素索引
 * const numbers = [1, 6, 3, 8, 2];
 * lastIndex(numbers, n => n > 5); // => 3
 */
export const lastIndex = <T, _>(arr: T[], predicate: (a: T) => boolean): number => arr.reduce((prev, curr, index) => (predicate(curr) ? index : prev), -1)
/**
 * 查找数组最小项的索引
 * @param {number[]} arr - 数字数组
 * @returns {number} 最小项的索引
 * @example
 * // 示例：查找数组中最小项的索引
 * indexOfMin([5, 2, 8, 1, 3]); // => 3
 */
export const indexOfMin = (arr: number[]): number => arr.reduce((prev, curr, i, a) => (curr < a[prev] ? i : prev), 0)
/**
 * 查找数组中最长字符串的长度
 * @param {string[]} words - 字符串数组
 * @returns {number} 最长字符串的长度
 * @example
 * // 示例：查找数组中最长字符串的长度
 * findLongest(['apple', 'banana', 'cherry']); // => 6
 */
export const findLongest = (words: string[]): number => Math.max(...words.map(el => el.length))
/**
 * 通过给定键查找数组的最小项
 * @param {T[]} arr - 对象数组
 * @param {K} key - 用于比较的键
 * @returns {T} 具有最小键值的对象
 * @example
 * // 示例：通过年龄查找最年轻的用户
 * const users = [{ age: 25 }, { age: 18 }, { age: 30 }];
 * minBy(users, 'age'); // => { age: 18 }
 */
export const minBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): T => arr.reduce((a, b) => (a[key] < b[key] ? a : b), {} as T)
/**
 * 查找数组中最大项的索引
 * @param {number[]} arr - 数字数组
 * @returns {number} 最大项的索引
 * @example
 * // 示例：查找数组中最大项的索引
 * indexOfMax([5, 2, 8, 1, 3]); // => 2
 */
export const indexOfMax = (arr: number[]): number => arr.reduce((prev, curr, i, a) => (curr > a[prev] ? i : prev), 0)
/**
 * 通过给定键查找数组的最大项
 * @param {T[]} arr - 对象数组
 * @param {K} key - 用于比较的键
 * @returns {T} 具有最大键值的对象
 * @example
 * // 示例：通过年龄查找最年长的用户
 * const users = [{ age: 25 }, { age: 18 }, { age: 30 }];
 * maxBy(users, 'age'); // => { age: 30 }
 */
export const maxBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): T => arr.reduce((a, b) => (a[key] >= b[key] ? a : b), {} as T)
/**
 * 查找数组的最小项
 * @param {number[]} arr - 数字数组
 * @returns {number} 数组中的最小项
 * @example
 * // 示例：查找数组中的最小项
 * min([5, 2, 8, 1, 3]); // => 1
 */
export const min = (arr: number[]): number => Math.min(...arr)
/**
 * 平展数组
 * @param {T[]} arr - 可能包含嵌套数组的数组
 * @returns {T[]} 平展后的数组
 * @example
 * // 示例：平展嵌套数组
 * flat([1, [2, [3, 4]], 5]); // => [1, 2, 3, 4, 5]
 */
export const flat = <T = string | string[]>(arr: T[]): T[] => arr.reduce((a, b) => (Array.isArray(b) ? [...a, ...flat(b)] : [...a, b]), [] as T[])
/**
 * 获取连续元素的所有数组
 * @param {T[]} arr - 原始数组
 * @param {number} size - 连续数组的大小
 * @returns {T[][]} 连续元素的数组
 * @example
 * // 示例：获取大小为 2 的连续数组
 * getConsecutiveArrays([1, 2, 3, 4], 2); // => [[1, 2], [2, 3], [3, 4]]
 */
export const getConsecutiveArrays = <T, _>(arr: T[], size: number): T[][] => (size > arr.length ? [] : arr.slice(size - 1).map((_, i) => arr.slice(i, size + i)))
/**
 * 从数组中查找最接近的数字
 * @param {number[]} arr - 数字数组
 * @param {number} n - 目标数字
 * @returns {number} 最接近目标数字的元素
 * @example
 * // 示例：查找最接近 7 的数字
 * closest([1, 5, 9, 12], 7); // => 5
 */
export const closest = (arr: number[], n: number): number => arr.reduce((prev, curr) => (Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev))
/**
 * 获取数组中值的索引
 * @param {T[]} arr - 要搜索的数组
 * @param {T} value - 要查找的值
 * @returns {number[]} 所有匹配值的索引数组
 * @example
 * // 示例：获取数组中所有 2 的索引
 * indices([1, 2, 3, 2, 4], 2); // => [1, 3]
 */
export const indices = <T>(arr: T[], value: T): number[] => arr.reduce((acc, v, i) => (v === value ? [...acc, i] : acc), [] as number[])
/**
 * 查找数组的最大项
 * @param {number[]} arr - 数字数组
 * @returns {number} 数组中的最大项
 * @example
 * // 示例：查找数组中的最大项
 * max([5, 2, 8, 1, 3]); // => 8
 */
export const max = (arr: number[]): number => Math.max(...arr)
/**
 * 获取数组的所有第 n 项
 * @param {T[]} arr - 原始数组
 * @param {number} nth - 第 n 项的位置
 * @returns {T[]} 所有第 n 项的数组
 * @example
 * // 示例：获取数组中的所有第 2 项（索引为 1, 3, 5...）
 * getNthItems([1, 2, 3, 4, 5, 6], 2); // => [2, 4, 6]
 */
export const getNthItems = <T, _>(arr: T[], nth: number): T[] => arr.filter((_, i) => i % nth === nth - 1)
/**
 * 生成字母字符数组
 * @returns {string[]} 包含 26 个小写字母的数组
 * @example
 * // 示例：生成字母字符数组
 * alphabet(); // => ['a', 'b', 'c', ..., 'z']
 */
export const alphabet = (): string[] => Array.from({ length: 26 }).fill(0).map((_, i) => String.fromCharCode(i + 97))
/**
 * 获取数组的平均值
 * @param {number[]} arr - 数字数组
 * @returns {number} 数组的平均值
 * @example
 * // 示例：获取数组的平均值
 * average([1, 2, 3, 4, 5]); // => 3
 */
export const average = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length
/**
 * 获取数组的交集
 * @param {T[]} a - 第一个数组
 * @param {T[][]} arr - 其他数组
 * @returns {T[]} 所有数组的交集
 * @example
 * // 示例：获取三个数组的交集
 * getIntersection([1, 2, 3], [2, 3, 4], [3, 4, 5]); // => [3]
 */
export const getIntersection = <T, _>(a: T[], ...arr: T[][]): T[] => [...new Set(a)].filter(v => arr.every(b => b.includes(v)))
/**
 * 获取数组的所有子集
 * @param {T[]} arr - 原始数组
 * @returns {T[][]} 所有可能的子集
 * @example
 * // 示例：获取数组的所有子集
 * getSubsets([1, 2]); // => [[], [1], [2], [1, 2]]
 */
export const getSubsets = <T>(arr: T[]): T[][] => arr.reduce((prev, curr) => prev.concat(prev.map(k => k.concat(curr))), [[]] as T[][])
/**
 * 获取数字数组的排名
 * @param {number[]} arr - 数字数组
 * @returns {number[]} 每个元素的排名
 * @example
 * // 示例：获取数组的排名
 * ranking([5, 2, 8, 1]); // => [2, 3, 1, 4]
 */
export const ranking = (arr: number[]): number[] => arr.map((x, y, z) => z.filter(w => w > x).length + 1)
/**
 * 获取数组的唯一值
 * @param {T[]} arr - 原始数组
 * @returns {T[]} 去重后的数组
 * @example
 * // 示例：获取数组的唯一值
 * unique([1, 2, 2, 3, 1]); // => [1, 2, 3]
 */
export const unique = <T>(arr: T[]): T[] => arr.reduce((acc, el) => (acc.includes(el) ? acc : [...acc, el]), [] as T[])
/**
 * 获取数字数组的总和
 * @param {number[]} arr - 数字数组
 * @returns {number} 数组的总和
 * @example
 * // 示例：获取数组的总和
 * sum([1, 2, 3, 4, 5]); // => 15
 */
export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)
/**
 * 获取数组的联合
 * @param {T[][]} arr - 数组的数组
 * @returns {T[]} 所有数组的联合
 * @example
 * // 示例：获取两个数组的联合
 * union([1, 2, 3], [3, 4, 5]); // => [1, 2, 3, 4, 5]
 */
export const union = <T, _>(...arr: T[][]): T[] => [...new Set(arr.flat())]
/**
 * 按键对对象数组进行分组
 * @param {T[]} arr - 对象数组
 * @param {K} key - 分组的键
 * @returns {Record<string, T[]>} 按键分组的对象
 * @example
 * // 示例：按用户角色分组
 * const users = [{ role: 'admin' }, { role: 'user' }, { role: 'admin' }];
 * groupBy(users, 'role'); // => { 'admin': [{ role: 'admin' }, { role: 'admin' }], 'user': [{ role: 'user' }] }
 */
// eslint-disable-next-line no-sequences
export const groupBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {} as Record<string, T[]>)
/**
 * 元素之间穿插元素
 * @param {T[]} a - 原始数组
 * @param {T} s - 要穿插的元素
 * @returns {T[]} 穿插后的数组
 * @example
 * // 示例：在数组元素之间穿插逗号
 * intersperse(['a', 'b', 'c'], ','); // => ['a', ',', 'b', ',', 'c']
 */
export const intersperse = <T>(a: T[], s: T): T[] => [...Array.from({ length: 2 * a.length - 1 })].map((_, i) => (i % 2 ? s : a[i / 2]))
/**
 * 根据条件对阵列进行分区
 * @param {T[]} arr - 原始数组
 * @param {Function} criteria - 分区条件函数
 * @returns {T[][]} 分区后的数组，第一个数组为满足条件的元素，第二个为不满足的
 * @example
 * // 示例：根据是否为偶数分区
 * partition([1, 2, 3, 4, 5], n => n % 2 === 0); // => [[2, 4], [1, 3, 5]]
 */
// eslint-disable-next-line no-sequences
export const partition = <T, _>(arr: T[], criteria: (a: T) => boolean): T[][] => arr.reduce((acc, i) => (acc[criteria(i) ? 0 : 1].push(i), acc), [[], []] as T[][])
/**
 * 合并两个数组
 * @param {T[]} a - 第一个数组
 * @param {T[]} b - 第二个数组
 * @param {boolean} [d] - 是否去重
 * @returns {T[]} 合并后的数组
 * @example
 * // 示例：合并两个数组（不去重）
 * merge([1, 2], [2, 3]); // => [1, 2, 2, 3]
 * // 示例：合并两个数组（去重）
 * merge([1, 2], [2, 3], true); // => [1, 2, 3]
 */
export const merge = <T, _>(a: T[], b: T[], d?: boolean): T[] => d ? [...new Set(a.concat(b))] : a.concat(b)
/**
 * 删除数组中的重复值
 * @param {T[]} arr - 原始数组
 * @returns {T[]} 只包含唯一值的数组
 * @example
 * // 示例：删除数组中的重复值
 * removeDuplicate([1, 2, 2, 3, 1]); // => [3]
 */
export const removeDuplicate = <T, _>(arr: T[]): T[] => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i))
/**
 * 重复一个数组
 * @param {T[]} arr - 原始数组
 * @param {number} n - 重复次数
 * @returns {T[]} 重复后的数组
 * @example
 * // 示例：重复数组 3 次
 * repeat([1, 2], 3); // => [1, 2, 1, 2, 1, 2]
 */
export const repeat = <T, _>(arr: T[], n: number): T[] => Array.from<T[]>({ length: n }).fill(arr).flat()
/**
 * 随机播放数组
 * @param {T[]} arr - 原始数组
 * @returns {T[]} 随机排序后的数组
 * @example
 * // 示例：随机播放数组
 * shuffle([1, 2, 3, 4, 5]); // => [3, 1, 5, 2, 4]（结果随机）
 */
export const shuffle = <T, _>(arr: T[]): T[] => arr.map(a => ({ sort: Math.random(), value: a })).sort((a, b) => a.sort - b.sort).map(a => a.value)
/**
 * 从数组中删除虚假值
 * @param {T[]} arr - 原始数组
 * @returns {T[]} 移除虚假值后的数组
 * @example
 * // 示例：删除数组中的虚假值
 * removeFalsy([1, false, 'hello', 0, null, '']); // => [1, 'hello']
 */
export const removeFalsy = <T, _>(arr: T[]): T[] => arr.filter(Boolean)
/**
 * 将数组拆分为块
 * @param {T[]} arr - 原始数组
 * @param {number} size - 每个块的大小
 * @returns {T[][]} 分块后的数组
 * @example
 * // 示例：将数组拆分为大小为 2 的块
 * chunk([1, 2, 3, 4, 5], 2); // => [[1, 2], [3, 4], [5]]
 */
// eslint-disable-next-line no-sequences
export const chunk = <T>(arr: T[], size: number): T[][] => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), [] as T[][])
/**
 * 按给定键对项目数组进行排序
 * @param {T[]} arr - 对象数组
 * @param {K} k - 排序的键
 * @returns {T[]} 排序后的数组
 * @example
 * // 示例：按年龄排序用户数组
 * const users = [{ age: 30 }, { age: 18 }, { age: 25 }];
 * sortBy(users, 'age'); // => [{ age: 18 }, { age: 25 }, { age: 30 }]
 */
export const sortBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], k: K): T[] => arr.concat().sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0))
/**
 * 交换矩阵的行和列
 * @param {T[][]} matrix - 原始矩阵
 * @returns {T[][]} 转置后的矩阵
 * @example
 * // 示例：转置矩阵
 * transpose([[1, 2], [3, 4], [5, 6]]); // => [[1, 3, 5], [2, 4, 6]]
 */
export const transpose = <T>(matrix: T[][]): T[][] => matrix.reduce((prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])), [] as T[][])
