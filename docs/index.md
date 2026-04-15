---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "@OIIJ/USE"
  tagline: 功能丰富的 Vue 3 工具库集合
  image:
    src: /logo.svg
    alt: OIIJ/USE
  actions:
    - theme: brand
      text: 查看示例
      link: /examples
    - theme: alt
      text: 安装指南
      link: /install
    - theme: alt
      text: GitHub
      link: https://github.com/oiij/use

features:
  - title: 📦 模块化设计
    details: 按需导入，轻量高效，无额外依赖
  - title: 🔒 TypeScript 支持
    details: 完整的 TypeScript 类型定义，提供优秀的开发体验
  - title: 🚀 性能优化
    details: 轻量级实现，与 Vue 3 生态系统无缝集成
  - title: 🎨 功能丰富
    details: 涵盖核心工具、UI 组件、图表、3D 渲染等多个领域
  - title: 🛠️ 易于使用
    details: 简洁的 API 设计，开箱即用
  - title: 📚 文档完善
    details: 详细的文档和示例，快速上手
---

## 快速开始

### 安装

```bash
# 使用 pnpm
pnpm add @oiij/use

# 使用 npm
npm install @oiij/use

# 使用 yarn
yarn add @oiij/use
```

### 基础使用

```vue
<script setup lang="ts">
import { useMouse, useStorage } from '@oiij/use'

// 使用本地存储
const count = useStorage('count', 0)

// 追踪鼠标位置
const { x, y } = useMouse()
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Mouse: {{ x }}, {{ y }}</p>
  </div>
</template>
```

## 包列表

### 核心包

- **@oiij/use** - 核心 Composable 函数集合，提供常用的 Vue 3 组合式 API 工具

### UI 组件

- **@oiij/naive-ui** - 基于 Naive UI 的组合式函数和组件扩展，包含 useNaiveMenu 自动菜单生成等功能
- **@oiij/chrome-tabs** - Chrome 风格的标签页组件
- **@oiij/directives** - Vue 3 自定义指令集合

### 图表与可视化

- **@oiij/e-charts** - ECharts 的 Vue 3 组合式封装
- **@oiij/v-charts** - VCharts 的 Vue 3 组合式封装

### 编辑器与文档

- **@oiij/ai-editor** - AI 编辑器的 Vue 3 封装
- **@oiij/tiptap** - TipTap 富文本编辑器的 Vue 3 集成
- **@oiij/markdown-it** - Markdown 解析的 Vue 3 组合式封装
- **@oiij/shiki** - Shiki 语法高亮的 Vue 3 组合式封装

### 3D 与图形

- **@oiij/three-js** - Three.js 的 Vue 3 组合式封装
- **@oiij/ogl** - OGL WebGL 库的 Vue 3 组合式封装

### 工具库

- **@oiij/utils** - JavaScript/TypeScript 工具函数集合
- **@oiij/css-render** - CSS 渲染工具的组合式封装
- **@oiij/js-pdf** - PDF 生成和处理的 Vue 3 工具
- **@oiij/xlsx** - Excel 文件处理的工具
- **@oiij/hucre** - Excel/CSV 文件处理的工具
- **@oiij/emoji-picker** - 表情选择器的 Vue 3 组合式封装
- **@oiij/auto-i18n** - Vue I18n 自动国际化管理工具
- **@oiij/auto-router** - Vue Router 自动路由管理工具

## 为什么选择 @OIIJ/USE？

- **专注 Vue 3** - 深度集成 Vue 3 生态系统，充分利用 Composition API
- **生产就绪** - 经过充分测试，可用于生产环境
- **持续更新** - 积极维护，及时跟进 Vue 和相关库的最新版本
- **社区驱动** - 欢迎贡献，共同完善工具库

## 贡献

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

[MIT](https://github.com/oiij/use/blob/main/LICENSE) © oiij
