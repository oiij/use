/**
 * 转为字符串
 * @param {any} v - 要转换的值
 * @returns {string} 转换后的字符串
 * @example
 * // 示例：将对象转为字符串
 * toString({}); // => '[object Object]'
 */
export const toString = (v: any) => Object.prototype.toString.call(v)
/**
 * 首字母大写
 * @param {string} str - 原始字符串
 * @returns {string} 首字母大写后的字符串
 * @example
 * // 示例：首字母大写
 * capitalize('hello'); // => 'Hello'
 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)
/**
 * 首字母小写
 * @param {string} str - 原始字符串
 * @returns {string} 首字母小写后的字符串
 * @example
 * // 示例：首字母小写
 * unCapitalize('Hello'); // => 'hello'
 */
export const unCapitalize = ([first, ...rest]: string): string => `${first.toLowerCase()}${rest.join('')}`
/**
 * 是否是重复字符串
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否由重复子字符串组成
 * @example
 * // 示例：检查是否是重复字符串
 * consistsRepeatedSubstring('abab'); // => true
 * consistsRepeatedSubstring('abc'); // => false
 */
export const consistsRepeatedSubstring = (str: string): boolean => `${str}${str}`.indexOf(str, 1) !== str.length
/**
 * 字符串是否相等（变位词）
 * @param {string} str1 - 第一个字符串
 * @param {string} str2 - 第二个字符串
 * @returns {boolean} 是否是变位词
 * @example
 * // 示例：检查是否是变位词
 * areAnagram('listen', 'silent'); // => true
 * areAnagram('hello', 'world'); // => false
 */
export const areAnagram = (str1: string, str2: string): boolean => str1.toLowerCase().split('').sort().join('') === str2.toLowerCase().split('').sort().join('')
/**
 * base64转uint8
 * @param {string} str - base64字符串
 * @returns {Uint8Array} 转换后的Uint8Array
 * @example
 * // 示例：base64转uint8
 * base64ToUint8('SGVsbG8='); // => Uint8Array [72, 101, 108, 108, 111]
 */
export const base64ToUint8 = (str: string): Uint8Array => Uint8Array.from(atob(str), c => c.charCodeAt(0))
/**
 * 字符串转驼峰
 * @param {string} str - 原始字符串
 * @returns {string} 驼峰格式的字符串
 * @example
 * // 示例：字符串转驼峰
 * toCamelCase('hello-world'); // => 'helloWorld'
 */
export const toCamelCase = (str: string): string => str.trim().replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
/**
 * 转大驼峰
 * @param {string} str - 原始字符串
 * @returns {string} 大驼峰格式的字符串
 * @example
 * // 示例：转大驼峰
 * toPascalCase('hello-world'); // => 'HelloWorld'
 */
