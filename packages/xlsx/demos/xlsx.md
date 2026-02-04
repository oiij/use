# XLSX Utils

## 功能描述

**XLSX Utils** 是一个用于 Excel 和 CSV 文件处理的 Vue 组合式函数，提供了数据转换、文件导出等功能，支持多种文件格式和自定义数据转换规则。

## 安装

```bash
# 使用 npm
npm install @oiij/xlsx

# 使用 yarn
yarn add @oiij/xlsx

# 使用 pnpm
pnpm add @oiij/xlsx
```

## 基本使用

<demo vue="./xlsx.vue" />

## API

### 函数签名

```ts
declare function transform<T extends Data>(data: T[], head: Head<T>[]): unknown[][]
declare function json2XLS(data: unknown[]): Blob
declare function json2XLSX(data: unknown[]): Blob
declare function json2CSV(data: unknown[]): Blob
declare function exportSheet(data: unknown[], fileName: string, type?: 'xls' | 'xlsx' | 'csv'): void
declare function json2Sheet<T extends Data>(data: T[], head: Head<T>[], fileName: string, type?: 'xls' | 'xlsx' | 'csv'): void
```

## 类型定义

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
```
