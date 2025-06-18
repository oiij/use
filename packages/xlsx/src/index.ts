import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx'

type Data = Record<string, unknown>
interface Head<T extends Data> { key: keyof T, title: string, transform?: Transform<T> }
interface TransformParam<T extends Data> {
  rawValue: T[Head<T>['key']]
  rawRow: T
  rawRowIndex: number
  head: Head<T>
  headIndex: number
}
type Transform<T extends Data> = (params: TransformParam<T>) => T[Head<T>['key']]
export function transform<T extends Data>(data: T[], head: Head<T>[]) {
  const result: unknown[][] = []
  result.push(head.map(m => m.title))
  data.forEach((d, i) => {
    const item: unknown[] = []
    head.forEach((h, hi) => {
      const value = d[h.key]
      if (typeof h.transform === 'function') {
        const result = h.transform({
          rawValue: value,
          rawRow: d,
          rawRowIndex: i,
          head: h,
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
export function json2XLS(data: unknown[]) {
  const type = 'application/vnd.ms-excel'
  const ws = utils.json_to_sheet(data, {
    skipHeader: true,
  })
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Sheet1')
  const buffer = write(wb, { bookType: 'xls', type: 'array' })
  return new Blob([buffer], { type })
}
export function json2XLSX(data: unknown[]) {
  const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const ws = utils.json_to_sheet(data, {
    skipHeader: true,
  })
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Sheet1')
  const buffer = write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([buffer], { type })
}
export function json2CSV(data: unknown[]) {
  const type = 'text/plain;charset=UTF-8'
  const ws = utils.json_to_sheet(data, {
    skipHeader: true,
  })
  const buffer = utils.sheet_to_csv(ws)
  return new Blob([buffer], { type })
}
export function exportSheet(data: unknown[], fileName: string, type: 'xls' | 'xlsx' | 'csv' = 'xls') {
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
export function json2Sheet<T extends Data>(data: T[], head: Head<T>[], fileName: string, type: 'xls' | 'xlsx' | 'csv' = 'xls') {
  return exportSheet(transform(data, head), fileName, type)
}
