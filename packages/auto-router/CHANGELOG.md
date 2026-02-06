# Changelog

## [0.0.1] - 2024

### ✨ 新增功能

- 🎉 初始版本发布
- 🔄 自动路由解析和排序
- 📊 路由扁平化处理
- 🔐 灵活的权限验证机制
- 💾 Keep-Alive 自动管理
- 🎯 嵌套路由元数据继承
- 📝 完整的 TypeScript 类型支持
- 🔧 Vue Router RouteMeta 类型扩展

### 📦 核心 API

#### createAutoRouter()
- 创建自动路由插件
- 必须在 Vue Router 之后安装
- 自动解析和处理路由配置

#### useAutoRouter()
- 获取自动路由实例
- 提供路由配置和工具方法
- 支持响应式路由状态

#### appendRouterMeta()
- 用于 unplugin-vue-router 集成
- 自动从文件名提取排序编号
- 规范化路由名称

#### setupAutoRouter()
- 手动设置自动路由（高级用法）
- 直接传入 Router 实例
- 返回完整的路由工具集

### 🎯 特性

1. **路由排序**
   - 支持文件名数字前缀（01_home.vue）
   - 支持 meta.sort 配置
   - 自动按 sort 值排序

2. **权限控制**
   - filterRoutesByPermission 方法
   - 支持 requireAuth 元数据
   - 灵活的权限验证逻辑

3. **Keep-Alive**
   - 自动收集需要缓存的路由
   - 基于 meta.keepAlive 配置
   - 响应式缓存路径列表

4. **路由元数据**
   - title - 路由标题
   - description - 路由描述
   - icon - 路由图标
   - sort - 排序权重
   - keepAlive - 缓存控制
   - requireAuth - 权限验证
   - layout - 布局组件
   - transitionName - 过渡动画
   - group - 分组信息

### 📝 类型定义

```ts
interface AutoRouterInstance {
  routesRaw: readonly RouteRecordRaw[]
  routes: RouteRecordRaw[]
  flattenRoutes: RouteRecordRaw[]
  keepAlivePath: ComputedRef<string[]>
  currentRoute: ComputedRef<RouteLocationNormalizedLoaded>
  currentRoutePath: ComputedRef<string>
  filterRoutesByPermission: (permissions: string[]) => RouteRecordRaw[]
}
```

### 🔧 依赖

- Vue 3.x
- Vue Router 4.x
- es-toolkit (用于深拷贝)

### 📚 文档

- 完整的 JSDoc 注释
- TypeScript 类型定义
- 详细的使用示例
- API 参考文档
