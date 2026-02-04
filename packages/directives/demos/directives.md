# UseDirectives

## 功能描述

**UseDirectives** 是一个 Vue 指令集合，提供了一系列常用的自定义指令，可用于增强 Vue 应用的交互能力。

## 安装

```bash
# 使用 npm
npm install @oiij/directives

# 使用 yarn
yarn add @oiij/directives

# 使用 pnpm
pnpm add @oiij/directives
```

## 基本使用

```ts
import { setupDirective } from '@oiij/directives'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(setupDirective)
```

<demo vue="./directives.vue" title="UseDirectives" />

## API

### 函数签名

```ts
declare function setupDirective(app: App): void
```

## 类型定义

```ts
declare function setupDirective(app: App): void
```
