/**
 * 时间格式化
 * @param {Date} date - 要格式化的日期对象
 * @returns {string} 格式化后的时间字符串 (HH:MM:SS)
 * @example
 * // 返回当前时间的格式化字符串，如 "14:30:45"
 * timeFromDate(new Date())
 */
export const timeFromDate = (date: Date): string => date.toTimeString().slice(0, 8)

/**
 * 将AM PM后缀添加到小时
 * @param {number} h - 小时数 (0-23)
 * @returns {string} 带AM/PM后缀的时间字符串
 * @example
 * // 返回 "9am"
 * suffixAmPm(9)
 * // 返回 "2pm"
 * suffixAmPm(14)
 */
export const suffixAmPm = (h: number): string => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`

/**
 * 计算两个日期之间的差异天数
 * @param {Date} date - 第一个日期
 * @param {Date} otherDate - 第二个日期
 * @returns {number} 两个日期之间的天数差
 * @example
 * // 返回 1
 * diffDays(new Date('2024-01-01'), new Date('2024-01-02'))
 */
export const diffDays = (date: Date, otherDate: Date): number => Math.ceil(Math.abs(date.valueOf() - otherDate.valueOf()) / (1000 * 60 * 60 * 24))

/**
 * 计算两个日期之间的月数
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @returns {number} 两个日期之间的月数差
 * @example
 * // 返回 1
 * diffMonth(new Date('2024-01-01'), new Date('2024-02-01'))
 */
export const diffMonth = (startDate: Date, endDate: Date): number => Math.max(0, (endDate.getFullYear() - startDate.getFullYear()) * 12 - startDate.getMonth() + endDate.getMonth())

/**
 * 将日期转换为YYYY-MM-DD格式
 * @param {Date} date - 要格式化的日期对象
 * @returns {string} 格式化后的日期字符串
 * @example
 * // 返回 "2024-01-01"
 * formatYmd(new Date('2024-01-01'))
 */
export const formatYmd = (date: Date): string => date.toISOString().slice(0, 10)

/**
 * 下一年的日期
 */
export const plusOneYear: Date = (d => new Date(d.setFullYear(d.getFullYear() + 1)))(new Date())

/**
 * 从日期中提取年、月、日、小时、分钟、秒和毫秒
 * @param {Date} date - 要提取的日期对象
 * @returns {string[]} 包含年、月、日、小时、分钟、秒和毫秒的数组
 * @example
 * // 返回类似 ["2024", "01", "01", "12", "00", "00", "000"] 的数组
 * extract(new Date('2024-01-01T12:00:00.000Z'))
 */
export const extract = (date: Date): string[] => date.toISOString().split(/\D/).slice(0, -1)

/**
 * 将秒转换为hh:mm:ss格式
 * @param {number} s - 秒数
 * @returns {string} 格式化后的时间字符串
 * @example
 * // 返回 "01:00:00"
 * formatSeconds(3600)
 */
export const formatSeconds = (s: number): string => new Date(s * 1000).toISOString().substr(11, 8)

/**
 * 获取日期的当前季度
 * @param {Date} [d] - 日期对象，默认为当前日期
 * @returns {number} 季度数 (1-4)
 * @example
 * // 返回当前日期所在的季度
 * getQuarter()
 * // 返回指定日期所在的季度
 * getQuarter(new Date('2024-04-01')) // 返回 2
 */
export const getQuarter = (d = new Date()): number => Math.ceil((d.getMonth() + 1) / 3)

/**
 * 以秒为单位获取当前时间戳
 * @returns {number} 当前时间戳（秒）
 * @example
 * // 返回当前时间的时间戳
 * ts()
 */
export const ts = (): number => Math.floor(new Date().getTime() / 1000)

/**
 * 从日期中获取一年中的哪一天
 * @param {Date} date - 日期对象
 * @returns {number} 一年中的第几天 (1-366)
 * @example
 * // 返回 1
 * dayOfYear(new Date('2024-01-01'))
 */
export const dayOfYear = (date: Date): number => Math.floor((date.valueOf() - new Date(date.getFullYear(), 0, 0).valueOf()) / (1000 * 60 * 60 * 24))

/**
 * 获取指定月份的第一个日期
 * @param {Date} [d] - 日期对象，默认为当前日期
 * @returns {Date} 该月第一天的日期对象
 * @example
 * // 返回当前月份的第一天
 * getFirstDate()
 */
export const getFirstDate = (d = new Date()): Date => new Date(d.getFullYear(), d.getMonth(), 1)

/**
 * 设置给定区域设置的日期格式
 * @param {Date} date - 日期对象
 * @param {string} locale - 区域设置字符串，如 "zh-CN" 或 "en-US"
 * @returns {string} 格式化后的日期字符串
 * @example
 * // 返回中文格式的日期，如 "2024年1月1日"
 * format(new Date('2024-01-01'), 'zh-CN')
 */
export const format = (date: Date, locale: string): string => new Intl.DateTimeFormat(locale).format(date)

/**
 * 获取日期的月份名称
 * @param {Date} date - 日期对象
 * @returns {string} 月份的英文名称
 * @example
 * // 返回 "January"
 * getMonthName(new Date('2024-01-01'))
 */
export const getMonthName = (date: Date): string => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', ' November', 'December'][date.getMonth()]

/**
 * 获取日期所在月份的最后一个日期
 * @param {Date} [d] - 日期对象，默认为当前日期
 * @returns {Date} 该月最后一天的日期对象
 * @example
 * // 返回当前月份的最后一天
 * getLastDate()
 */
export const getLastDate = (d = new Date()): Date => new Date(d.getFullYear(), d.getMonth() + 1, 0)

/**
 * 获取给定月份的天数
 * @param {number} month - 月份 (1-12)
 * @param {number} year - 年份
 * @returns {number} 该月的天数
 * @example
 * // 返回 31
 * daysInMonth(1, 2024)
 */
export const daysInMonth = (month: number, year: number): number => new Date(year, month, 0).getDate()

/**
 * 获取时区字符串
 * @returns {string} 时区字符串，如 "Asia/Shanghai"
 * @example
 * // 返回当前系统的时区
 * getTimezone()
 */
export const getTimezone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone

/**
 * 明天的日期
 */
export const tomorrow: Date = (d => new Date(d.setDate(d.getDate() + 1)))(new Date())

/**
 * 从十进制时间中获取小时和分钟
 * @param {number} value - 十进制时间值
 * @returns {[number, number]} 小时和分钟的数组
 * @example
 * // 返回 [1, 30]
 * getHoursAndMinutes(1.5)
 */
export const getHoursAndMinutes = (value: number): [number, number] => [Math.floor(value), Math.floor((value * 60) % 60)]

/**
 * 获取一年中的总天数
 * @param {number} year - 年份
 * @returns {number} 该年的总天数 (365 或 366)
 * @example
 * // 返回 366
 * numberOfDays(2024)
 */
export const numberOfDays = (year: number): number => (new Date(year, 1, 29).getDate() === 29 ? 366 : 365)

/**
 * 昨天的日期
 */
export const yesterday: Date = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)

/**
 * 获取工作日
 * @param {Date} date - 日期对象
 * @returns {string} 星期的英文名称
 * @example
 * // 返回 "Monday"
 * getWeekday(new Date('2024-01-01'))
 */
export const getWeekday = (date: Date): string => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]

/**
 * 日期排序
 * @param {Date[]} arr - 日期对象数组
 * @returns {Date[]} 排序后的日期数组（升序）
 * @example
 * // 返回按时间升序排序的数组
 * sortDescending([new Date('2024-01-02'), new Date('2024-01-01')])
 */
export const sortDescending = (arr: Date[]): Date[] => arr.sort((a, b) => a.getTime() - b.getTime())

/**
 * 初始化当前日期，但将时间设置为午夜
 * @returns {Date} 当天午夜的日期对象
 * @example
 * // 返回当前日期的午夜时间
 * midnightOfToday()
 */
export const midnightOfToday = (): Date => new Date(new Date().setHours(0, 0, 0, 0))
