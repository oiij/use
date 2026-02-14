# Use Spline 🎨

[![NPM version](https://img.shields.io/npm/v/@oiij/spline)](https://www.npmjs.com/package/@oiij/spline)
[![MIT-license](https://img.shields.io/npm/l/@oiij/spline)](https://github.com/oiij/use/blob/main/packages/spline/LICENSE)

## 项目简介 📦

Use Spline 是基于 Spline Runtime 的 Vue 3 封装，提供便捷的 Spline 3D 模型加载功能，帮助开发者在应用中轻松集成 3D 交互体验。

## 功能特点 ✨

### 3D 模型加载 🎮

- 🎨 提供简洁的 Spline 场景加载接口
- ⚡ 支持响应式场景 URL，自动重新加载
- 🎭 完整的事件系统，监听加载生命周期

### 模块化设计 🧩

- 📁 采用模块化架构，组件独立封装
- 📦 支持按需导入，减小打包体积
- � 清晰的文件结构，易于维护和扩展

### 类型安全 🔒

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- 🎯 支持 Vue 3 的 Composition API 类型系统

### 轻量高效 ⚡

- � 核心代码精简，无额外依赖
- 🏃 优化的性能表现，最小化运行时开销
- � 支持 Tree Shaking，进一步减小打包体积

## 安装 📥

### 使用 pnpm 🐱

```bash
pnpm add @oiij/spline @splinetool/runtime
```

### 使用 npm 📦

```bash
npm install @oiij/spline @splinetool/runtime
```

### 使用 yarn 🧶

```bash
yarn add @oiij/spline @splinetool/runtime
```

## 快速开始 🌟

### 基础使用

```vue
<script setup>
import { useSpline } from '@oiij/spline'
import { ref } from 'vue'

const canvasRef = ref()
const sceneUrl = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'

const { app, isLoading, error } = useSpline(canvasRef, {
  scene: sceneUrl
})
</script>

<template>
  <div ref="canvasRef" style="width: 100%; height: 400px;" />
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-if="error">
    {{ error.message }}
  </div>
</template>
```

## 在线文档 📚

[在线文档](https://oiij-use.vercel.app/spline/spline) 📖

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
- 问题反馈: [GitHub Issues](https://github.com/oiij/use/issues) 🐛
