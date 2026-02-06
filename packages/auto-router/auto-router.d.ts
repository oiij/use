/* eslint-disable */
/* prettier-ignore */
// biome-ignore format: off
// biome-ignore lint: off
// @ts-nocheck
// Vue Router 路由元数据类型扩展
// 这个文件扩展了 vue-router 的 RouteMeta 接口
// 确保此文件包含在项目的 tsconfig.json 中

import 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 export 声明
export {}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 路由标题
     */
    title?: string

    /**
     * 路由描述
     */
    description?: string

    /**
     * 路由图标
     */
    icon?: string

    /**
     * 图标颜色
     */
    iconColor?: string

    /**
     * 排序权重（数字越小越靠前）
     */
    sort?: number

    /**
     * 布局组件名称
     */
    layout?: string

    /**
     * 过渡动画名称
     */
    transitionName?: string

    /**
     * 是否启用 Keep-Alive 缓存
     */
    keepAlive?: boolean

    /**
     * 是否为根路由
     */
    root?: boolean

    /**
     * 路由分组信息（用于导航菜单等）
     */
    group?: {
      /**
       * 分组标题
       */
      title?: string

      /**
       * 分组描述
       */
      description?: string

      /**
       * 分组图标
       */
      icon?: string

      /**
       * 分组图标颜色
       */
      iconColor?: string

      /**
       * 分组排序权重
       */
      sort?: number
    }
  }
}

