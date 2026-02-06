# Use auto-Router 🚀

[![NPM version](https://img.shields.io/npm/v/@oiij/auto-router)](https://www.npmjs.com/package/@oiij/auto-router)
[![MIT-license](https://img.shields.io/npm/l/@oiij/auto-router)](https://github.com/oiij/use/blob/main/packages/auto-router/LICENSE)

## 项目简介 📦

Use auto-Router 是一个 Vue Router 工具库，为 Vue 3 应用提供自动路由管理、Keep-Alive 管理等实用功能，帮助开发者更高效地管理应用路由。

## 功能特点 ✨

### 自动路由管理 🛣️

- 🔄 自动解析和排序路由（支持数字前缀排序）
- 📊 路由扁平化处理
- 🎯 支持嵌套路由元数据继承
- 📝 自动规范化路由名称

### Keep-Alive 管理 💾

- 🚀 自动管理页面缓存
- 📦 基于路由元数据的缓存配置
- 🎨 支持动态缓存控制

### 加载状态管理 ⏳

- 📊 自动跟踪路由加载状态
- 🔄 基于导航守卫的状态管理
- 🎯 响应式的加载状态计算属性

### 类型安全 🔒

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- 🎯 支持 Vue 3 的 Composition API 类型系统

## 安装 📥

### 使用 pnpm 🐱

```bash
pnpm add @oiij/auto-router
```

### 使用 npm 📦

```bash
npm install @oiij/auto-router
```

### 使用 yarn 🧶

```bash
yarn add @oiij/auto-router
```

## 快速开始 🌟

### 基础使用

```vue
<script setup>
import { useAutoRouter } from '@oiij/auto-router'

const { loading, routes, currentRoutePath } = useAutoRouter()
</script>

<template>
  <div>
    <div v-if="loading">
      加载中...
    </div>
    <div v-else>
      <p>当前路由: {{ currentRoutePath }}</p>
      <nav>
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
        >
          {{ route.meta?.title }}
        </router-link>
      </nav>
    </div>
  </div>
</template>
```

## 在线文档 📚

[在线文档](https://oiij-use.vercel.app/auto-router/auto-router) 📖

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