export const toPascalCase = (str: string): string => (str.match(/[a-z0-9]+/gi) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('')
/**
 * 字母转emoji
 * @param {string} c - 单个字母
 * @returns {string} 对应的emoji
 * @example
 * // 示例：字母转emoji
 * letterToEmoji('a'); // => '🇦'
 */
export const letterToEmoji = (c: string): string => String.fromCodePoint(c.toLowerCase().charCodeAt(0) + 127365)
/**
 * 字符串短横线链接
 * @param {string} str - 原始字符串
 * @returns {string} 短横线链接格式的字符串
 * @example
 * // 示例：字符串短横线链接
 * slugify('Hello World!'); // => 'hello-world'
 */
export const slugify = (str: string): string => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
/**
 * window路径转unix路径
 * @param {string} path - window路径
 * @returns {string} unix路径
 * @example
 * // 示例：window路径转unix路径
 * toUnixPath('C:\\Users\\PC\\Desktop'); // => 'Users/PC/Desktop'
 */
export const toUnixPath = (path: string): string => path.replace(/[\\/]+/g, '/').replace(/^([a-z]+:|\.\/)/i, '')
/**
 * uint8转base64
 * @param {Uint8Array} arr - Uint8Array数组
 * @returns {string} 转换后的base64字符串
 * @example
 * // 示例：uint8转base64
 * uint8ToBase64(new Uint8Array([72, 101, 108, 108, 111])); // => 'SGVsbG8='
 */
export const uint8ToBase64 = (arr: Uint8Array): string => btoa(Array.from({ length: arr.length }).fill('').map((_, i) => String.fromCharCode(arr[i])).join(''))
/**
 * 下划线转小驼峰
 * @param {string} str - 下划线格式的字符串
 * @returns {string} 小驼峰格式的字符串
 * @example
 * // 示例：下划线转小驼峰
 * snakeToCamel('hello_world'); // => 'helloWorld'
 */
export const snakeToCamel = (str: string): string => str.toLowerCase().replace(/(_\w)/g, m => m.toUpperCase().substr(1))
/**
 * 短横线转小驼峰
 * @param {string} str - 短横线格式的字符串
 * @returns {string} 小驼峰格式的字符串
 * @example
 * // 示例：短横线转小驼峰
 * kebabToCamel('hello-world'); // => 'helloWorld'
 */
export const kebabToCamel = (str: string): string => str.replace(/-./g, m => m.toUpperCase()[1])
/**
 * 小驼峰转短划线
 * @param {string} str - 小驼峰格式的字符串
 * @returns {string} 短横线格式的字符串
 * @example
 * // 示例：小驼峰转短划线
 * camelToKebab('helloWorld'); // => 'hello-world'
 */
export const camelToKebab = (str: string): string => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
/**
 * 将 Excel 列的名称转换为数字
 * @param {string} col - Excel列名
 * @returns {number} 对应的数字索引
 * @example
 * // 示例：将 Excel 列名转换为数字
 * getIndex('A'); // => 1
 * getIndex('Z'); // => 26
 * getIndex('AA'); // => 27
 */
export const getIndex = (col: string): number => col.split('').reduce((prev, next) => prev * 26 + Number.parseInt(next, 36) - 9, 0)
/**
 * 字符出现次数
 * @param {string} str - 原始字符串
 * @param {string} char - 要统计的字符
 * @returns {number} 字符出现的次数
 * @example
 * // 示例：统计字符出现次数
 * countOccurrences('hello world', 'l'); // => 3
 */
export const countOccurrences = (str: string, char: string): number => str.split('').filter(item => item === char).length
/**
 * html实体解码
 * @param {string} str - 包含html实体的字符串
 * @returns {string} 解码后的字符串
 * @example
 * // 示例：解码html实体
 * decodeHtmlEntities('&lt;div&gt;'); // => '<div>'
 */
export const decodeHtmlEntities = (str: string): string => str.replace(/&#(\w+)(;)?/g, (_, dec) => String.fromCharCode(dec))
/**
 * 字符中单词数
 * @param {string} str - 原始字符串
 * @returns {number} 单词数量
 * @example
 * // 示例：统计单词数量
 * countWords('hello world'); // => 2
 */
export const countWords = (str: string): number => str.trim().split(/\s+/).length
/**
 * {value} 格式化字符串
 * @param {string} str - 包含占位符的字符串
 * @param {any[]} vals - 替换占位符的值
 * @returns {string} 格式化后的字符串
 * @example
 * // 示例：格式化字符串
 * format('Hello {0}, your age is {1}', 'World', 18); // => 'Hello World, your age is 18'
 */
export const format = (str: string, ...vals: any[]): string => vals.reduce((s, v, i) => s.replace(new RegExp(`\\{${i}\\}`), v), str)
/**
 * 转义特殊字符
 * @param {string} str - 原始字符串
 * @returns {string} 转义后的字符串
 * @example
 * // 示例：转义特殊字符
 * escapeString('<div>Hello</div>'); // => '&lt;div&gt;Hello&lt;/div&gt;'
 */
export const escapeString = (str: string): string => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')
/**
 * 获取不带参数的基本网址
 * @param {string} url - 完整的URL
 * @returns {string} 不带查询参数的URL
 * @example
 * // 示例：获取基本网址
 * baseUrl('https://example.com/path?query=1'); // => 'https://example.com/path'
 */
export const baseUrl = (url: string): string => url.split('?')[0]
/**
 * 生成字符串哈希
 * @param {string} str - 原始字符串
 * @returns {number} 字符串的哈希值
 * @example
 * // 示例：生成字符串哈希
 * hashString('hello'); // => 99162322
 */
export const hashString = (str: string): number => str.split('').reduce((prev, curr) => (Math.imul(31, prev) + curr.charCodeAt(0)) | 0, 0)
/**
 * 截取扩展名
 * @param {string} fileName - 文件名
 * @returns {string} 文件扩展名
 * @example
 * // 示例：截取文件扩展名
 * ext('file.txt'); // => 'txt'
 */
export const ext = (fileName: string): string => fileName.split('.').pop() as string
/**
 * 获取字符串长度（字节数）
 * @param {string} str - 原始字符串
 * @returns {number} 字符串的字节数
 * @example
 * // 示例：获取字符串字节数
 * bytes('hello'); // => 5
 */
export const bytes = (str: string): number => new Blob([str]).size
/**
 * 字符串中字符的个数
 * @param {string} str - 原始字符串
 * @param {string} char - 要统计的字符
 * @returns {number} 字符出现的次数
 * @example
 * // 示例：统计字符串中字符的个数
 * characterCount('hello world', 'o'); // => 2
 */
export const characterCount = (str: string, char: string): number => str.split(char).length - 1
/**
 * 首字母小写
 * @param {string} str - 原始字符串
 * @returns {string} 首字母小写后的字符串
 * @example
 * // 示例：首字母小写
 * lowercaseFirst('Hello'); // => 'hello'
 */
export const lowercaseFirst = (str: string): string => `${str.charAt(0).toLowerCase()}${str.slice(1)}`
/**
 * 格式化路径
 * @param {string} path - 原始路径
 * @returns {string} 标准化后的路径
 * @example
 * // 示例：格式化路径
 * normalizePath('C:\\Users\\PC\\Desktop'); // => 'C:/Users/PC/Desktop'
 */
export const normalizePath = (path: string): string => path.replace(/[\\/]+/g, '/')
/**
 * 文档加行号
 * @param {string} str - 原始字符串
 * @returns {string} 加了行号的字符串
 * @example
 * // 示例：为文档添加行号
 * prependNumbers('Hello\nWorld'); // => ' 1 Hello\n 2 World'
 */
export const prependNumbers = (str: string): string => str.split(/\r?\n/).map((line, i) => `${(i + 1).toString().padStart(2, ' ')} ${line}`).join('\n')
/**
 * 删除重复行
 * @param {string} str - 原始字符串
 * @returns {string} 删除重复行后的字符串
 * @example
 * // 示例：删除重复行
 * removeDuplicateLines('Hello\nWorld\nHello'); // => 'Hello\nWorld'
 */
export const removeDuplicateLines = (str: string): string => Array.from(new Set(str.split(/\r?\n/))).join('\n')
/**
 * 清除文档空行
 * @param {string} str - 原始字符串
 * @returns {string} 清除空行后的字符串
 * @example
 * // 示例：清除文档空行
 * removeEmptyLines('Hello\n\nWorld'); // => 'Hello\nWorld'
 */
export const removeEmptyLines = (str: string): string => str.split(/\r?\n/).filter(line => line.trim() !== '').join('\n')
/**
 * 删除所有空格
 * @param {string} str - 原始字符串
 * @returns {string} 删除空格后的字符串
 * @example
 * // 示例：删除所有空格
 * removeSpaces('hello world'); // => 'helloworld'
 */
export const removeSpaces = (str: string): string => str.replace(/\s/g, '')
/**
 * 重复字符串
 * @param {string} str - 原始字符串
 * @param {number} numberOfTimes - 重复次数
 * @returns {string} 重复后的字符串
 * @example
 * // 示例：重复字符串
 * repeat('hello', 3); // => 'hellohellohello'
 */
export const repeat = (str: string, numberOfTimes: number): string => str.repeat(numberOfTimes)
/**
 * 换行转br
 * @param {string} str - 原始字符串
 * @returns {string} 换行符替换为<br>的字符串
 * @example
 * // 示例：换行转br
 * nl2br('Hello\nWorld'); // => 'Hello<br>World'
 */
export const nl2br = (str: string): string => str.replace(/\r?\n/g, '<br>')
/**
 * 制表符转空格
 * @param {string} str - 原始字符串
 * @param {number} [numSpaces] - 每个制表符替换的空格数
 * @returns {string} 制表符替换为空格的字符串
 * @example
 * // 示例：制表符转空格
 * replace('Hello\tWorld'); // => 'Hello    World'
 */
export const replace = (str: string, numSpaces = 4): string => str.replaceAll('\t', ' '.repeat(numSpaces))
/**
 * 单个空格替换多个空格
 * @param {string} str - 原始字符串
 * @returns {string} 多个空格替换为单个空格的字符串
 * @example
 * // 示例：多个空格替换为单个空格
 * replaceSpaces('hello   world'); // => 'hello world'
 */
export const replaceSpaces = (str: string): string => str.replace(/\s{2,}/g, ' ')
/**
 * 字符串打码
 * @param {string} str - 原始字符串
 * @param {number} num - 保留的字符数
 * @param {string} mask - 打码字符
 * @returns {string} 打码后的字符串
 * @example
 * // 示例：字符串打码
 * mask('1234567890', 4, '*'); // => '******7890'
 */
export const mask = (str: string, num: number, mask: string): string => `${str}`.slice(num).padStart(`${str}`.length, mask)
/**
 * 反转字符串
 * @param {string} str - 原始字符串
 * @returns {string} 反转后的字符串
 * @example
 * // 示例：反转字符串
 * reverse('hello'); // => 'olleh'
 */
export const reverse = (str: string): string => str.split('').reverse().join('')
/**
 * 反转行顺序
 * @param {string} str - 原始字符串
 * @returns {string} 行顺序反转后的字符串
 * @example
 * // 示例：反转行顺序
 * reverseLines('Hello\nWorld'); // => 'World\nHello'
 */
export const reverseLines = (str: string): string => str.split(/\r?\n/).reverse().join('\n')
/**
 * 按字母行排序
 * @param {string} str - 原始字符串
 * @returns {string} 按字母顺序排序后的字符串
 * @example
 * // 示例：按字母行排序
 * sortLines('World\nHello'); // => 'Hello\nWorld'
 */
export const sortLines = (str: string): string => str.split(/\r?\n/).sort().join('\n')
/**
 * 按字母排序
 * @param {string} str - 原始字符串
 * @returns {string} 按字母顺序排序后的字符串
 * @example
 * // 示例：按字母排序
 * sort('hello'); // => 'ehllo'
 */
export const sort = (str: string): string => str.split('').sort((a, b) => a.localeCompare(b)).join('')
/**
 * 从字符串中删除 ANSI 代码
 * @param {string} str - 包含 ANSI 代码的字符串
 * @returns {string} 删除 ANSI 代码后的字符串
 * @example
 * // 示例：删除 ANSI 代码
 * stripAnsiCodes('\x1b[31mHello\x1b[0m'); // => 'Hello'
 */
// eslint-disable-next-line no-control-regex
export const stripAnsiCodes = (str: string): string => str.replace(/[\u001B\u009B][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
/**
 * 交换大小写
 * @param {string} str - 原始字符串
 * @returns {string} 大小写交换后的字符串
 * @example
 * // 示例：交换大小写
 * swapCase('Hello World'); // => 'hELLO wORLD'
 */
export const swapCase = (str: string): string => str.split('').map(c => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())).join('')
/**
 * 修剪字符
 * @param {string} str - 原始字符串
 * @param {string} char - 要修剪的字符
 * @returns {string} 修剪后的字符串
 * @example
 * // 示例：修剪字符
 * trim('---hello---', '-'); // => 'hello'
 */
export const trim = (str: string, char: string): string => str.split(char).filter(Boolean).join()
/**
 * 修剪字符串斜杠
 * @param {string} str - 原始字符串
 * @returns {string} 修剪斜杠后的字符串
 * @example
 * // 示例：修剪字符串斜杠
 * trimSlashes('/hello/world/'); // => 'hello/world'
 */
export const trimSlashes = (str: string): string => str.replace(/^\/+|\/+$/g, '')
/**
 * 修剪扩展名
 * @param {string} fileName - 文件名
 * @returns {string} 去除扩展名后的文件名
 * @example
 * // 示例：修剪文件扩展名
 * trimExt('file.txt'); // => 'file'
 */
export const trimExt = (fileName: string): string => (!fileName.includes('.') ? fileName : fileName.split('.').slice(0, -1).join('.'))
/**
 * 按长度截断字符串
 * @param {string} str - 原始字符串
 * @param {number} max - 最大长度
 * @param {string} [suffix] - 截断后添加的后缀
 * @returns {string} 截断后的字符串
 * @example
 * // 示例：按长度截断字符串
 * truncate('Hello world, this is a test', 10); // => 'Hello...'
 */
export const truncate = (str: string, max: number, suffix = '...'): string => (str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`)
/**
 * 取消转义字符串
 * @param {string} str - 转义后的字符串
 * @returns {string} 取消转义后的字符串
 * @example
 * // 示例：取消转义字符串
 * unescapeString('&lt;div&gt;Hello&lt;/div&gt;'); // => '<div>Hello</div>'
 */
export const unescapeString = (str: string): string => str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, '\'').replace(/&quot;/g, '"')
/**
 * 单词首字母大写
 * @param {string} str - 原始字符串
 * @returns {string} 每个单词首字母大写的字符串
 * @example
 * // 示例：单词首字母大写
 * uppercaseWords('hello world'); // => 'Hello World'
 */
export const uppercaseWords = (str: string): string => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase())
/**
 * 随机字符串
 * @returns {string} 随机生成的字符串
 * @example
 * // 示例：生成随机字符串
 * randomString(); // => 'abc123'（结果随机）
 */
export const randomString = (): string => Math.random().toString(36).slice(2)
/**
 * 去除字符串中的HTML
 * @param {string} html - 包含HTML的字符串
 * @returns {string} 去除HTML后的纯文本
 * @example
 * // 示例：去除字符串中的HTML
 * stripHtml('<div>Hello</div>'); // => 'Hello'
 */
export const stripHtml = (html: string): string => (new DOMParser().parseFromString(html, 'text/html')).body.textContent || ''
/**
 * 是否包含小写字符
 * @param {string} str - 原始字符串
 * @returns {boolean} 是否包含小写字符
 * @example
 * // 示例：检查是否包含小写字符
 * containsLowerCase('HELLO'); // => false
 * containsLowerCase('Hello'); // => true
 */
export const containsLowerCase = (str: string): boolean => str !== str.toUpperCase()
/**
 * 是否包含大写字符
 * @param {string} str - 原始字符串
 * @returns {boolean} 是否包含大写字符
 * @example
 * // 示例：检查是否包含大写字符
 * containsUpperCase('hello'); // => false
 * containsUpperCase('Hello'); // => true
 */
export const containsUpperCase = (str: string): boolean => str !== str.toLowerCase()
/**
 * 是否包含空格
 * @param {any} str - 原始字符串
 * @returns {Function} 返回一个函数，用于检查字符串是否包含空格
 * @example
 * // 示例：检查是否包含空格
 * const checkWhitespace = containsWhitespace();
 * checkWhitespace('hello world'); // => true
 * checkWhitespace('helloworld'); // => false
 */
// eslint-disable-next-line unused-imports/no-unused-vars
export const containsWhitespace = (str: any) => (str: string) => /\s/.test(str)
