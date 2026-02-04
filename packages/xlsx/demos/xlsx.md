# XLSX Utils

[官方文档](https://github.com/SheetJS/sheetjs)

## 安装

```bash
pnpm add @oiij/xlsx
```

## 示例

<demo vue="./xlsx.vue" />

## Types

```ts
type Data = Record<string, unknown>
type Head<T extends Data> = {
  key: keyof T
  title: string
  transform?: Transform<T>
}
type TransformParam<T extends Data> = {
  rawValue: T[Head<T>['key']]
  rawRow: T
  rawRowIndex: number
  head: Head<T>
  headIndex: number
}
type Transform<T extends Data> = (params: TransformParam<T>) => T[Head<T>['key']]
declare function transform<T extends Data>(data: T[], head: Head<T>[]): unknown[][]
declare function json2XLS(data: unknown[]): Blob
declare function json2XLSX(data: unknown[]): Blob
declare function json2CSV(data: unknown[]): Blob
declare function exportSheet(data: unknown[], fileName: string, type?: 'xls' | 'xlsx' | 'csv'): void
declare function json2Sheet<T extends Data>(data: T[], head: Head<T>[], fileName: string, type?: 'xls' | 'xlsx' | 'csv'): void
```
