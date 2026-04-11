import type { CellValue, ColumnDef, CsvWriteOptions, WriteOptions, WriteSheet } from 'hucre'
import { saveAs } from 'file-saver'
import { writeCsv, writeOds, writeXlsx } from 'hucre'

const TYPE_MAP = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  csv: 'text/csv',
} as const

/**
 * 表格列配置
 */
export type SheetColumns<T = Record<string, any>> = {
  /**
   * 数据键
   */
  key?: keyof T
  /**
   * 列标题
   */
  header: string
  /**
   * 自定义值获取函数或路径
   */
  value?: string | ((item: T, index: number) => CellValue)
  /**
   * 数据转换函数
   */
  transform?: (value: CellValue | null, item: T, index: number) => CellValue
}[]

/**
 * 获取嵌套属性的值
 *
 * @param obj - 目标对象
 * @param key - 属性路径，支持点号分隔
 * @returns 属性值，不存在则返回 null
 *
 * @example
 * ```ts
 * const obj = { user: { profile: { name: '张三' } } }
 * getNestedValue(obj, 'user.profile.name') // '张三'
 * getNestedValue(obj, 'user.profile.age') // null
 * ```
 */
function getNestedValue<T extends Record<string, any>>(obj: T, key: string): any {
  if (!key)
    return null
  return key.split('.').reduce((acc, curr) => {
    return acc && typeof acc === 'object' ? acc[curr] : null
  }, obj)
}

/**
 * 转换数据为表格格式
 *
 * @param columns - 列配置数组
 * @param data - 数据数组
 * @returns 转换后的表格数据（二维数组）
 *
 * @example
 * ```ts
 * import { transformData } from '@oiij/hucre'
 *
 * const data = [
 *   { name: '张三', age: 18, gender: '男' },
 *   { name: '李四', age: 20, gender: '女' }
 * ]
 *
 * const columns = [
 *   { key: 'name', header: '姓名' },
 *   { key: 'age', header: '年龄' },
 *   {
 *     key: 'gender',
 *     header: '性别',
 *     transform: (value) => value === '男' ? '男性' : '女性'
 *   }
 * ]
 *
 * const result = transformData(columns, data)
 * // 结果: [['姓名', '年龄', '性别'], ['张三', 18, '男性'], ['李四', 20, '女性']]
 * ```
 */
export function transformData<T extends Record<string, any>>(columns: SheetColumns<T>, data: T[]) {
  const result: any[][] = []
  result.push(columns.map(m => m.header))
  data.forEach((d, i) => {
    const item: any[] = []
    columns.forEach((column) => {
      let value = column.key ? d[column.key] : null as CellValue

      if (typeof column.value === 'function') {
        value = column.value(d, i)
      }
      if (typeof column.value === 'string' && column.value.includes('.')) {
        value = getNestedValue(d, column.value)
      }
      if (typeof column.transform === 'function') {
        value = column.transform(value, d, i)
      }

      return item.push(value)
    })
    result.push(item)
  })
  return result as CellValue[][]
}

/**
 * 创建工作表配置
 *
 * @param name - 工作表名称
 * @param columns - 列配置
 * @param data - 数据
 * @param options - 其他选项
 * @returns 工作表配置
 *
 * @example
 * ```ts
 * import { createSheet } from '@oiij/hucre'
 *
 * const sheet = createSheet('员工信息', columns, data)
 * ```
 */
export function createSheet<T = Record<string, unknown>>(name: string, columns?: ColumnDef<T>[], data?: T[], options?: WriteSheet) {
  return {
    name,
    columns,
    data,
    ...options,
  } as WriteSheet
}

/**
 * 创建 XLSX 工作簿
 *
 * @param sheets - 工作表配置数组
 * @param options - ���入选项
 * @returns XLSX 格式的二进制数据
 *
 * @example
 * ```ts
 * import { createXlsx } from '@oiij/hucre'
 *
 * const workbook = createXlsx([sheet1, sheet2])
 * ```
 */
export function createXlsx(sheets: WriteSheet[], options?: WriteOptions) {
  return writeXlsx({ sheets, ...options })
}

/**
 * 创建 ODS 工作簿
 *
 * @param sheets - 工作表配置数组
 * @param options - 写入选项
 * @returns ODS 格式的二进制数据
 *
 * @example
 * ```ts
 * import { createOds } from '@oiij/hucre'
 *
 * const workbook = createOds([sheet1, sheet2])
 * ```
 */
export function createOds(sheets: WriteSheet[], options?: WriteOptions) {
  return writeOds({ sheets, ...options })
}

/**
 * 创建 CSV 文件
 *
 * @param columns - 列配置
 * @param data - 数据数组
 * @param options - CSV 写入选项
 * @returns CSV 格式的二进制数据
 *
 * @example
 * ```ts
 * import { createCsv } from '@oiij/hucre'
 *
 * const workbook = createCsv(columns, data, { sheet: 'Sheet1' })
 * ```
 */
export function createCsv<T extends Record<string, any>>(columns: SheetColumns<T>, data: T[], options?: CsvWriteOptions) {
  return writeCsv(transformData(columns, data), options)
}

/**
 * 保存工作簿到文件
 *
 * @param workbook - 工作簿二进制数据或字符串
 * @param fileName - 文件名
 * @param type - 文件类型
 *
 * @example
 * ```ts
 * import { saveWorkbook } from '@oiij/hucre'
 *
 * const workbook = createXlsx([sheet])
 * saveWorkbook(workbook, '员工信息', 'xlsx')
 * ```
 */
export function saveWorkbook(workbook: Uint8Array | string, fileName: string, type: keyof typeof TYPE_MAP) {
  const fileType = TYPE_MAP[type] ?? TYPE_MAP.xlsx
  const blob = new Blob([workbook as Uint8Array<ArrayBuffer>], { type: fileType })
  saveAs(blob, fileName)
}
