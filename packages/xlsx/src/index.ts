import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx'

export interface SheetColumns<T extends Record<string, any>> { key: keyof T, title: string, transform?: SheetTransform<T> }
export interface SheetTransformParam<T extends Record<string, any>> {
  rawValue: T[SheetColumns<T>['key']]
  rawRow: T
  rawRowIndex: number
  columns: SheetColumns<T>
  headIndex: number
}
type SheetTransform<T extends Record<string, any>> = (params: SheetTransformParam<T>) => T[SheetColumns<T>['key']]
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
export function json2CSV(data: any[]) {
  const type = 'text/plain;charset=UTF-8'
  const ws = utils.json_to_sheet(data, {
    skipHeader: true,
  })
  const buffer = utils.sheet_to_csv(ws)
  return new Blob([buffer], { type })
}
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
export function json2Sheet<T extends Record<string, any>>(data: T[], columns: SheetColumns<T>[], fileName: string, type: 'xls' | 'xlsx' | 'csv' = 'xls') {
  return exportSheet(transform(data, columns), fileName, type)
}
