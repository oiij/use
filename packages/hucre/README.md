# @oiij/hucre

[![NPM version](https://img.shields.io/npm/v/@oiij/hucre)](https://www.npmjs.com/package/@oiij/hucre)
[![MIT-license](https://img.shields.io/npm/l/@oiij/hucre)](https://github.com/oiij/use/blob/main/packages/hucre/LICENSE)

## 简介

**Hucre** 是基于 `hucre` 的工具库，提供 Excel/CSV 文件的导入、导出和数据转换功能，帮助开发者在浏览器端处理电子表格文件。

## 特点

### 📊 多格式支持

- 📋 支持导出 XLSX、CSV 格式
- 🔄 支持 JSON 数据转换
- ⚙️ 支持自定义列配置

### 🔄 数据转换

- 🔧 支持数据格式化和转换
- 🛠️ 支持自定义转换函数
- 🎯 支持嵌套属性获取
- 🎨 支持单元格样式配置

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/hucre

# 使用 npm
npm install @oiij/hucre

# 使用 yarn
yarn add @oiij/hucre
```

## 依赖

- `hucre`: ^0.3.0
- `file-saver`: ^2.0.0

## 示例

### 基础使用

```ts
import { createSheet, createXlsx, exportWorkbook } from '@oiij/hucre'

const data = [
  { name: '张三', age: 18 },
  { name: '李四', age: 20 }
]

const sheet = createSheet('员工信息', [
  { key: 'name', header: '姓名' },
  { key: 'age', header: '年龄' }
], data)

const workbook = createXlsx([sheet])
exportWorkbook(workbook, '员工信息', 'xlsx')
```

### 使用列配置

```ts
import { transformData } from '@oiij/hucre'

const data = [
  { name: '张三', age: 18, gender: '男' },
  { name: '李四', age: 20, gender: '女' }
]

const columns = [
  { key: 'name', header: '姓名' },
  { key: 'age', header: '年龄' },
  { key: 'gender', header: '性别' }
]

const result = transformData(columns, data)
// result.header: ['姓名', '年龄', '性别']
// result.cells: [['张三', 18, '男'], ['李四', 20, '女']]
// result.rows: [['姓名', '年龄', '性别'], ['张三', 18, '男'], ['李四', 20, '女']]
```

### 数据转换

```ts
import { transformData } from '@oiij/hucre'

const data = [
  { name: '张三', age: 18, gender: '男' },
  { name: '李四', age: 20, gender: '女' }
]

const columns = [
  { key: 'name', header: '姓名' },
  { key: 'age', header: '年龄' },
  {
    key: 'gender',
    header: '性别',
    transform: value => value === '男' ? '男性' : '女性'
  }
]

const result = transformData(columns, data)
// result.rows: [['姓名', '年龄', '性别'], ['张三', 18, '男性'], ['李四', 20, '女性']]
```

### 使用 value 自定义值

```ts
import { createCsv, exportWorkbook, transformData } from '@oiij/hucre'

const data = [
  { name: '张三', sex: '男' },
  { name: '李四', sex: '女' }
]

// 使用函数自定义值
const columns = [
  { key: 'name', header: '姓名' },
  { value: item => `[${item.sex}]`, header: '性别' }
]

const result = transformData(columns, data)

// 使用路径获取嵌套值
const nestedColumns = [
  { key: 'name', header: '姓名' },
  { value: 'profile.gender', header: '性别' }
]
```

### 导出不同格式

```ts
import { createCsv, createSheet, createXlsx, exportWorkbook } from '@oiij/hucre'

const data = [
  { name: '张三', age: 18 },
  { name: '李四', age: 20 }
]

const sheet = createSheet('数据', [
  { key: 'name', header: '姓名' },
  { key: 'age', header: '年龄' }
], data)

// 导出 XLSX
const xlsx = createXlsx([sheet])
exportWorkbook(xlsx, '数据', 'xlsx')

// 导出 CSV
const csv = createCsv([
  { key: 'name', header: '姓名' },
  { key: 'age', header: '年龄' }
], data)
exportWorkbook(csv, '数据', 'csv')
```

## API

### `transformData(columns, data)`

将 JSON 数据转换为表格格式。

#### 参数

| 参数      | 类型              | 说明          |
| --------- | ----------------- | ------------- |
| `columns` | `SheetColumns<T>` | 列配置数组    |
| `data`    | `T[]`             | JSON 数据数组 |

#### 返回值

| 类型     | 说明                                |
| -------- | ----------------------------------- |
| `object` | 包含 header, cells, rows 属性的对象 |

返回对象属性：

- `header`: 列标题数组
- `cells`: 数据单元格二维数组（不包含标题行）
- `rows`: 完整的表格数据（包含标题行）

### `createSheet(name, columns, data, options?)`

创建工作表配置。

#### 参数

| 参数      | 类型              | 说明       |
| --------- | ----------------- | ---------- |
| `name`    | `string`          | 工作表名称 |
| `columns` | `SheetColumns<T>` | 列配置数组 |
| `data`    | `T[]`             | 数据数组   |
| `options` | `WriteSheet`      | 其他选项   |

#### 返回值

| 类型         | 说明       |
| ------------ | ---------- |
| `WriteSheet` | 工作表配置 |

### `createXlsx(sheets, options?)`

创建 XLSX 工作簿。

#### 参数

| 参数      | 类型           | 说明           |
| --------- | -------------- | -------------- |
| `sheets`  | `WriteSheet[]` | 工作表配置数组 |
| `options` | `WriteOptions` | 写入选项       |

#### 返回值

| 类型         | 说明                  |
| ------------ | --------------------- |
| `Uint8Array` | XLSX 格式的二进制数据 |

### `createCsv(columns, data, options?)`

创建 CSV 文件。

#### 参数

| 参数      | 类型              | 说明         |
| --------- | ----------------- | ------------ |
| `columns` | `SheetColumns<T>` | 列配置数组   |
| `data`    | `T[]`             | 数据数组     |
| `options` | `CsvWriteOptions` | CSV 写入选项 |

#### 返回值

| 类型         | 说明                 |
| ------------ | -------------------- |
| `Uint8Array` | CSV 格式的二进制数据 |

### `exportWorkbook(workbook, fileName, type)`

保存工作簿到文件。

#### 参数

| 参数       | 类型                   | 说明             |
| ---------- | ---------------------- | ---------------- |
| `workbook` | `Uint8Array \| string` | 工作簿二进制数据 |
| `fileName` | `string`               | 文件名           |
| `type`     | `'xlsx' \| 'csv'`      | 文件类型         |

## SheetColumns 配置

| 选项        | 类型                               | 说明           |
| ----------- | ---------------------------------- | -------------- |
| `key`       | `keyof T`                          | 数据键         |
| `header`    | `string`                           | 列标题         |
| `value`     | `string \| (item, index) => value` | 自定义值或路径 |
| `transform` | `(value, item, index) => value`    | 数据转换函数   |

## 类型定义

```ts
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

export declare function transformData<T extends Record<string, any>>(columns: SheetColumns<T>, data: T[]): {
  header: string[]
  cells: CellValue[][]
  rows: CellValue[][]
}
export declare function createSheet<T extends Record<string, any>>(name: string, columns: SheetColumns<T>, data: T[], options?: WriteSheet): WriteSheet
export declare function createXlsx(sheets: WriteSheet[], options?: WriteOptions): Uint8Array
export declare function createCsv<T extends Record<string, any>>(columns: SheetColumns<T>, data: T[], options?: CsvWriteOptions): Uint8Array
export declare function exportWorkbook(workbook: Uint8Array | string, fileName: string, type: 'xlsx' | 'csv'): void
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/hucre/hucre)
