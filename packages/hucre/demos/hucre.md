# Hucre Utils

## 功能描述

**Hucre Utils** 是一个用于 Excel、CSV、ODS 文件处理的工具库，提供了数据转换、文件导出等功能，支持多种文件格式和自定义数据转换规则。

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

## 基本使用

<demo vue="./hucre.vue" title="Hucre Utils" />

## API

### `transformData(columns, data)`

将 JSON 数据转换为表格格式。

#### 参数

| 参数      | 类型              | 说明          |
| --------- | ----------------- | ------------- |
| `columns` | `SheetColumns<T>` | 列配置数组    |
| `data`    | `T[]`             | JSON 数据数组 |

#### 返回值

| 类型            | 说明             |
| --------------- | ---------------- |
| `CellValue[][]` | 转换后的表格数据 |

### `createSheet(name, columns?, data?, options?)`

创建工作表配置。

#### 参数

| 参数      | 类型             | 说明       |
| --------- | ---------------- | ---------- |
| `name`    | `string`         | 工作表名称 |
| `columns` | `ColumnDef<T>[]` | 列配置数组 |
| `data`    | `T[]`            | 数据数组   |
| `options` | `WriteSheet`     | 其他选项   |

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

### `createOds(sheets, options?)`

创建 ODS 工作簿。

#### 参数

| 参数      | 类型           | 说明           |
| --------- | -------------- | -------------- |
| `sheets`  | `WriteSheet[]` | 工作表配置数组 |
| `options` | `WriteOptions` | 写入选项       |

#### 返回值

| 类型         | 说明                 |
| ------------ | -------------------- |
| `Uint8Array` | ODS 格式的二进制数据 |

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

### `saveWorkbook(workbook, fileName, type)`

保存工作簿到文件。

#### 参数

| 参数       | 类型                       | 说明     |
| ---------- | -------------------------- | -------- | ---------------- |
| `workbook` | `Uint8Array                | string`  | 工作簿二进制数据 |
| `fileName` | `string`                   | 文件名   |
| `type`     | `'xlsx' \| 'ods' \| 'csv'` | 文件类型 |

## 类型定义

```ts
/**
 * 表格列配置
 */
export type SheetColumns<T extends Record<string, any>> = {
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
```

## 使用示例

### 基础用法

```ts
import { createSheet, createXlsx, saveWorkbook } from '@oiij/hucre'

const data = [
  { name: '张三', age: 18 },
  { name: '李四', age: 20 }
]

const sheet = createSheet('员工信息', [
  { key: 'name', header: '姓名' },
  { key: 'age', header: '年龄' }
], data)

const workbook = createXlsx([sheet])
saveWorkbook(workbook, '员工信息', 'xlsx')
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
// 结果: [['姓名', '年龄', '性别'], ['张三', 18, '男'], ['李四', 20, '女']]
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
// 结果: [['姓名', '年龄', '性别'], ['张三', 18, '男性'], ['李四', 20, '女性']]
```

### 使用 value 自定义值

```ts
import { createCsv, saveWorkbook, transformData } from '@oiij/hucre'

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
import { createCsv, createOds, createSheet, createXlsx, saveWorkbook } from '@oiij/hucre'

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
saveWorkbook(xlsx, '数据', 'xlsx')

// 导出 ODS
const ods = createOds([sheet])
saveWorkbook(ods, '数据', 'ods')

// 导出 CSV
const csv = createCsv([
  { key: 'name', header: '姓名' },
  { key: 'age', header: '年龄' }
], data)
saveWorkbook(csv, '数据', 'csv')
```

### 高级用法

```ts
import { createSheet, createXlsx, saveWorkbook } from '@oiij/hucre'

const data = Array.from({ length: 100 }).map((_, i) => ({
  name: `员工-${i}`,
  age: 20 + i,
  createTime: new Date(),
}))

const sheet = createSheet('员工信息', [
  {
    header: '姓名',
    key: 'name',
  },
  {
    header: '年龄',
    key: 'age',
  },
  {
    header: '创建时间',
    key: 'createTime',
    value: item => item.createTime.toLocaleDateString(),
  },
], data)

const workbook = createXlsx([sheet])
saveWorkbook(workbook, '员工信息', 'xlsx')
```
