/**
 * 根据指定键返回唯一值的对象数组
 * @param {Array} arrObj - 对象数组
 * @param {string|number} keyUnique - 用于判断唯一性的键
 * @returns {Array} 去重后的对象数组
 * @example
 * // 返回 [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * getUniqueArrObj([{ id: 1, name: 'Alice' }, { id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }], 'id')
 */
export const getUniqueArrObj = <T extends Array<T>, K extends keyof T> (arrObj: T, keyUnique: K) => [...new Map(arrObj.map(item => [item[keyUnique], item])).values()]

/**
 * 从对象数组中提取指定属性的值
 * @param {Array} objs - 对象数组
 * @param {string|number} property - 要提取的属性
 * @returns {Array} 提取的属性值数组
 * @example
 * // 返回 ['Alice', 'Bob']
 * pluck([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }], 'name')
 */
export const pluck = <T extends Array<T>, K extends keyof T> (objs: T, property: K) => objs.map(obj => obj[property])

/**
 * 获取对象指定路径的值
 * @param {object} obj - 源对象
 * @param {string} path - 属性路径，如 "user.name"
 * @returns {any} 路径对应的值
 * @example
 * // 返回 'Alice'
 * getValue({ user: { name: 'Alice' } }, 'user.name')
 */
export const getValue = <T extends Record<string, any>, K extends string>(obj: T, path: K) => path.split('.').reduce((acc, c) => acc && acc[c], obj)

/**
 * 从键值对数组创建对象
 * @param {Array} arr - 键值对数组
 * @returns {object} 创建的对象
 * @example
 * // 返回 { a: 1, b: 2 }
 * toObj([['a', 1], ['b', 2]])
 */
export const toObj = (arr: [string, any][]) => Object.fromEntries(arr)

/**
 * 重命名对象的键
 * @param {object} keysMap - 键映射对象
 * @param {object} obj - 源对象
 * @returns {object} 重命名键后的对象
 * @example
 * // 返回 { newKey: 'value' }
 * renameKeys({ oldKey: 'newKey' }, { oldKey: 'value' })
 */
export const renameKeys = <T extends Record<string, any>, K extends Record<keyof T, string>>(keysMap: K, obj: T) => Object.keys(obj).reduce((acc, key) => ({ ...acc, ...{ [keysMap[key] || key]: obj[key] } }), {})

/**
 * 从对象中忽略指定的键
 * @param {object} obj - 源对象
 * @param {Array} keys - 要忽略的键数组
 * @returns {object} 忽略指定键后的对象
 * @example
 * // 返回 { b: 2 }
 * omit({ a: 1, b: 2, c: 3 }, ['a', 'c'])
 */
export const omit = <T extends Record<string, any>, K extends (keyof T)[]>(obj: T, keys: K) => Object.keys(obj).filter(k => !keys.includes(k)).reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {})

/**
 * 从对象中选择指定的键
 * @param {object} obj - 源对象
 * @param {Array} keys - 要选择的键数组
 * @returns {object} 选择指定键后的对象
 * @example
 * // 返回 { a: 1, c: 3 }
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])
 */
export const pick = <T extends Record<string, any>, K extends (keyof T)[]>(obj: T, keys: K) => Object.keys(obj).filter(k => keys.includes(k)).reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {})

/**
 * 反转对象的键值对
 * @param {object} obj - 源对象
 * @returns {object} 反转键值对后的对象
 * @example
 * // 返回 { '1': 'a', '2': 'b' }
 * invert({ a: 1, b: 2 })
 */
export const invert = <T extends Record<string, any>>(obj: T) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))

/**
 * 清除对象中的 null 和 undefined 值
 * @param {object} obj - 源对象
 * @returns {object} 清除 null 和 undefined 后的对象
 * @example
 * // 返回 { a: 1, c: 3 }
 * removeNullUndefined({ a: 1, b: null, c: 3, d: undefined })
 */
export const removeNullUndefined = <T extends Record<string, any>>(obj: T) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null)) as { [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] }

/**
 * 按键排序对象
 * @param {object} obj - 源对象
 * @returns {object} 按键排序后的对象
 * @example
 * // 返回 { a: 1, b: 2, c: 3 }
 * sort({ c: 3, a: 1, b: 2 })
 */
// eslint-disable-next-line no-sequences
export const sort = <T extends Record<string, unknown>>(obj: T) => Object.keys(obj).sort().reduce((p, c) => ((p[c] = obj[c]), p), {} as any)
