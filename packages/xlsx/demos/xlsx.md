# XLSX Utils

## 功能描述

**XLSX Utils** 是一个用于 Excel 和 CSV 文件处理的工具库，提供了数据转换、文件导出等功能，支持多种文件格式和自定义数据转换规则。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/xlsx

# 使用 npm
npm install @oiij/xlsx

# 使用 yarn
yarn add @oiij/xlsx
```

## 依赖

- `xlsx`: ^0.18.0
- `file-saver`: ^2.0.0

## 基本使用

<demo vue="./xlsx.vue" title="XLSX Utils" />

## API

### `transform(data, columns)`

将 JSON 数据转换为表格格式。

#### 参数

| 参数      | 类型                | 说明          |
| --------- | ------------------- | ------------- |
| `data`    | `T[]`               | JSON 数据数组 |
| `columns` | `SheetColumns<T>[]` | 列配置数组    |

#### 返回值

| 类型      | 说明             |
| --------- | ---------------- |
| `any[][]` | 转换后的表格数据 |

### `exportSheet(data, fileName, type?)`

导出表格文件。

#### 参数

| 参数       | 类型                       | 默认值  | 说明     |
| ---------- | -------------------------- | ------- | -------- |
| `data`     | `any[]`                    | -       | 表格数据 |
| `fileName` | `string`                   | -       | 文件名   |
| `type`     | `'xls' \| 'xlsx' \| 'csv'` | `'xls'` | 文件类型 |

### `json2Sheet(data, columns, fileName, type?)`

将 JSON 数据导出为表格文件。

### `json2XLS(data)`

将 JSON 数据转换为 XLS 文件 Blob。

### `json2XLSX(data)`

将 JSON 数据转换为 XLSX 文件 Blob。

### `json2CSV(data)`

将 JSON 数据转换为 CSV 文件 Blob。

## 类型定义

```ts
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

export declare function transform<T extends Record<string, any>>(data: T[], columns: SheetColumns<T>[]): any[][]
export declare function exportSheet(data: any[], fileName: string, type?: 'xls' | 'xlsx' | 'csv'): void
export declare function json2Sheet<T extends Record<string, any>>(data: T[], columns: SheetColumns<T>[], fileName: string, type?: 'xls' | 'xlsx' | 'csv'): void
export declare function json2XLS(data: any[]): Blob
export declare function json2XLSX(data: any[]): Blob
export declare function json2CSV(data: any[]): Blob
```

## 使用示例

### 基础用法

```ts
import { exportSheet } from '@oiij/xlsx'

const data = [
  ['姓名', '年龄'],
  ['张三', 18],
  ['李四', 20]
]

exportSheet(data, '人员信息', 'xlsx')
```

### 使用列配置

```ts
import { json2Sheet } from '@oiij/xlsx'

const data = [
  { name: '张三', age: 18, gender: '男' },
  { name: '李四', age: 20, gender: '女' }
]

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  { key: 'gender', title: '性别' }
]

json2Sheet(data, columns, '人员信息', 'xlsx')
```

### 数据转换

```ts
import { transform } from '@oiij/xlsx'

const data = [
  { name: '张三', age: 18, gender: '男' },
  { name: '李四', age: 20, gender: '女' }
]

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  {
    key: 'gender',
    title: '性别',
    transform: ({ rawValue }) => rawValue === '男' ? '男性' : '女性'
  }
]

const result = transform(data, columns)
// 结果: [['姓名', '年龄', '性别'], ['张三', 18, '男性'], ['李四', 20, '女性']]
```

### 导出不同格式

```ts
import { exportSheet, transform } from '@oiij/xlsx'

const data = [
  { name: '张三', age: 18 },
  { name: '李四', age: 20 }
]

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' }
]

const result = transform(data, columns)

// 导出 XLS
exportSheet(result, '数据', 'xls')

// 导出 XLSX
exportSheet(result, '数据', 'xlsx')

// 导出 CSV
exportSheet(result, '数据', 'csv')
```

### 高级转换

```ts
import { json2Sheet } from '@oiij/xlsx'

const data = [
  { name: '张三', age: 18, birthday: '2000-01-01' },
  { name: '李四', age: 20, birthday: '1998-05-15' }
]

const columns = [
  { key: 'name', title: '姓名' },
  {
    key: 'age',
    title: '年龄',
    transform: ({ rawValue }) => `${rawValue}岁`
  },
  {
    key: 'birthday',
    title: '出生日期',
    transform: ({ rawValue }) => new Date(rawValue).toLocaleDateString()
  }
]

json2Sheet(data, columns, '人员信息', 'xlsx')
```
