# UseScanCode

## 功能描述

**UseScanCode** 是一个用于扫描二维码和条形码的 Vue 组合式函数，支持通过摄像头实时扫描识别码值，并提供扫描状态管理和事件回调。适用于需要快速输入、身份验证、商品识别等场景。

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

<demo vue="./use-scan-code.vue" title="UseScanCode" />

## API

### 函数签名

```ts
declare function useScanCode(): UseScanCodeReturns
```

## 类型定义

```ts
export type UseScanCodeReturns = {
  value: Readonly<Ref<string>>
  pending: Readonly<Ref<boolean>>
  onScan: EventHookOn<string>
}

export function useScanCode(): UseScanCodeReturns
```
