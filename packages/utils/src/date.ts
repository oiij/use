/** 检查日期是否有效 */
export const isDateValid = (val: string): boolean => !Number.isNaN(new Date(val).valueOf())
/** 时间格式化 */
export const timeFromDate = (date: Date): string => date.toTimeString().slice(0, 8)
/** 将AM PM后缀添加到小时 */
export const suffixAmPm = (h: number): string => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`
/** 计算两个日期之间的差异天数 */
export const diffDays = (date: Date, otherDate: Date): number => Math.ceil(Math.abs(date.valueOf() - otherDate.valueOf()) / (1000 * 60 * 60 * 24))
/** 计算两个日期之间的月数 */
export const diffMonth = (startDate: Date, endDate: Date): number => Math.max(0, (endDate.getFullYear() - startDate.getFullYear()) * 12 - startDate.getMonth() + endDate.getMonth())
/** 将日期转换为YYYY-MM-DD格式 */
export const formatYmd = (date: Date): string => date.toISOString().slice(0, 10)
/** 下一年 */
export const plusOneYear: Date = (d => new Date(d.setFullYear(d.getFullYear() + 1)))(new Date())
/** 从日期中提取年、月、日、小时、分钟、秒和毫秒 */
export const extract = (date: Date): string[] => date.toISOString().split(/\D/).slice(0, -1)
/** 将秒转换为hh:mm:ss格式 */
export const formatSeconds = (s: number): string => new Date(s * 1000).toISOString().substr(11, 8)
/** 获取日期的当前季度 */
export const getQuarter = (d = new Date()): number => Math.ceil((d.getMonth() + 1) / 3)
/** 以秒为单位获取当前时间戳 */
export const ts = (): number => Math.floor(new Date().getTime() / 1000)
/** 从日期中获取一年中的哪一天 */
export const dayOfYear = (date: Date): number => Math.floor((date.valueOf() - new Date(date.getFullYear(), 0, 0).valueOf()) / (1000 * 60 * 60 * 24))
/** 获取约会月份的第一个日期 */
export const getFirstDate = (d = new Date()): Date => new Date(d.getFullYear(), d.getMonth(), 1)
/** 设置给定区域设置的日期格式 */
export const format = (date: Date, locale: string): string => new Intl.DateTimeFormat(locale).format(date)
/** 获取日期的月份名称 */
export const getMonthName = (date: Date): string => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', ' November', 'December'][date.getMonth()]
/** 获取日期所在月份的最后一个日期 */
export const getLastDate = (d = new Date()): Date => new Date(d.getFullYear(), d.getMonth() + 1, 0)
/** 获取给定月份的天数 */
export const daysInMonth = (month: number, year: number): number => new Date(year, month, 0).getDate()
/** 获取时区字符串 */
export const getTimezone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone
/** 获取明天的时间 */
export const tomorrow: Date = (d => new Date(d.setDate(d.getDate() + 1)))(new Date())
/** 从十进制时间中获取小时和分钟 */
export const getHoursAndMinutes = (value: number): [number, number] => [Math.floor(value), Math.floor((value * 60) % 60)]
/** 获取一年中的总天数 */
export const numberOfDays = (year: number): number => (new Date(year, 1, 29).getDate() === 29 ? 366 : 365)
/** 获取昨天的日期 */
export const yesterday: Date = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)
/** 获取工作日 */
export const getWeekday = (date: Date): string => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
/** 日期排序 */
export const sortDescending = (arr: Date[]): Date[] => arr.sort((a, b) => a.getTime() - b.getTime())
/** 初始化当前日期，但将时间设置为午夜 */
export const midnightOfToday = (): Date => new Date(new Date().setHours(0, 0, 0, 0))
/** 是否工作日 */
export const isWeekday = (date = new Date()): boolean => date.getDay() % 6 !== 0
/** 检查给定的日期是否在给定的日期范围内 */
export const isBetween = (date: Date, min: Date, max: Date): boolean => date.getTime() >= min.getTime() && date.getTime() <= max.getTime()
/** 检查给定的日期是否是今天 */
export const isToday = (date: Date): boolean => date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
/** 检查给定的日期是否是周末 */
export const isWeekend = (date = new Date()): boolean => date.getDay() % 6 === 0
/** 检查给定的日期是否是当前年份 */
export const isCurrentYear = (date: Date): boolean => date.getUTCFullYear() === new Date().getUTCFullYear()

export default {
  dayOfYear,
  daysInMonth,
  diffDays,
  diffMonth,
  extract,
  format,
  formatSeconds,
  formatYmd,
  getFirstDate,
  getHoursAndMinutes,
  getLastDate,
  getMonthName,
  getQuarter,
  getTimezone,
  getWeekday,
  isBetween,
  isCurrentYear,
  isDateValid,
  isToday,
  isWeekday,
  isWeekend,
  midnightOfToday,
  numberOfDays,
  plusOneYear,
  sortDescending,
  suffixAmPm,
  timeFromDate,
  tomorrow,
  ts,
  yesterday,

}
