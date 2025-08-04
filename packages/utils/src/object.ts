/** 返回唯一值Key */
export const getUniqueArrObj = <T extends Array<T>, K extends keyof T> (arrObj: T, keyUnique: K) => [...new Map(arrObj.map(item => [item[keyUnique], item])).values()]
/** 提取属性值 */
export const pluck = <T extends Array<T>, K extends keyof T> (objs: T, property: K) => objs.map(obj => obj[property])
/** 获取对象指定path的值 */
export const getValue = <T extends Record<string, any>, K extends string>(obj: T, path: K) => path.split('.').reduce((acc, c) => acc && acc[c], obj)
/** 键值对创建对象 */
export const toObj = (arr: [string, any][]) => Object.fromEntries(arr)
/** 重命名key */
export const renameKeys = <T extends Record<string, any>, K extends Record<keyof T, string>>(keysMap: K, obj: T) => Object.keys(obj).reduce((acc, key) => ({ ...acc, ...{ [keysMap[key] || key]: obj[key] } }), {})
/** 从对象忽略 */
export const omit = <T extends Record<string, any>, K extends (keyof T)[]>(obj: T, keys: K) => Object.keys(obj).filter(k => !keys.includes(k)).reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {})
/** 从对象中选择 */
export const pick = <T extends Record<string, any>, K extends (keyof T)[]>(obj: T, keys: K) => Object.keys(obj).filter(k => keys.includes(k)).reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {})
/** 反转键值对 */
export const invert = <T extends Record<string, any>>(obj: T) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))
/** 清除null 和 undefined */
export const removeNullUndefined = <T extends Record<string, any>>(obj: T) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null)) as { [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] }

// eslint-disable-next-line no-sequences
export const sort = <T extends Record<string, unknown>>(obj: T) => Object.keys(obj).sort().reduce((p, c) => ((p[c] = obj[c]), p), {} as any)
