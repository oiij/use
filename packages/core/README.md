# Use Core 🚀

[![NPM version](https://img.shields.io/npm/v/@oiij/use)](https://www.npmjs.com/package/@oiij/use)
[![MIT-license](https://img.shields.io/npm/l/@oiij/use)](https://github.com/oiij/use/blob/main/LICENSE)

## 项目简介 📦

Use Core 是一个功能丰富的 Vue 3 组合式 API 工具库，提供了一系列实用的 composables，帮助开发者更高效地构建 Vue 应用。

## 功能特点 ✨

### 模块化设计 🧩

- 📁 采用模块化架构，每个功能独立封装
- 📦 支持按需导入，减小打包体积
- 🔧 清晰的文件结构，易于维护和扩展

### 类型安全 🔒

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- 🎯 支持 Vue 3 的 Composition API 类型系统

### 轻量高效 ⚡

- 🚀 核心代码精简，无额外依赖
- 🏃 优化的性能表现，最小化运行时开销
- 📦 支持 Tree Shaking，进一步减小打包体积

### 功能丰富 🎨

- 🔊 涵盖音频、动画、网络、UI 等多个领域
- 🛠️ 提供开箱即用的解决方案
- 🔄 与 Vue 3 生态系统无缝集成

## 安装 📥

### 使用 pnpm 🐱

```bash
pnpm add @oiij/use
```

### 使用 npm 📦

```bash
npm install @oiij/use
```

### 使用 yarn 🧶

```bash
yarn add @oiij/use
```

## 快速开始 🌟

### 基础使用

```vue
<script setup>
import { useBoolean } from '@oiij/use'
import { computed } from 'vue'

const { state: isVisible, toggle } = useBoolean(true)
const message = computed(() => isVisible.value ? 'Hello, Use Core!' : 'Goodbye, Use Core!')
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="toggle">
      切换
    </button>
  </div>
</template>
```

## 功能模块 📋

- **use-audio** 🎵: 音频处理
- **use-audio-context** 🔊: Web Audio API 封装
- **use-audio-context-buffer** 📻: 音频缓冲区管理
- **use-auto-ratio** 📐: 自动比例计算
- **use-boolean** ✅: 布尔值状态管理
- **use-context-menu** 📋: 上下文菜单
- **use-event-bus-key** 🚌: 事件总线键管理
- **use-event-source** 🔄: Server-Sent Events 封装
- **use-image-verify** 🖼️: 图片验证
- **use-injection-key** 💉: 依赖注入键管理
- **use-number-animation** 📈: 数字动画
- **use-scan-code** 📱: 扫码功能
- **use-scroll-view** 📜: 滚动视图管理
- **use-spectrum** 🌈: 频谱分析
- **use-type-writer** ⌨️: 打字机效果
- **use-view-transition** 🔄: 视图过渡效果
- **use-web-rtc** 📹: WebRTC 封装
- **use-web-socket** 🔌: WebSocket 封装

## 在线文档 📚

[在线文档](https://oiij-use.vercel.app) 📖

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

- GitHub: [https://github.com/Eiog/@oiij/use](https://github.com/Eiog/@oiij/use) 🌟
