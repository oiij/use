# UseImageVerify

## 功能描述

**UseImageVerify** 是一个用于生成和验证图片验证码的 Vue 组合式函数，支持字符型和算术运算型两种验证码类型。它提供了完整的验证码生成、验证、刷新和重置功能，可用于表单验证、用户登录等场景，防止自动化攻击。

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

<demo vue="./use-image-verify.vue" title="UseImageVerify" />

## API

### `useImageVerify(templateRef, options?)`

创建图片验证码。

#### 参数

| 参数          | 类型                             | 说明                  |
| ------------- | -------------------------------- | --------------------- |
| `templateRef` | `TemplateRef<HTMLCanvasElement>` | Canvas 元素的模板引用 |
| `options`     | `ImageVerifyOptions`             | 验证码配置选项        |

#### ImageVerifyOptions

| 选项               | 类型                         | 默认值        | 说明                     |
| ------------------ | ---------------------------- | ------------- | ------------------------ |
| `width`            | `number`                     | `120`         | 画布宽度（像素）         |
| `height`           | `number`                     | `40`          | 画布高度（像素）         |
| `refreshOnClick`   | `boolean`                    | `true`        | 点击画布时是否刷新验证码 |
| `disturbLine`      | `number`                     | `10`          | 干扰线数量               |
| `disturbPoint`     | `number`                     | `40`          | 干扰点数量               |
| `type`             | `'operation' \| 'character'` | `'character'` | 验证码类型               |
| `operationOptions` | `OperationConfig`            | -             | 算术运算验证码配置       |
| `characterOptions` | `CharacterConfig`            | -             | 字符验证码配置           |

#### 返回值

| 属性          | 类型                             | 说明            |
| ------------- | -------------------------------- | --------------- |
| `templateRef` | `TemplateRef<HTMLCanvasElement>` | Canvas 元素引用 |
| `value`       | `Ref<string>`                    | 用户输入的值    |
| `code`        | `Readonly<Ref<string>>`          | 验证码答案      |
| `passed`      | `ComputedRef<boolean>`           | 是否验证通过    |
| `validate()`  | `Function`                       | 验证用户输入    |
| `reset()`     | `Function`                       | 重置用户输入    |
| `refresh()`   | `Function`                       | 刷新验证码      |

## 类型定义

```ts
type OperationConfig = {
  /**
   * 运算数字范围（0 到 figure-1）
   * @default 10
   */
  figure?: number
  /**
   * 运算符类型，不指定则随机选择
   */
  arith?: '+' | '-' | '*'
}

type CharacterConfig = {
  /**
   * 验证码长度
   * @default 4
   */
  length?: number
  /**
   * 字符池
   * @default '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
   */
  characterPool?: string
}

export type ImageVerifyOptions = {
  width?: number
  height?: number
  refreshOnClick?: boolean
  disturbLine?: number
  disturbPoint?: number
  type: 'operation' | 'character'
  operationOptions?: OperationConfig
  characterOptions?: CharacterConfig
}

export type UseImageVerifyReturns = {
  templateRef: TemplateRef<HTMLCanvasElement>
  value: Ref<string>
  code: Readonly<Ref<string>>
  passed: ComputedRef<boolean>
  validate: () => Promise<true>
  reset: () => void
  refresh: () => void
}

export declare function useImageVerify(templateRef: TemplateRef<HTMLCanvasElement>, options?: ImageVerifyOptions): UseImageVerifyReturns
```

## 使用示例

### 基础用法（字符验证码）

```vue
<script setup>
import { useImageVerify } from '@oiij/use'
import { ref } from 'vue'

const canvasRef = ref()
const { value, passed, validate, refresh } = useImageVerify(canvasRef, {
  type: 'character',
  width: 120,
  height: 40,
  characterOptions: { length: 4 }
})

async function handleVerify() {
  try {
    await validate()
    console.log('验证通过')
  }
  catch {
    console.log('验证失败')
    refresh()
  }
}
</script>

<template>
  <canvas ref="canvasRef" />
  <input v-model="value" placeholder="输入验证码">
  <button @click="handleVerify">
    验证
  </button>
</template>
```

### 算术运算验证码

```vue
<script setup>
import { useImageVerify } from '@oiij/use'
import { ref } from 'vue'

const canvasRef = ref()
const { value, passed, validate, refresh } = useImageVerify(canvasRef, {
  type: 'operation',
  operationOptions: {
    figure: 10,
    arith: '+'
  }
})
</script>

<template>
  <canvas ref="canvasRef" />
  <input v-model="value" placeholder="输入答案">
  <button @click="validate">
    验证
  </button>
</template>
```

### 自定义字符池

```ts
import { useImageVerify } from '@oiij/use'

const { value, validate } = useImageVerify(canvasRef, {
  type: 'character',
  characterOptions: {
    length: 6,
    characterPool: '0123456789' // 只使用数字
  }
})
```

### 点击刷新

```vue
<script setup>
import { useImageVerify } from '@oiij/use'
import { ref } from 'vue'

const canvasRef = ref()
const { value, validate, refresh } = useImageVerify(canvasRef, {
  type: 'character',
  refreshOnClick: true // 点击画布自动刷新
})
</script>

<template>
  <canvas ref="canvasRef" style="cursor: pointer;" />
  <input v-model="value">
  <button @click="validate">
    验证
  </button>
  <button @click="refresh">
    刷新
  </button>
</template>
```
