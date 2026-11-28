import type { MenuOption } from 'naive-ui'
import type { MaybeRefOrGetter, VNodeChild } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { computed, toValue } from 'vue'

/**
 * 配置选项接口
 * 用于定义 useNaiveMenu 组合函数的配置参数
 */
export type UseNaiveMenuOptions = {
  /**
   * 隐藏条件，可以是函数或字符串
   * - 如果是函数，返回 true 时路由将不显示在菜单中
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   * @default 'hidden'
   */
  hidden?: ((route: RouteRecordRaw) => boolean | string) | string
  /**
   * 根路由判断，可以是函数或字符串
   * - 如果是函数，返回 true 时路由将作为顶级菜单
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   * @default 'root'
   */
  root?: ((route: RouteRecordRaw) => boolean | string) | string
  /**
   * 标签字段名，从 route.meta 中获取对应属性的值作为菜单标签
   * @default 'title'
   */
  labelField?: string
  /**
   * 键字段名，从 route 中获取对应属性的值作为菜单键
   * @default 'name'
   */
  keyField?: string
  /**
   * 图标字段名，从 route.meta 中获取对应属性的值作为菜单图标
   * @default 'icon'
   */
  iconField?: string
  /**
   * 图标渲染函数，用于自定义图标渲染
   * @default undefined
   */
  renderIcon?: (icon: string) => VNodeChild
  /**
   * 父路由元信息字段名
   * @default 'parent'
   */
  parentField?: string
  /**
   * 父路由文件路径
   * @default ''
   */
  parentFilePath?: string
  /**
   * 父路由元信息生成函数
   * @default undefined
   */
  parent?: (route: RouteRecordRaw) => Record<string, unknown>
  /**
   * 自定义菜单选项创建函数
   * @default undefined
   */
  createMenuOption?: (route: RouteRecordRaw) => MenuOption
}

type ResolvedOptions = {
  hidden: ((route: RouteRecordRaw) => boolean | string) | string
  root: ((route: RouteRecordRaw) => boolean | string) | string
  labelField: string
  keyField: string
  iconField: string
  renderIcon?: (icon: string) => VNodeChild
  createMenuOption?: (route: RouteRecordRaw) => MenuOption
  parentField: string
  parentFilePath: string
  parent?: (route: RouteRecordRaw) => Record<string, unknown>
}

function resolveOptions(options?: UseNaiveMenuOptions): ResolvedOptions {
  return {
    hidden: options?.hidden ?? 'hidden',
    root: options?.root ?? 'root',
    labelField: options?.labelField ?? 'title',
    keyField: options?.keyField ?? 'name',
    iconField: options?.iconField ?? 'icon',
    renderIcon: options?.renderIcon,
    createMenuOption: options?.createMenuOption,
    parentField: options?.parentField ?? 'parent',
    parentFilePath: options?.parentFilePath ?? '',
    parent: options?.parent,
  }
}

function readMeta<T = unknown>(route: RouteRecordRaw, field: string, fallback?: T): T | undefined {
  return (route.meta?.[field] as T | undefined) ?? fallback
}

function readRoute<T = unknown>(route: RouteRecordRaw, field: string, fallback?: T): T | undefined {
  return ((route as unknown as Record<string, unknown>)[field] as T | undefined) ?? fallback
}

function resolveFlag(route: RouteRecordRaw, config: ((route: RouteRecordRaw) => boolean | string) | string | undefined): boolean {
  if (!config)
    return false
  const result = typeof config === 'function' ? config(route) : readMeta(route, config)
  return typeof result === 'boolean' ? result : !!result
}

function normalizeKey(value: unknown): string | undefined {
  if (typeof value === 'string')
    return value
  if (value == null || typeof value === 'symbol')
    return undefined
  return String(value)
}

function getRouteFallback(route: RouteRecordRaw): string {
  return typeof route.name === 'string' ? route.name : route.path
}

function buildConfigMenuOption(route: RouteRecordRaw, options: ResolvedOptions): MenuOption {
  const { labelField, keyField, iconField, renderIcon } = options
  const labelValue = readMeta<string>(route, labelField)
  const keyValue = normalizeKey(readRoute(route, keyField))
  const iconValue = readMeta<string>(route, iconField)

  return {
    label: labelValue ?? getRouteFallback(route),
    key: keyValue ?? getRouteFallback(route),
    icon: iconValue && renderIcon ? () => renderIcon(iconValue) : undefined,
    meta: route.meta,
  }
}

function buildMenuOption(route: RouteRecordRaw, options: ResolvedOptions): MenuOption {
  return options.createMenuOption ? options.createMenuOption(route) : buildConfigMenuOption(route, options)
}

function isNavigable(route: RouteRecordRaw): boolean {
  return 'component' in route || 'components' in route || 'redirect' in route
}

