import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx'

/**
 * 表格列配置
 */
export type SheetColumns<T extends Record<string, any>> = {
  /**
   * 数据键
   */
  key: keyof T
  /**
   * 列标题
   */
  title: string
  /**
   * 数据转换函数
   */
  transform?: SheetTransform<T>
}

/**
 * 表格数据转换参数
 */
export type SheetTransformParam<T extends Record<string, any>> = {
  /**
   * 原始值
   */
  rawValue: T[SheetColumns<T>['key']]
  /**
   * 原始行数据
   */
  rawRow: T
  /**
   * 原始行索引
   */
  rawRowIndex: number
  /**
   * 列配置
   */
  columns: SheetColumns<T>
  /**
   * 列索引
   */
  headIndex: number
}

/**
 * 表格数据转换函数
 */
type SheetTransform<T extends Record<string, any>> = (params: SheetTransformParam<T>) => T[SheetColumns<T>['key']]

/**
 * 转换数据为表格格式
 *
 * @param data - 数据数组
 * @param columns - 列配置数组
 * @returns 转换后的表格数据
 *
 * @example
 * ```ts
 * import { transform } from '@oiij/xlsx'
 *
 * const data = [
 *   { name: '张三', age: 18, gender: '男' },
 *   { name: '李四', age: 20, gender: '女' }
 * ]
 *
 * const columns = [
 *   { key: 'name', title: '姓名' },
 *   { key: 'age', title: '年龄' },
 *   {
 *     key: 'gender',
 *     title: '性别',
 *     transform: ({ rawValue }) => rawValue === '男' ? '男性' : '女性'
 *   }
 * ]
 *
 * const result = transform(data, columns)
 * // 结果: [['姓名', '年龄', '性别'], ['张三', 18, '男性'], ['李四', 20, '女性']]
 * ```
 */
export function transform<T extends Record<string, any>>(data: T[], columns: SheetColumns<T>[]) {
  const result: any[][] = []
  result.push(columns.map(m => m.title))
  data.forEach((d, i) => {
    const item: any[] = []
    columns.forEach((h, hi) => {
      const value = d[h.key]
      if (typeof h.transform === 'function') {
        const result = h.transform({
          rawValue: value,
          rawRow: d,
          rawRowIndex: i,
          columns: h,
          headIndex: hi,
        })
        return item.push(result)
      }

      return item.push(value)
    })
    result.push(item)
  })
  return result
}

/**
 * 将 JSON 数据转换为 XLS 文件
 *
 * @param data - JSON 数据数组
 * @returns XLS 文件 Blob
 *
 * @example
 * ```ts
 * import { json2XLS } from '@oiij/xlsx'
 *
 * const data = [
 *   { name: '张三', age: 18 },
 *   { name: '李四', age: 20 }
 * ]
 *
 * const blob = json2XLS(data)
 * // 使用 blob 创建下载链接
 * const url = URL.createObjectURL(blob)
 * const a = document.createElement('a')
 * a.href = url
 * a.download = 'data.xls'
 * a.click()
 * ```
 */
export function json2XLS(data: any[]) {
  const type = 'application/vnd.ms-excel'
  const ws = utils.json_to_sheet(data, {
    skipHeader: true,
  })
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Sheet1')
  const buffer = write(wb, { bookType: 'xls', type: 'array' })
  return new Blob([buffer], { type })
}

/**
 * 将 JSON 数据转换为 XLSX 文件
 *
 * @param data - JSON 数据数组
 * @returns XLSX 文件 Blob
 *
 * @example
 * ```ts
 * import { json2XLSX } from '@oiij/xlsx'
 *
 * const data = [
 *   { name: '张三', age: 18 },
 *   { name: '李四', age: 20 }
 * ]
 *
 * const blob = json2XLSX(data)
 * // 使用 blob 创建下载链接
 * const url = URL.createObjectURL(blob)
 * const a = document.createElement('a')
 * a.href = url
 * a.download = 'data.xlsx'
 * a.click()
 * ```
 */
export function json2XLSX(data: any[]) {
  const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const ws = utils.json_to_sheet(data, {
    skipHeader: true,
  })
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Sheet1')
  const buffer = write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([buffer], { type })
}

/**
 * 将 JSON 数据转换为 CSV 文件
 *
 * @param data - JSON 数据数组
 * @returns CSV 文件 Blob
 *
 * @example
 * ```ts
 * import { json2CSV } from '@oiij/xlsx'
 *
 * const data = [
 *   { name: '张三', age: 18 },
 *   { name: '李四', age: 20 }
 * ]
 *
 * const blob = json2CSV(data)
 * // 使用 blob 创建下载链接
 * const url = URL.createObjectURL(blob)
 * const a = document.createElement('a')
 * a.href = url
 * a.download = 'data.csv'
 * a.click()
 * ```
 */
export function json2CSV(data: any[]) {
  const type = 'text/plain;charset=UTF-8'
  const ws = utils.json_to_sheet(data, {
    skipHeader: true,
  })
  const buffer = utils.sheet_to_csv(ws)
  return new Blob([buffer], { type })
}

/**
 * 导出表格文件
 *
 * @param data - 表格数据
 * @param fileName - 文件名
 * @param type - 文件类型
 *
 * @example
 * ```ts
 * import { exportSheet } from '@oiij/xlsx'
 *
 * const data = [
 *   ['姓名', '年龄'],
 *   ['张三', 18],
 *   ['李四', 20]
 * ]
 *
 * exportSheet(data, '人员信息', 'xlsx')
 * ```
 */
export function exportSheet(data: any[], fileName: string, type: 'xls' | 'xlsx' | 'csv' = 'xls') {
  switch (type) {
    case 'xls':
      return saveAs(json2XLS(data), `${fileName}.${type}`)
    case 'xlsx':
      return saveAs(json2XLSX(data), `${fileName}.${type}`)
    case 'csv':
      return saveAs(json2CSV(data), `${fileName}.${type}`)

    default:
      break
  }
}

/**
 * 将 JSON 数据导出为表格文件
 *
 * @param data - JSON 数据数组
 * @param columns - 列配置数组
 * @param fileName - 文件名
 * @param type - 文件类型
 *
 * @example
 * ```ts
 * import { json2Sheet } from '@oiij/xlsx'
 *
 * const data = [
 *   { name: '张三', age: 18, gender: '男' },
 *   { name: '李四', age: 20, gender: '女' }
 * ]
 *
 * const columns = [
 *   { key: 'name', title: '姓名' },
 *   { key: 'age', title: '年龄' },
 *   { key: 'gender', title: '性别' }
 * ]
 *
 * json2Sheet(data, columns, '人员信息', 'xlsx')
 * ```
 */
export function json2Sheet<T extends Record<string, any>>(data: T[], columns: SheetColumns<T>[], fileName: string, type: 'xls' | 'xlsx' | 'csv' = 'xls') {
  return exportSheet(transform(data, columns), fileName, type)
}
