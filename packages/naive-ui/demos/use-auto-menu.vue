<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { NFlex, NInput, NMenu } from 'naive-ui'
import { computed, ref } from 'vue'
import { useAutoMenu } from '../src'

// 模拟路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/home',
    meta: {
      title: '首页',
    },
  },
  {
    path: '/about',
    name: 'About',
    redirect: '/about-us',
    meta: {
      title: '关于我们',
    },
  },
  {
    path: '/user',
    name: 'User',
    meta: {
      title: '用户管理',
    },
    children: [
      {
        path: 'profile',
        name: 'Profile',
        redirect: '/user/profile',
        meta: {
          title: '个人资料',
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        redirect: '/user/settings',
        meta: {
          title: '账户设置',
          root: true, // 标记为 root，将作为顶级菜单
        },
      },
    ],
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: {
      title: '管理中心',
      hidden: true, // 标记为隐藏
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        redirect: '/admin/dashboard',
        meta: {
          title: '仪表盘',
        },
      },
    ],
  },
]

// 使用 useAutoMenu
const { menuOptions, flattenedMenuOptions } = useAutoMenu(routes, {
  // 自定义隐藏逻辑（使用函数）
  hide: route => route.meta?.hidden,
  // 自定义隐藏逻辑（使用字符串）
  // hide: 'hidden',

  // 自定义根路由判断（使用函数）
  root: route => route.meta?.root,
  // 自定义根路由判断（使用字符串）
  // root: 'root',

  // 自定义标签（使用函数）
  label: route => route.meta?.title ?? route.name,
  // 自定义标签（使用字符串）
  // label: 'title',

  // 自定义键（使用函数）
  key: route => route.path,
  // 自定义键（使用字符串）
  // key: 'path',

  // 自定义图标渲染（可选）
  icon: () => {
    // 这里可以根据路由元信息返回不同的图标
    return null
  },
})

// 搜索功能
const searchKeyword = ref('')
const filteredMenuOptions = computed(() => {
  if (!searchKeyword.value) {
    return []
  }
  return flattenedMenuOptions.value.filter(menu =>
    menu.label?.toString().includes(searchKeyword.value),
  )
})
</script>

<template>
  <NFlex vertical>
    <h2>基本菜单</h2>
    <NMenu :options="menuOptions" />

    <h2>扁平化菜单（用于搜索）</h2>
    <NInput v-model:value="searchKeyword" placeholder="搜索菜单" style="width: 300px; margin-bottom: 16px;" />
    <pre>{{ filteredMenuOptions }}</pre>
  </NFlex>
</template>

<style scoped>
h2 {
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}
</style>