function resolveParentMeta(route: RouteRecordRaw, wrapper: RouteRecordRaw, options: ResolvedOptions) {
  if (options.parent)
    return options.parent(route)
  if (!options.parentField)
    return undefined
  return wrapper.meta?.[options.parentField] as Record<string, unknown> | undefined
}

function withParentMeta(route: RouteRecordRaw, options: ResolvedOptions): RouteRecordRaw {
  const wrapper = route.children?.find(child => child.path === options.parentFilePath)
  const parentMeta = wrapper ? resolveParentMeta(route, wrapper, options) : undefined
  const children = route.children?.map(child => withParentMeta(child, options))
  const result = { ...route, children } as RouteRecordRaw

  if (parentMeta)
    result.meta = { ...route.meta, ...parentMeta }

  return result
}

function routes2menu(routes: RouteRecordRaw[], options: ResolvedOptions): MenuOption[] {
  return routes.flatMap((route) => {
    if (resolveFlag(route, options.hidden))
      return []

    const menu = buildMenuOption(route, options)
    const children = (route.children ?? []).filter(child => !resolveFlag(child, options.hidden))

    if (!children.length)
      return [menu]

    const rootChildren: RouteRecordRaw[] = []
    const normalChildren: RouteRecordRaw[] = []

    for (const child of children) {
      if (resolveFlag(child, options.root))
        rootChildren.push(child)
      else
        normalChildren.push(child)
    }

    if (!rootChildren.length) {
      menu.children = routes2menu(normalChildren, options)
      return [menu]
    }

    const hoisted = routes2menu(rootChildren, options)
    const keepParent = normalChildren.length > 0 || isNavigable(route)

    if (!keepParent)
      return hoisted

    if (normalChildren.length)
      menu.children = routes2menu(normalChildren, options)

    return [menu, ...hoisted]
  })
}

/**
 * 定义带有可选 children 属性的树形节点类型
 * @template T 节点自身类型
 */
export type TreeNode<T> = T & {
  /**
   * 子节点列表
   * @default undefined
   */
  children?: TreeNode<T>[]
}

/**
 * 将树形结构扁平化为一维数组
 * @param array 原始树形节点数组
 * @param childrenKey children 属性名，默认为 'children'
 * @returns 扁平化后的数组，节点上不包含 children 字段
 * @example
 * ```ts
 * const flat = flattenTree([
 *   { key: 'a', children: [{ key: 'b' }] }
 * ])
 * // [{ key: 'a' }, { key: 'b' }]
 * ```
 */
export function flattenTree<T extends Record<string, any>>(array: TreeNode<T>[], childrenKey: string = 'children'): T[] {
  return array.reduce<T[]>((result, item) => {
    const currentItem: Record<string, any> = {}
    for (const key in item) {
      if (key !== childrenKey)
        currentItem[key] = item[key]
    }
    result.push(currentItem as T)

    const children = (item as Record<string, any>)[childrenKey]
    if (Array.isArray(children))
      result.push(...flattenTree<T>(children, childrenKey))

    return result
  }, [])
}

/**
 * 自动菜单组合函数
 * 将路由配置转换为菜单配置，并提供扁平化的菜单选项
 * @param routes 路由配置数组，可以是响应式或普通数组
 * @param options 配置选项
 * @returns 包含菜单选项和扁平化菜单选项的对象
 * @example
 * ```ts
 * // 基本使用
 * const { menuOptions, flattenedMenuOptions } = useNaiveMenu(routes)
 *
 * // 带配置选项（使用函数）
 * const { menuOptions, flattenedMenuOptions } = useNaiveMenu(routes, {
 *   hidden: (route) => route.meta?.hidden,
 *   root: (route) => route.meta?.root,
 *   labelField: 'title',
 *   keyField: 'name',
 *   iconField: 'icon',
 *   renderIcon: (icon) => h('i', { class: icon })
 * })
 *
 * // 带配置选项（使用字符串）
 * const { menuOptions, flattenedMenuOptions } = useNaiveMenu(routes, {
 *   hidden: 'hidden',
 *   root: 'root',
 *   labelField: 'title',
 *   keyField: 'name',
 *   iconField: 'icon'
 * })
 * ```
 */
export function useNaiveMenu(routes: MaybeRefOrGetter<RouteRecordRaw[]>, options?: UseNaiveMenuOptions) {
  const resolvedOptions = resolveOptions(options)

  const menuOptions = computed(() => {
    const routeList = toValue(routes) ?? []
    const processedRoutes = routeList.map(route => withParentMeta(route, resolvedOptions))
    return routes2menu(processedRoutes, resolvedOptions)
  })

  const flattenedMenuOptions = computed(() => flattenTree(menuOptions.value))

  return {
    menuOptions,
    flattenedMenuOptions,
  }
}

/**
 * useNaiveMenu 返回类型
 */
export type UseNaiveMenuReturns = ReturnType<typeof useNaiveMenu>
