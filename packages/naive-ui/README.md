# Naive-UI 🎨

[![NPM version](https://img.shields.io/npm/v/@oiij/naive-ui)](https://www.npmjs.com/package/@oiij/naive-ui)
[![MIT-license](https://img.shields.io/npm/l/@oiij/naive-ui)](https://github.com/oiij/use/blob/main/packages/naive-ui/LICENSE)

## 项目简介 📦

Use NaiveUI 是基于 Naive UI 的 Vue 3 组件库封装，提供了一套丰富的 UI 组件和组合式 API，帮助开发者快速构建现代化的 Web 应用。

## 功能特点 ✨

### 模块化设计 🧩

- 📁 采用模块化架构，每个组件独立封装
- 📦 支持按需导入，减小打包体积
- 🔧 清晰的文件结构，易于维护和扩展

### 类型安全 🔒

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- 🎯 支持 Vue 3 的 Composition API 类型系统

### 轻量高效 ⚡

- 🚀 核心代码精简，基于 Naive UI 构建
- 🏃 优化的性能表现，最小化运行时开销
- 📦 支持 Tree Shaking，进一步减小打包体积

### 功能丰富 🎨

- 🧩 丰富的 UI 组件和组合式 API
- 🛠️ 提供开箱即用的解决方案
- 🔄 与 Vue 3 生态系统无缝集成

## 安装 📥

### 使用 pnpm 🐱

```bash
pnpm add @oiij/naive-ui
```

### 使用 npm 📦

```bash
npm install @oiij/naive-ui
```

### 使用 yarn 🧶

```bash
yarn add @oiij/naive-ui
```

## 快速开始 🌟

### 基础使用

```vue
<script setup>
import type { RouteRecordRaw } from 'vue-router'
import { useAutoMenu } from '@oiij/naive-ui'

// 模拟路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: '关于我们'
    }
  }
]

const { menuOptions } = useAutoMenu(routes)
</script>

<template>
  <div>
    <n-menu :options="menuOptions" />
  </div>
</template>
```

## 功能模块 📋

### 组合式 API

- **use-auto-menu** 📋: 自动菜单生成
- **use-data-request** 📡: 数据请求管理
- **use-loading** ⏳: 加载状态管理
- **use-naive-form** 📝: 表单管理
- **use-naive-theme** 🎨: 主题管理

### 组件

- **config-providers** ⚙️: 全局配置
- **copy-button** 📋: 复制按钮
- **data-table-plus** 📊: 增强数据表格
- **loading-provider** ⏳: 加载状态提供者
- **preset-form** 📝: 预设表单
- **preset-input** 📱: 预设输入框
- **preset-picker** 📅: 预设选择器
- **preset-select** 🔽: 预设选择器
- **remote-request** 📡: 远程请求组件
- **search-input** 🔍: 搜索输入框
- **toggle-input** 🔄: 切换输入框
- **tooltip-button** 💬: 提示按钮
- **transition** 🔄: 过渡动画
- **type-writer** ⌨️: 打字机效果

## 在线文档 📚

[在线文档](https://oiij-use.vercel.app/naive-ui/naive-ui) 📖

## 贡献指南 🤝

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库 🍴
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`) 🌿
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`) 💾
4. 推送到分支 (`git push origin feature/amazing-feature`) 🚀
5. 打开一个 Pull Request 📥

## 许可证 📄

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情 📑

## 联系方式 📞

- GitHub: [https://github.com/oiij/use](https://github.com/oiij/use) 🌟
