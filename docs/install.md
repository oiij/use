# 安装指南

本项目是一个 Monorepo，包含多个独立的 npm 包。你可以根据需要选择安装特定的包。

## 安装方式

### 使用 pnpm（推荐）

```bash
# 安装核心包
pnpm add @oiij/use

# 安装 NaiveUI 扩展
pnpm add @oiij/naive-ui

# 安装 ECharts 封装
pnpm add @oiij/e-charts

# 安装 Three.js 封装
pnpm add @oiij/three-js

# 安装其他包
pnpm add @oiij/ai-editor
pnpm add @oiij/chrome-tabs
pnpm add @oiij/css-render
pnpm add @oiij/directives
pnpm add @oiij/emoji-picker
pnpm add @oiij/js-pdf
pnpm add @oiij/markdown-it
pnpm add @oiij/ogl
pnpm add @oiij/shiki
pnpm add @oiij/tiptap
pnpm add @oiij/v-charts
pnpm add @oiij/xlsx
pnpm add @oiij/utils
```

### 使用 npm

```bash
npm install @oiij/use
npm install @oiij/naive-ui
# ... 其他包
```

### 使用 yarn

```bash
yarn add @oiij/use
yarn add @oiij/naive-ui
# ... 其他包
```

## 核心包安装

### @oiij/use

这是核心包，提供了基础的组合式 API 工具函数。

```bash
pnpm add @oiij/use
```

**依赖：**

- `@vueuse/core`
- `vue`

## UI 组件包安装

### @oiij/naive-ui

基于 Naive UI 的扩展，提供额外的组合式函数和组件。

```bash
pnpm add @oiij/naive-ui
```

**依赖：**

- `@oiij/css-render`
- `@oiij/markdown-it`
- `@oiij/use`
- `naive-ui`
- `@vueuse/core`
- 其他依赖详见 package.json

### @oiij/chrome-tabs

Chrome 风格的标签页组件。

```bash
pnpm add @oiij/chrome-tabs
```

**依赖：**

- `@oiij/css-render`
- `@oiij/use`
- `vue`
- `colord`

### @oiij/directives

Vue 3 自定义指令集合。

```bash
pnpm add @oiij/directives
```

**依赖：**

- `@oiij/utils`
- `vue`

## 图表与可视化包

### @oiij/e-charts

ECharts 的 Vue 3 组合式封装。

```bash
pnpm add @oiij/e-charts
```

**依赖：**

- `echarts`
- `@vueuse/core`
- `vue`

### @oiij/v-charts

VCharts 的 Vue 3 组合式封装。

```bash
pnpm add @oiij/v-charts
```

**依赖：**

- `@visactor/vchart`
- `@vueuse/core`
- `vue`

## 编辑器与文档包

### @oiij/ai-editor

AI 编辑器的 Vue 3 封装。

```bash
pnpm add @oiij/ai-editor
```

**依赖：**

- `aieditor`
- `@vueuse/core`
- `vue`

### @oiij/tiptap

TipTap 富文本编辑器的 Vue 3 集成。

```bash
pnpm add @oiij/tiptap
```

**依赖：**

- `@tiptap/core`
- `@tiptap/pm`
- `@tiptap/starter-kit`
- `@vueuse/core`
- `vue`

### @oiij/markdown-it

Markdown 解析的 Vue 3 组合式封装。

```bash
pnpm add @oiij/markdown-it
```

**依赖：**

- `markdown-it`
- `dompurify`
- `@vueuse/core`
- `vue`

### @oiij/shiki

Shiki 语法高亮的 Vue 3 组合式封装。

```bash
pnpm add @oiij/shiki
```

**依赖：**

- `shiki`
- `@vueuse/core`
- `vue`

## 3D 与图形包

### @oiij/three-js

Three.js 的 Vue 3 组合式封装。

```bash
pnpm add @oiij/three-js
```

**依赖：**

- `three`
- `@vueuse/core`
- `cannon-es`
- `postprocessing`
- `@tweakpane/core`
- `tweakpane`
- `@tweenjs/tween.js`

### @oiij/ogl

OGL WebGL 库的 Vue 3 组合式封装。

```bash
pnpm add @oiij/ogl
```

**依赖：**

- `ogl`
- `@vueuse/core`
- `vue`

## 工具包

### @oiij/utils

JavaScript/TypeScript 工具函数集合。

```bash
pnpm add @oiij/utils
```

**无外部依赖**

提供以下子模块：

- `array` - 数组工具函数
- `color` - 颜色工具函数
- `date` - 日期工具函数
- `dom` - DOM 操作工具函数
- `is` - 类型判断函数
- `math` - 数学工具函数
- `number` - 数字工具函数
- `object` - 对象工具函数
- `random` - 随机数生成
- `string` - 字符串工具函数

### @oiij/css-render

CSS 渲染工具的组合式封装。

```bash
pnpm add @oiij/css-render
```

**依赖：**

- `css-render`
- `@css-render/plugin-bem`
- `@css-render/vue3-ssr`

### @oiij/js-pdf

PDF 生成和处理的 Vue 3 工具。

```bash
pnpm add @oiij/js-pdf
```

**依赖：**

- `jspdf`
- `jszip`
- `pdfjs-dist`
- `file-saver`

### @oiij/xlsx

Excel 文件处理的 Vue 3 工具。

```bash
pnpm add @oiij/xlsx
```

**依赖：**

- `xlsx`
- `@vueuse/core`
- `file-saver`

### @oiij/emoji-picker

表情选择器的 Vue 3 组合式封装。

```bash
pnpm add @oiij/emoji-picker
```

**依赖：**

- `emoji-mart`
- `@emoji-mart/data`
- `@vueuse/core`

## Vue 项目配置

如果你的项目没有配置对 `.mjs` 或 `.mts` 文件的支持，需要在 `tsconfig.json` 中添加相应配置：

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force"
  }
}
```

## Vite 配置

在 `vite.config.ts` 中确保正确配置别名（如果需要）：

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 如果使用别名
    }
  }
})
```

## 下一步

安装完成后，请查看 [示例文档](/examples) 了解具体使用方法。
