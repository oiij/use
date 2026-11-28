import type { RouteRecordRaw } from 'vue-router'
import type { TreeNode } from './use-naive-menu'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { flattenTree, useNaiveMenu } from './use-naive-menu'

const component = { name: 'TestPage', render: () => null }

describe('useNaiveMenu', () => {
  it('纯壳父节点在 root 子项提升后被移除', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/home', name: 'Home', meta: { title: '首页' }, component },
      {
        path: '/system',
        name: 'System',
        meta: { title: '系统' },
        children: [
          { path: '', name: 'SystemHome', meta: { title: '系统首页', root: true }, component },
        ],
      },
    ]

    const { menuOptions } = useNaiveMenu(routes)

    expect(menuOptions.value.map(item => item.key)).toEqual(['Home', 'SystemHome'])
  })

  it('父节点有剩余子项时保留，提升项排在父节点之后', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/system',
        name: 'System',
        meta: { title: '系统' },
        children: [
          { path: '', name: 'SystemHome', meta: { title: '系统首页', root: true }, component },
          { path: 'user', name: 'SystemUser', meta: { title: '用户' }, component },
        ],
      },
    ]

    const { menuOptions } = useNaiveMenu(routes)

    expect(menuOptions.value.map(item => item.key)).toEqual(['System', 'SystemHome'])
    expect(menuOptions.value[0]?.children?.map(item => item.key)).toEqual(['SystemUser'])
  })

  it('可导航父节点只剩 root 子项时保留为叶子', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/system',
        name: 'System',
        meta: { title: '系统' },
        component,
        children: [
          { path: '', name: 'SystemHome', meta: { title: '系统首页', root: true }, component },
        ],
      },
    ]

    const { menuOptions } = useNaiveMenu(routes)

    expect(menuOptions.value.map(item => item.key)).toEqual(['System', 'SystemHome'])
    expect(menuOptions.value[0]?.children).toBeUndefined()
  })

  it('提升项仍会递归处理子级并继续提升孙级 root 子项', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/a',
        name: 'A',
        children: [
          {
            path: 'b',
            name: 'B',
            meta: { title: 'B', root: true },
            children: [
              { path: 'c', name: 'C', meta: { title: 'C' }, component },
              { path: 'd', name: 'D', meta: { title: 'D', root: true }, component },
            ],
          },
        ],
      },
    ]

    const { menuOptions } = useNaiveMenu(routes)

    expect(menuOptions.value.map(item => item.key)).toEqual(['B', 'D'])
    expect(menuOptions.value[0]?.children?.map(item => item.key)).toEqual(['C'])
  })

  it('不会修改传入的路由对象', () => {
    const wrapperMeta = { parent: { title: '父标题' } }
    const routes: RouteRecordRaw[] = [
      {
        path: '/parent',
        name: 'Parent',
        meta: { title: '原标题' },
        children: [
          { path: '', name: 'ParentWrapper', meta: wrapperMeta, component },
        ],
      },
    ]

    const { menuOptions } = useNaiveMenu(routes)

    expect(routes[0]?.meta).toEqual({ title: '原标题' })
    expect(routes[0]?.children?.[0]?.meta).toBe(wrapperMeta)
    expect(menuOptions.value[0]?.label).toBe('父标题')
    expect(menuOptions.value[0]?.key).toBe('Parent')
  })

  it('未提供 renderIcon 时 icon 为 undefined', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/icon', name: 'Icon', meta: { title: '图标', icon: 'i-home' }, component },
    ]

    const { menuOptions } = useNaiveMenu(routes)

    expect(menuOptions.value[0]?.icon).toBeUndefined()
  })

  it('提供 renderIcon 时生成渲染函数', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/icon', name: 'Icon', meta: { title: '图标', icon: 'i-home' }, component },
    ]

    const { menuOptions } = useNaiveMenu(routes, { renderIcon: icon => icon })
    const icon = menuOptions.value[0]?.icon as () => unknown

    expect(typeof icon).toBe('function')
    expect(icon()).toBe('i-home')
  })

  it('隐藏路由不会出现在菜单中', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/home', name: 'Home', meta: { title: '首页' }, component },
      { path: '/admin', name: 'Admin', meta: { title: '管理', hidden: true }, component },
    ]

    const { menuOptions, flattenedMenuOptions } = useNaiveMenu(routes)

    expect(menuOptions.value.map(item => item.key)).toEqual(['Home'])
    expect(flattenedMenuOptions.value.map(item => item.label)).toEqual(['首页'])
  })

  it('symbol 类型 name 使用 path 作为 key', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/symbol', name: Symbol('symbol-name'), meta: { title: '符号' }, component },
    ]

    const { menuOptions } = useNaiveMenu(routes)

    expect(menuOptions.value[0]?.key).toBe('/symbol')
  })

  it('响应式路由变化后菜单自动更新', async () => {
    const routes = ref<RouteRecordRaw[]>([
      { path: '/home', name: 'Home', meta: { title: '首页' }, component },
    ])

    const { menuOptions } = useNaiveMenu(routes)

    routes.value.push({ path: '/next', name: 'Next', meta: { title: '下一页' }, component })
    await nextTick()

    expect(menuOptions.value.map(item => item.key)).toEqual(['Home', 'Next'])
  })
})

describe('flattenTree', () => {
  it('扁平化并移除 children 字段', () => {
    const tree: TreeNode<{ key: string }>[] = [
      { key: 'a', children: [{ key: 'b' }] },
    ]

    expect(flattenTree(tree)).toEqual([{ key: 'a' }, { key: 'b' }])
  })
})
