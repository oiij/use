import type { MenuOption } from 'naive-ui'
import type { MaybeRefOrGetter, VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { computed, toValue } from 'vue'

/**
 * 配置选项接口
 */
type Options = {
  /**
   * 隐藏条件，可以是函数或字符串
   * - 如果是函数，返回 true 时路由将不显示在菜单中
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   */
  hidden?: ((route: RouteRecordRaw) => boolean | string) | string
  /**
   * 根路由判断，可以是函数或字符串
   * - 如果是函数，返回 true 时路由将作为顶级菜单
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   */
  root?: ((route: RouteRecordRaw) => boolean | string) | string
  /**
   * 标签生成，可以是函数或字符串
   * - 如果是函数，使用函数返回值作为菜单项的显示文本
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   */
  label?: ((route: RouteRecordRaw) => string) | string
  /**
   * 键生成，可以是函数或字符串
   * - 如果是函数，使用函数返回值作为菜单项的唯一标识
   * - 如果是字符串，则从 route.meta 中获取对应属性的值
   */
  key?: ((route: RouteRecordRaw) => string) | string
  /**
   * 图标渲染函数，用于自定义路由图标
   */
  icon?: (route: RouteRecordRaw) => VNode | string | undefined | null
  parent?: ((route: RouteRecordRaw) => object) | string
}

/**
 * 获取配置值，支持函数和字符串两种类型
 * @param route 路由配置
 * @param config 配置项，可以是函数或字符串
 * @param defaultValue 默认值
 * @returns 配置值
 */
function getConfigValue<T>(
  route: RouteRecordRaw,
  config: ((route: RouteRecordRaw) => T) | string | undefined,
  defaultValue?: T,
): T | undefined {
  if (!config) {
    return defaultValue
  }

  if (typeof config === 'function') {
    return config(route)
  }

  // 首先尝试从 route 本身获取值，如果不存在再从 route.meta 中获取
  return (route[config as keyof RouteRecordRaw] as T) ?? route.meta?.[config] as T ?? defaultValue
}

/**
 * 创建单个菜单选项
 * @param route 路由配置
 * @param options 配置选项
 * @returns 菜单选项
 */
function createMenuOption(route: RouteRecordRaw, options?: Options): MenuOption {
  const { label, key, icon } = options ?? {}

  return {
    label: getConfigValue(route, label) ?? route.meta?.title ?? route.name ?? route.path,
    key: getConfigValue(route, key) ?? route.name?.toString() ?? route.path?.toString(),
    icon: icon ? () => icon(route) : undefined,
    meta: route.meta,
  }
}

/**
 * 判断路由是否应该隐藏
 * @param route 路由配置
 * @param hidden 隐藏条件
 * @returns 是否隐藏
 */
function shouldHide(route: RouteRecordRaw, hidden?: ((route: RouteRecordRaw) => boolean | string) | string): boolean {
  if (!hidden) {
    return false
  }

  const result = getConfigValue(route, hidden)
  return typeof result === 'boolean' ? result : !!result
}

/**
 * 判断路由是否为根路由
 * @param route 路由配置
 * @param root 根路由判断
 * @returns 是否为根路由
 */
function isRoot(route: RouteRecordRaw, root?: ((route: RouteRecordRaw) => boolean | string) | string): boolean {
  if (!root) {
    return !!route.meta?.root
  }

  const result = getConfigValue(route, root)
  return typeof result === 'boolean' ? result : !!result
}

/**
 * 将路由配置转换为菜单配置的递归函数
 * @param routes 路由配置数组
 * @param options 配置选项
 * @returns 菜单配置数组
 */
function routes2menu(routes: RouteRecordRaw[], options?: Omit<Options, 'parent'>): MenuOption[] {
  const { hidden, root } = options ?? {}
  const menuOptions: MenuOption[] = []

  for (const route of routes ?? []) {
    if (shouldHide(route, hidden)) {
      continue
    }

    const menu = createMenuOption(route, options)

    if (route.children?.length) {
      // 分离 root 子路由和普通子路由
      const rootChildren = route.children.filter(child => isRoot(child, root))
      const normalChildren = route.children.filter(child => !isRoot(child, root))

      // 递归处理普通子路由
      if (normalChildren.length) {
        menu.children = routes2menu(normalChildren, options)
      }

      // 处理 root 子路由作为顶级菜单
      if (rootChildren.length) {
        const rootMenuOptions = rootChildren
          .filter(child => !shouldHide(child, hidden))
          .map(child => createMenuOption(child, options))

        menuOptions.push(...rootMenuOptions)
      }
    }

    menuOptions.push(menu)
  }

  return menuOptions
}

/**
 * 深度扁平化菜单选项
 * @param menuOptions 菜单选项数组
 * @returns 扁平化的菜单选项数组
 */
function flattenDeepMenuOptions(menuOptions: MenuOption[]): MenuOption[] {
  return menuOptions.reduce<MenuOption[]>((flattened, menu) => {
    flattened.push(menu)
    if (menu.children?.length) {
      flattened.push(...flattenDeepMenuOptions(menu.children))
    }
    return flattened
  }, [])
}
function deepUpRouteParentMeta(routes: RouteRecordRaw[], parent: ((route: RouteRecordRaw) => object) | string) {
  return routes.map((route) => {
    const emptyPathChild = route.children?.find(f => f.path === '')
    if (emptyPathChild) {
      if (typeof parent === 'function') {
        const parentMeta = parent(route)
        Object.assign(route.meta ?? {}, parentMeta ?? {})
      }
      else {
        const parentMeta = emptyPathChild.meta?.[parent]
        Object.assign(route.meta ?? {}, parentMeta ?? {})
      }
    }
    if (route.children?.length) {
      route.children = deepUpRouteParentMeta(route.children, parent)
    }
    return route
  })
}
/**
 * 自动菜单组合函数
 * @param routes 路由配置数组
 * @param options 配置选项
 * @returns 包含菜单选项和扁平化菜单选项的对象
 *
 * @example
 * // 基本使用
 * const { menuOptions, flattenedMenuOptions } = useAutoMenu(routes)
 *
 * // 带配置选项（使用函数）
 * const { menuOptions, flattenedMenuOptions } = useAutoMenu(routes, {
 *   hidden: (route) => route.meta?.hidden,
 *   root: (route) => route.meta?.root,
 *   label: (route) => route.meta?.title ?? route.name,
 *   key: (route) => route.path,
 *   icon: (route) => route.meta?.icon
 * })
 *
 * // 带配置选项（使用字符串）
 * const { menuOptions, flattenedMenuOptions } = useAutoMenu(routes, {
 *   hidden: 'hidden',
 *   root: 'root',
 *   label: 'title',
 *   key: 'path',
 *   icon: (route) => route.meta?.icon
 * })
 */
export function useAutoMenu(routes: MaybeRefOrGetter<RouteRecordRaw[]>, options?: Options) {
  const { hidden = 'hidden', root = 'root', label = 'title', key = 'name', parent = 'parent' } = options ?? {}

  const menuOptions = computed(() => routes2menu(deepUpRouteParentMeta(toValue(routes), parent), {
    hidden,
    root,
    label,
    key,
  }))
  const flattenedMenuOptions = computed(() => flattenDeepMenuOptions(menuOptions.value))

  return {
    menuOptions,
    flattenedMenuOptions,
  }
}
export type UseAutoMenuReturn = ReturnType<typeof useAutoMenu>
