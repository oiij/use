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

/**
 * 获取配置值
 * @param route 路由配置
 * @param config 配置项，可以是函数或字符串
 * @param returnType 返回类型，'meta' 从 meta 中获取，'route' 从路由本身获取
 * @param defaultValue 默认值
 * @returns 配置值或默认值
 */
function getConfigValue<T>(
  route: RouteRecordRaw,
  config: ((route: RouteRecordRaw) => T) | string | undefined,
  returnType?: 'meta' | 'route',
  defaultValue?: T,
): T | undefined {
  // 如果没有配置，返回默认值
  if (!config) {
    return defaultValue
  }

  // 如果是函数，执行函数获取值
  if (typeof config === 'function') {
    return config(route)
  }

  // 根据返回类型从不同位置获取值
  if (returnType === 'meta') {
    return route.meta?.[config] as T ?? defaultValue
  }
  return route?.[config as keyof RouteRecordRaw] as T ?? defaultValue
}

/**
 * 创建单个菜单选项
 * @param route 路由配置
 * @param options 配置选项
 * @returns 菜单选项
 */
function createConfigMenuOption(route: RouteRecordRaw, options?: UseNaiveMenuOptions): MenuOption {
  const { labelField, keyField, iconField, renderIcon } = options ?? {}

  // 获取标签值
  const labelValue = getConfigValue<string>(route, labelField, 'meta')
  // 获取键值
  const keyValue = getConfigValue<string>(route, keyField, 'route')
  // 获取图标值
  const iconValue = getConfigValue<string>(route, iconField, 'meta')

  return {
    // 标签优先级：配置字段 > meta.title > route.name > route.path
    label: labelValue ?? route.meta?.title ?? route.name ?? route.path,
    // 键优先级：配置字段 > route.name.toString() > route.path.toString()
    key: keyValue ?? route.name?.toString() ?? route.path?.toString(),
    // 如果有图标值且有渲染函数，渲染图标
    icon: iconValue ? () => renderIcon?.(iconValue) : undefined,
    // 保留路由元信息
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
  // 如果没有隐藏条件，不隐藏
  if (!hidden) {
    return false
  }

  // 获取隐藏条件的值
  const result = getConfigValue(route, hidden, 'meta')
  // 转换为布尔值
  return typeof result === 'boolean' ? result : !!result
}

/**
 * 判断路由是否为根路由
 * @param route 路由配置
 * @param root 根路由判断
 * @returns 是否为根路由
 */
function isRoot(route: RouteRecordRaw, root?: ((route: RouteRecordRaw) => boolean | string) | string): boolean {
  // 如果没有根路由判断，返回false
  if (!root) {
    return false
  }

  // 获取根路由判断的值
  const result = getConfigValue(route, root, 'meta')
  // 转换为布尔值
  return typeof result === 'boolean' ? result : !!result
}

/**
 * 将路由配置转换为菜单配置的递归函数
 * @param routes 路由配置数组
 * @param options 配置选项
 * @returns 菜单配置数组
 */
function routes2menu(routes: RouteRecordRaw[], options?: Omit<UseNaiveMenuOptions, 'parentField' | 'parentFilePath' | 'parent'>): MenuOption[] {
  const { hidden, root, createMenuOption } = options ?? {}
  const menuOptions: MenuOption[] = []

  // 遍历路由配置
  for (const route of routes ?? []) {
    // 如果路由应该隐藏，跳过
    if (shouldHide(route, hidden)) {
      continue
    }

    // 创建菜单选项
    const menu = typeof createMenuOption === 'function' ? createMenuOption(route) : createConfigMenuOption(route, options)

    // 处理子路由
    if (route.children?.length) {
      // 分离根路由和普通子路由
      const rootChildren = route.children.filter(child => isRoot(child, root))
      const normalChildren = route.children.filter(child => !isRoot(child, root))

      // 递归处理普通子路由
      if (normalChildren.length) {
        menu.children = routes2menu(normalChildren, options)
      }

      // 处理根子路由作为顶级菜单
      if (rootChildren.length) {
        const rootMenuOptions = rootChildren
          .filter(child => !shouldHide(child, hidden))
          .map(child => typeof createMenuOption === 'function' ? createMenuOption(child) : createConfigMenuOption(child, options))

        menuOptions.push(...rootMenuOptions)
      }
    }

    // 添加当前菜单选项
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
    // 添加当前菜单
    flattened.push(menu)
    // 递归处理子菜单
    if (menu.children?.length) {
      flattened.push(...flattenDeepMenuOptions(menu.children))
    }
    return flattened
  }, [])
}

/**
 * 深度向上合并父路由元信息
 * @param routes 路由配置数组
 * @param parentField 父路由元信息字段名
 * @param parentFilePath 父路由文件路径
 * @param parent 父路由元信息生成函数
 * @returns 处理后的路由配置数组
 */
function deepUpRouteParentMeta(
  routes: RouteRecordRaw[],
  parentField: string,
  parentFilePath: string,
  parent?: (route: RouteRecordRaw) => Record<string, unknown>,
): RouteRecordRaw[] {
  return routes.map((route) => {
    // 查找匹配 parentFilePath 的子路由
    const emptyPathChild = route.children?.find(f => f.path === parentFilePath)
    if (emptyPathChild) {
      if (typeof parent === 'function') {
        // 使用函数生成父路由元信息
        const parentMeta = parent(route)
        route.meta = {
          ...route.meta,
          ...parentMeta,
        }
      }
      else if (parentField) {
        // 从子路由 meta 中获取父路由元信息
        const parentMeta = emptyPathChild.meta?.[parentField] as Record<string, unknown>
        route.meta = {
          ...route.meta,
          ...parentMeta,
        }
      }
    }
    // 递归处理子路由
    if (route.children?.length) {
      route.children = deepUpRouteParentMeta(route.children, parentField, parentFilePath, parent)
    }
    return route
  })
}

/**
 * 自动菜单组合函数
 * 将路由配置转换为菜单配置，并提供扁平化的菜单选项
 * @param routes 路由配置数组，可以是响应式或普通数组
 * @param options 配置选项
 * @returns 包含菜单选项和扁平化菜单选项的对象
 *
 * @example
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
 */
export function useNaiveMenu(routes: MaybeRefOrGetter<RouteRecordRaw[]>, options?: UseNaiveMenuOptions) {
  // 解构配置选项，设置默认值
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

  /**
   * 菜单选项
   * 响应式计算属性，当路由或配置变化时自动更新
   */
  const menuOptions = computed(() => {
    // 转换响应式路由为普通数组
    const routeList = toValue(routes)
    // 处理父路由元信息
    const processedRoutes = deepUpRouteParentMeta(routeList, parentField, parentFilePath, parent)
    // 转换为菜单选项
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

  /**
   * 扁平化的菜单选项
   * 响应式计算属性，当菜单选项变化时自动更新
   */
  const flattenedMenuOptions = computed(() => {
    return flattenDeepMenuOptions(menuOptions.value)
  })

  return {
    menuOptions,
    flattenedMenuOptions,
  }
}

/**
 * useNaiveMenu 返回类型
 */
export type UseNaiveMenuReturn = ReturnType<typeof useNaiveMenu>
