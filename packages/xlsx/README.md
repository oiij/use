# @oiij/xlsx

[![NPM version](https://img.shields.io/npm/v/@oiij/xlsx)](https://www.npmjs.com/package/@oiij/xlsx)
[![MIT-license](https://img.shields.io/npm/l/@oiij/xlsx)](https://github.com/oiij/use/blob/main/packages/xlsx/LICENSE)

## 简介

Use XLSX 是基于 SheetJS 的工具库，提供 Excel/CSV 文件的导入、导出和数据转换功能，帮助开发者在浏览器端处理电子表格文件。

## 特点

### 📊 多格式支持

- 📋 支持导出 XLS、XLSX、CSV 格式
- 🔄 支持 JSON 数据转换
- ⚙️ 支持自定义列配置

### 🔄 数据转换

- 🔧 支持数据格式化和转换
- 🛠️ 支持自定义转换函数
- 🎯 支持类型安全的泛型

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示

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

## 示例

### 基础使用

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

#### 参数

| 参数       | 类型                       | 默认值  | 说明          |
| ---------- | -------------------------- | ------- | ------------- |
| `data`     | `T[]`                      | -       | JSON 数据数组 |
| `columns`  | `SheetColumns<T>[]`        | -       | 列配置数组    |
| `fileName` | `string`                   | -       | 文件名        |
| `type`     | `'xls' \| 'xlsx' \| 'csv'` | `'xls'` | 文件类型      |

### `json2XLS(data)`

将 JSON 数据转换为 XLS 文件 Blob。

### `json2XLSX(data)`

将 JSON 数据转换为 XLSX 文件 Blob。

### `json2CSV(data)`

将 JSON 数据转换为 CSV 文件 Blob。

## SheetColumns 配置

| 选项        | 类型                | 说明         |
| ----------- | ------------------- | ------------ |
| `key`       | `keyof T`           | 数据键       |
| `title`     | `string`            | 列标题       |
| `transform` | `(params) => value` | 数据转换函数 |

### Transform 参数

| 参数          | 类型              | 说明       |
| ------------- | ----------------- | ---------- |
| `rawValue`    | `T[key]`          | 原始值     |
| `rawRow`      | `T`               | 原始行数据 |
| `rawRowIndex` | `number`          | 原始行索引 |
| `columns`     | `SheetColumns<T>` | 列配置     |
| `headIndex`   | `number`          | 列索引     |

## 类型定义

```ts
export type SheetColumns<T extends Record<string, any>> = {
  key: keyof T
  title: string
  transform?: SheetTransform<T>
}

export type SheetTransformParam<T extends Record<string, any>> = {
  rawValue: T[SheetColumns<T>['key']]
  rawRow: T
  rawRowIndex: number
  columns: SheetColumns<T>
  headIndex: number
}

export declare function transform<T extends Record<string, any>>(data: T[], columns: SheetColumns<T>[]): any[][]
export declare function exportSheet(data: any[], fileName: string, type?: 'xls' | 'xlsx' | 'csv'): void
export declare function json2Sheet<T extends Record<string, any>>(data: T[], columns: SheetColumns<T>[], fileName: string, type?: 'xls' | 'xlsx' | 'csv'): void
export declare function json2XLS(data: any[]): Blob
export declare function json2XLSX(data: any[]): Blob
export declare function json2CSV(data: any[]): Blob
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/xlsx/xlsx)
