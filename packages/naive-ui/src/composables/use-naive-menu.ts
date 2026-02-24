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
   */
  parent?: (route: RouteRecordRaw) => Record<string, unknown>
  /**
   * 自定义菜单选项创建函数
   */
  createMenuOption?: (route: RouteRecordRaw) => MenuOption
}

function getConfigValue<T>(
  route: RouteRecordRaw,
  config: ((route: RouteRecordRaw) => T) | string | undefined,
  returnType?: 'meta' | 'route',
  defaultValue?: T,
): T | undefined {
  if (!config) {
    return defaultValue
  }

  if (typeof config === 'function') {
    return config(route)
  }

  if (returnType === 'meta') {
    return route.meta?.[config] as T ?? defaultValue
  }
  return route?.[config as keyof RouteRecordRaw] as T ?? defaultValue
}

function createConfigMenuOption(route: RouteRecordRaw, options?: UseNaiveMenuOptions): MenuOption {
  const { labelField, keyField, iconField, renderIcon } = options ?? {}

  const labelValue = getConfigValue<string>(route, labelField, 'meta')
  const keyValue = getConfigValue<string>(route, keyField, 'route')
  const iconValue = getConfigValue<string>(route, iconField, 'meta')

  return {
    label: labelValue ?? route.meta?.title ?? route.name ?? route.path,
    key: keyValue ?? route.name?.toString() ?? route.path?.toString(),
    icon: iconValue ? () => renderIcon?.(iconValue) : undefined,
    meta: route.meta,
  }
}

function shouldHide(route: RouteRecordRaw, hidden?: ((route: RouteRecordRaw) => boolean | string) | string): boolean {
  if (!hidden) {
    return false
  }

  const result = getConfigValue(route, hidden, 'meta')
  return typeof result === 'boolean' ? result : !!result
}

function isRoot(route: RouteRecordRaw, root?: ((route: RouteRecordRaw) => boolean | string) | string): boolean {
  if (!root) {
    return false
  }

  const result = getConfigValue(route, root, 'meta')
  return typeof result === 'boolean' ? result : !!result
}

function routes2menu(routes: RouteRecordRaw[], options?: Omit<UseNaiveMenuOptions, 'parentField' | 'parentFilePath' | 'parent'>): MenuOption[] {
  const { hidden, root, createMenuOption } = options ?? {}
  const menuOptions: MenuOption[] = []

  for (const route of routes ?? []) {
    if (shouldHide(route, hidden)) {
      continue
    }

    const menu = typeof createMenuOption === 'function' ? createMenuOption(route) : createConfigMenuOption(route, options)

    if (route.children?.length) {
      const rootChildren = route.children.filter(child => isRoot(child, root))
      const normalChildren = route.children.filter(child => !isRoot(child, root))

      if (normalChildren.length) {
        menu.children = routes2menu(normalChildren, options)
      }

      if (rootChildren.length) {
        const rootMenuOptions = rootChildren
          .filter(child => !shouldHide(child, hidden))
          .map(child => typeof createMenuOption === 'function' ? createMenuOption(child) : createConfigMenuOption(child, options))

        menuOptions.push(...rootMenuOptions)
      }
    }

    menuOptions.push(menu)
  }

  return menuOptions
}

function deepUpRouteParentMeta(
  routes: RouteRecordRaw[],
  parentField: string,
  parentFilePath: string,
  parent?: (route: RouteRecordRaw) => Record<string, unknown>,
): RouteRecordRaw[] {
  return routes.map((route) => {
    const emptyPathChild = route.children?.find(f => f.path === parentFilePath)
    if (emptyPathChild) {
      if (typeof parent === 'function') {
        const parentMeta = parent(route)
        route.meta = {
          ...route.meta,
          ...parentMeta,
        }
      }
      else if (parentField) {
        const parentMeta = emptyPathChild.meta?.[parentField] as Record<string, unknown>
        route.meta = {
          ...route.meta,
          ...parentMeta,
        }
      }
    }
    if (route.children?.length) {
      route.children = deepUpRouteParentMeta(route.children, parentField, parentFilePath, parent)
    }
    return route
  })
}

/**
 * 定义带有可选 children 属性的树形节点类型
 */
type TreeNode<T> = T & {
  children?: TreeNode<T>[]
}

/**
 * 将树形结构扁平化为一维数组
 * @param array 原始树形节点数组
 * @param childrenKey children 属性名，默认为 'children'
 * @returns 扁平化后的数组
 */
export function flattenDeep<T extends Record<string, any>>(array: TreeNode<T>[], childrenKey: keyof TreeNode<T> = 'children'): T[] {
  return array.reduce<T[]>((result, item) => {
    // 创建不包含 children 的当前项副本（可选）
    const { [childrenKey]: _, ...currentItem } = item as any
    result.push(currentItem as T)

    // 递归处理 children
    const children = item[childrenKey]
    if (children && Array.isArray(children)) {
      result.push(...flattenDeep(children, childrenKey))
    }

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
  const {
    hidden = 'hidden',
    root = 'root',
    labelField = 'title',
    keyField = 'name',
    iconField = 'icon',
    renderIcon,
    createMenuOption,
    parentField = 'parent',
    parentFilePath = '',
    parent,
  } = options ?? {}

  const menuOptions = computed(() => {
    const routeList = toValue(routes)
    const processedRoutes = deepUpRouteParentMeta(routeList, parentField, parentFilePath, parent)
    return routes2menu(processedRoutes, {
      hidden,
      root,
      labelField,
      keyField,
      iconField,
      renderIcon,
      createMenuOption,
    })
  })

  const flattenedMenuOptions = computed(() => flattenDeep(menuOptions.value))

  return {
    menuOptions,
    flattenedMenuOptions,
  }
}

/**
 * useNaiveMenu 返回类型
 */
export type UseNaiveMenuReturn = ReturnType<typeof useNaiveMenu>
