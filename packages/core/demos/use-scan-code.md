# UseScanCode

## 功能描述

**UseScanCode** 是一个用于监听扫码枪输入的 Vue 组合式函数，通过检测键盘输入速度和 Enter 键来识别扫码输入。适用于仓库管理、收银系统、库存盘点等需要快速输入条形码或二维码的场景。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/use

# 使用 npm
npm install @oiij/use

# 使用 yarn
yarn add @oiij/use
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0

## 基本使用

<demo vue="./use-scan-code.vue" title="UseScanCode" />

## API

### `useScanCode()`

监听扫码枪输入。

#### 返回值

| 属性               | 类型                     | 说明         |
| ------------------ | ------------------------ | ------------ |
| `value`            | `Readonly<Ref<string>>`  | 扫码结果     |
| `pending`          | `Readonly<Ref<boolean>>` | 是否等待扫码 |
| `onScan(callback)` | `Function`               | 扫码完成事件 |

## 类型定义

```ts
export type UseScanCodeReturns = {
  /**
   * 扫码结果
   */
  value: Readonly<Ref<string>>
  /**
   * 是否等待扫码
   */
  pending: Readonly<Ref<boolean>>
  /**
   * 扫码完成事件
   */
  onScan: (callback: (code: string) => void) => void
}

export declare function useScanCode(): UseScanCodeReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useScanCode } from '@oiij/use'

const { value, pending, onScan } = useScanCode()

onScan((code) => {
  console.log('扫码结果:', code)
})
</script>

<template>
  <p>扫码结果: {{ value }}</p>
  <p>等待扫码: {{ pending }}</p>
</template>
```

### 扫码后处理

```vue
<script setup>
import { useScanCode } from '@oiij/use'

const { value, onScan } = useScanCode()

onScan(async (code) => {
  console.log('扫码结果:', code)
  // 处理扫码结果
  await handleBarcode(code)
})

async function handleBarcode(code) {
  const res = await fetch(`/api/products/${code}`)
  const data = await res.json()
  console.log('商品信息:', data)
}
</script>

<template>
  <p>最近扫码: {{ value }}</p>
</template>
```

### 多次扫码记录

```vue
<script setup>
import { useScanCode } from '@oiij/use'
import { ref } from 'vue'

const scanHistory = ref([])
const { onScan } = useScanCode()

onScan((code) => {
  scanHistory.value.push({
    code,
    time: new Date().toLocaleTimeString()
  })
})
</script>

<template>
  <ul>
    <li v-for="(item, index) in scanHistory" :key="index">
      {{ item.time }} - {{ item.code }}
    </li>
  </ul>
</template>
```
