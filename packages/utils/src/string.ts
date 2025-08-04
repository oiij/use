/** 转为字符串 */
export const toString = (v: any) => Object.prototype.toString.call(v)
/** 首字母大写 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)
/** 首字母小写 */
export const unCapitalize = ([first, ...rest]: string): string => `${first.toLowerCase()}${rest.join('')}`
/** 是否是重复字符串 */
export const consistsRepeatedSubstring = (str: string): boolean => `${str}${str}`.indexOf(str, 1) !== str.length
/** 字符串是否相等 */
export const areAnagram = (str1: string, str2: string): boolean => str1.toLowerCase().split('').sort().join('') === str2.toLowerCase().split('').sort().join('')
/** base64转uint8 */
export const base64ToUint8 = (str: string): Uint8Array => Uint8Array.from(atob(str), c => c.charCodeAt(0))
/** 字符串转驼峰 */
export const toCamelCase = (str: string): string => str.trim().replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
/** 转大驼峰 */
export const toPascalCase = (str: string): string => (str.match(/[a-z0-9]+/gi) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('')
/** 字母转emoji */
export const letterToEmoji = (c: string): string => String.fromCodePoint(c.toLowerCase().charCodeAt(0) + 127365)
/** 字符串短横线链接 */
export const slugify = (str: string): string => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
/** window路径转unix路径 */
export const toUnixPath = (path: string): string => path.replace(/[\\/]+/g, '/').replace(/^([a-z]+:|\.\/)/i, '')
/** uint8转base64 */
export const uint8ToBase64 = (arr: Uint8Array): string => btoa(Array.from({ length: arr.length }).fill('').map((_, i) => String.fromCharCode(arr[i])).join(''))
/** 下划线转小驼峰 */
export const snakeToCamel = (str: string): string => str.toLowerCase().replace(/(_\w)/g, m => m.toUpperCase().substr(1))
/** 短横线转小驼峰 */
export const kebabToCamel = (str: string): string => str.replace(/-./g, m => m.toUpperCase()[1])
/** 小驼峰转短划线 */
export const camelToKebab = (str: string): string => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
/** 将 Excel 列的名称转换为数字 */
export const getIndex = (col: string): number => col.split('').reduce((prev, next) => prev * 26 + Number.parseInt(next, 36) - 9, 0)
/** 字符出现次数 */
export const countOccurrences = (str: string, char: string): number => str.split('').filter(item => item === char).length
/** html实体 */
export const decodeHtmlEntities = (str: string): string => str.replace(/&#(\w+)(;)?/g, (_, dec) => String.fromCharCode(dec))
/** 字符中单词数 */
export const countWords = (str: string): number => str.trim().split(/\s+/).length
/** {value} 格式化字符串 */
export const format = (str: string, ...vals: any[]): string => vals.reduce((s, v, i) => s.replace(new RegExp(`\\{${i}\\}`, 'g'), v), str)
/** 转义特殊字符 */
export const escapeString = (str: string): string => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')
/** 获取不带参数的基本网址 */
export const baseUrl = (url: string): string => url.split('?')[0]
/** 生成字符串哈希 */
export const hashString = (str: string): number => str.split('').reduce((prev, curr) => (Math.imul(31, prev) + curr.charCodeAt(0)) | 0, 0)
/** 截取扩展名 */
export const ext = (fileName: string): string => fileName.split('.').pop() as string
/** 获取字符串长度 */
export const bytes = (str: string): number => new Blob([str]).size
/** 字符串中字符的个数 */
export const characterCount = (str: string, char: string): number => str.split(char).length - 1
/** 首字母小写 */
export const lowercaseFirst = (str: string): string => `${str.charAt(0).toLowerCase()}${str.slice(1)}`
/** 格式化路径 */
export const normalizePath = (path: string): string => path.replace(/[\\/]+/g, '/')
/** 文档加行号 */
export const prependNumbers = (str: string): string => str.split(/\r?\n/).map((line, i) => `${(i + 1).toString().padStart(2, ' ')} ${line}`).join('\n')
/** 删除重复行 */
export const removeDuplicateLines = (str: string): string => Array.from(new Set(str.split(/\r?\n/))).join('\n')
/** 清除文档空行 */
export const removeEmptyLines = (str: string): string => str.split(/\r?\n/).filter(line => line.trim() !== '').join('\n')
/** 删除空行 */
export const removeSpaces = (str: string): string => str.replace(/\s/g, '')
/** 重复字符串 */
export const repeat = (str: string, numberOfTimes: number): string => str.repeat(numberOfTimes)
/** 换行转br */
export const nl2br = (str: string): string => str.replace(/\r?\n/g, '<br>')
/** 制表符转空格 */
export const replace = (str: string, numSpaces = 4): string => str.replaceAll('\t', ' '.repeat(numSpaces))
/** 单个空格替换多个空格 */
export const replaceSpaces = (str: string): string => str.replace(/\s{2,}/g, ' ')
/** 字符串打码 */
export const mask = (str: string, num: number, mask: string): string => `${str}`.slice(num).padStart(`${str}`.length, mask)
/** 反转字符串 */
export const reverse = (str: string): string => str.split('').reverse().join('')
/** 反转行顺序 */
export const reverseLines = (str: string): string => str.split(/\r?\n/).reverse().join('\n')
/** 按字母行排序 */
export const sortLines = (str: string): string => str.split(/\r?\n/).sort().join('\n')
/** 按字母排序 */
export const sort = (str: string): string => str.split('').sort((a, b) => a.localeCompare(b)).join('')
/** 从字符串中删除 ANSI 代码 */
// eslint-disable-next-line no-control-regex
export const stripAnsiCodes = (str: string): string => str.replace(/[\u001B\u009B][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
/** 交换大小写 */
export const swapCase = (str: string): string => str.split('').map(c => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())).join('')
/** 修剪字符 */
export const trim = (str: string, char: string): string => str.split(char).filter(Boolean).join()
/** 修剪字符串斜杠 */
export const trimSlashes = (str: string): string => str.replace(/^\/+|\/+$/g, '')
/** 修剪扩展名 */
export const trimExt = (fileName: string): string => (!fileName.includes('.') ? fileName : fileName.split('.').slice(0, -1).join('.'))
/** 按长度截断字符串 */
export const truncate = (str: string, max: number, suffix = '...'): string => (str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`)
/** 取消转义字符串 */
export const unescapeString = (str: string): string => str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, '\'').replace(/&quot;/g, '"')
/** 单词首字母大写 */
export const uppercaseWords = (str: string): string => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase())
/** 随机字符串 */
export const randomString = (): string => Math.random().toString(36).slice(2)
/** 去除字符串中的HTML */
export const stripHtml = (html: string): string => (new DOMParser().parseFromString(html, 'text/html')).body.textContent || ''
/** 是否包含小写字符 */
export const containsLowerCase = (str: string): boolean => str !== str.toUpperCase()
/** 是否包含大写字符 */
export const containsUpperCase = (str: string): boolean => str !== str.toLowerCase()
/** 是否包含空格 */
// eslint-disable-next-line unused-imports/no-unused-vars
export const containsWhitespace = (str: any) => (str: string) => /\s/.test(str)
