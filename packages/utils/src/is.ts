import { toString } from './string'

export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = <T extends Function> (val: any): val is T => typeof val === 'function'
export const isNumber = (val: any): val is number => typeof val === 'number'
export const isString = (val: unknown): val is string => typeof val === 'string'
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
export default {
  isArray,
  isBlob,
  isBoolean,
  isBrowser,
  isDarkMode,
  isDate,
  isDef,
  isDocument,
  isFile,
  isFormData,
  isFunction,
  isMap,
  isNativeError,
  isNode,
  isNull,
  isNumber,
  isObject,
  isRegExp,
  isSet,
  isString,
  isUndefined,
  isURLSearchParams,
  isWindow,
}
