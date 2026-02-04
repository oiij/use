# UseImageVerify

## 功能描述

**UseImageVerify** 是一个用于生成和验证图片验证码的 Vue 组合式函数，支持字符型和算术运算型两种验证码类型。它提供了完整的验证码生成、验证、刷新和重置功能，可用于表单验证、用户登录等场景，防止自动化攻击。

## 安装

```bash
# 使用 npm
npm install @use/core

# 使用 yarn
yarn add @use/core

# 使用 pnpm
pnpm add @use/core
```

## 基本使用

<demo vue="./use-image-verify.vue" title="UseImageVerify" />

## API

### 函数签名

```ts
declare function useImageVerify(
  templateRef: TemplateRef<HTMLCanvasElement>,
  options?: ImageVerifyOptions
): UseImageVerifyReturns
```

## 类型定义

```ts
type OperationConfig = {
  figure?: number
  arith?: '+' | '-' | '*'
}

type CharacterConfig = {
  length?: number
  characterPool?: string
}

type ImageVerifyOptionsBase = {
  width?: number
  height?: number
  refreshOnClick?: boolean
  disturbLine?: number
  disturbPoint?: number
}

export type ImageVerifyOptions = (ImageVerifyOptionsBase & {
  type: 'operation'
  config?: OperationConfig
}) | (ImageVerifyOptionsBase & {
  type: 'character'
  config?: CharacterConfig
})

export type UseImageVerifyReturns = {
  templateRef: TemplateRef<HTMLCanvasElement>
  value: Ref<string>
  code: Readonly<Ref<string>>
  passed: ComputedRef<boolean>
  validate: () => Promise<true>
  reset: () => void
  refresh: () => string
}

export function useImageVerify(
  templateRef: TemplateRef<HTMLCanvasElement>,
  options?: ImageVerifyOptions
): UseImageVerifyReturns
```
