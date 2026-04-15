import type { CellValue, CsvWriteOptions, WriteOptions, WriteSheet } from 'hucre'
import { saveAs } from 'file-saver'
import { writeCsv } from 'hucre/csv'
import { writeXlsx } from 'hucre/xlsx'
import { getNestedValue, TYPE_MAP } from './_utils'

/**
 * 创建工作表配置
 *
 * @param name - 工作表名称
 * @param columns - 列配置数组，类型为 SheetColumns<T>
 * @param data - 数据数组
 * @param options - 其他选项（可选）
 * @returns 工作表配置对象
 *
 * @example
 * ```ts
 * import { createSheet } from '@oiij/hucre'
 *
 * const columns = [
 *   { key: 'name', header: '姓名' },
 *   { key: 'age', header: '年龄' }
 * ]
 *
 * const data = [
 *   { name: '张三', age: 18 },
 *   { name: '李四', age: 20 }
 * ]
 *
 * const sheet = createSheet('员工信息', columns, data)
 * ```
 */
export function createSheet<T extends Record<string, any>>(name: string, columns: SheetColumns<T>, data: T[], options?: WriteSheet) {
  const rows = transformData(columns, data).rows
  return {
    name,
    rows,
    ...options,
  } as WriteSheet
}

/**
 * 创建 XLSX 工作簿
 *
 * @param sheets - 工作表配置数组
 * @param options - 写入选项（可选）
 * @returns XLSX 格式的二进制数据
 *
 * @example
 * ```ts
 * import { createSheet, createXlsx, exportWorkbook } from '@oiij/hucre'
 *
 * const columns = [
 *   { key: 'name', header: '姓名' },
 *   { key: 'age', header: '年龄' }
 * ]
 *
 * const data = [
 *   { name: '张三', age: 18 },
 *   { name: '李四', age: 20 }
 * ]
 *
 * const sheet = createSheet('员工信息', columns, data)
 * const workbook = createXlsx([sheet])
 * exportWorkbook(workbook, '员工信息', 'xlsx')
 * ```
 */
export function createXlsx(sheets: WriteSheet[], options?: WriteOptions) {
  return writeXlsx({ sheets, ...options })
}

/**
 * 创建 CSV 文件
 *
 * @param columns - 列配置数组，类型为 SheetColumns<T>
 * @param data - 数据数组
 * @param options - CSV 写入选项（可选）
 * @returns CSV 格式的二进制数据
 *
 * @example
 * ```ts
 * import { createCsv, exportWorkbook } from '@oiij/hucre'
 *
 * const columns = [
 *   { key: 'name', header: '姓名' },
 *   { key: 'age', header: '年龄' }
 * ]
 *
 * const data = [
 *   { name: '张三', age: 18 },
 *   { name: '李四', age: 20 }
 * ]
 *
 * const csv = createCsv(columns, data, { sheet: 'Sheet1' })
 * exportWorkbook(csv, '数据', 'csv')
 * ```
 */
export function createCsv<T extends Record<string, any>>(columns: SheetColumns<T>, data: T[], options?: CsvWriteOptions) {
  return writeCsv(transformData(columns, data).rows, options)
}

/**
 * 表格列配置类型定义
 *
 * 用于定义表格的列结构，包括数据键、列标题、自定义值获取和数据转换函数。
 * 每个列配置对象定义表格中的一列。
 */
export type SheetColumns<T extends Record<string, any>> = {
  /**
   * 数据键
   */
  key: keyof T
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
 * 转换数据为表格格式
 *
 * @param columns - 列配置数组，类型为 SheetColumns<T>
 * @param data - 数据数组
 * @returns 包含表格数据的对象，包含以下属性：
 *   - header: 列标题数组
 *   - cells: 数据单元格二维数组（不包含标题行）
 *   - rows: 完整的表格数据（包含标题行）
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
 * // result.header: ['姓名', '年龄', '性别']
 * // result.cells: [['张三', 18, '男性'], ['李四', 20, '女性']]
 * // result.rows: [['姓名', '年龄', '性别'], ['张三', 18, '男性'], ['李四', 20, '女性']]
 * ```
 */
export function transformData<T extends Record<string, any>>(columns: SheetColumns<T>, data: T[]) {
  const result: any[][] = []
  const header = columns.map(m => m.header)

  data.forEach((d, i) => {
    const item: any[] = []
    columns.forEach((column) => {
      let value = d[column.key] as CellValue

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
  return {
    header,
    cells: result as CellValue[][],
    rows: [header, ...result] as CellValue[][],
  }
}

/**
 * 导出工作簿到文件
 *
 * @param workbook - 工作簿二进制数据或字符串
 * @param fileName - 文件名（不含扩展名）
 * @param type - 文件类型，支持 'xlsx' 或 'csv'
 * @returns void
 *
 * @example
 * ```ts
 * import { createSheet, createXlsx, exportWorkbook } from '@oiij/hucre'
 *
 * const columns = [
 *   { key: 'name', header: '姓名' },
 *   { key: 'age', header: '年龄' }
 * ]
 *
 * const data = [
 *   { name: '张三', age: 18 },
 *   { name: '李四', age: 20 }
 * ]
 *
 * const sheet = createSheet('员工信息', columns, data)
 * const workbook = createXlsx([sheet])
 * exportWorkbook(workbook, '员工信息', 'xlsx')
 * ```
 */

export function exportWorkbook(workbook: Uint8Array | string, fileName: string, type: keyof typeof TYPE_MAP) {
  const fileType = TYPE_MAP[type] ?? TYPE_MAP.xlsx
  const blob = new Blob([workbook as Uint8Array<ArrayBuffer>], { type: fileType })
  saveAs(blob, fileName)
}
