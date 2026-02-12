import type { App, Directive } from 'vue'
import { arrayBufferSrc } from './array-buffer-src'
import { clickOutside } from './click-outside'
import { copy } from './copy'
import { debounce } from './debounce'
import { intoView } from './into-view'
import { lazyLoad } from './lazy-load'
import { longPress } from './long-press'
import { throttle } from './throttle'
import { watermark } from './watermark'

/**
 * 指令集合
 */
const directives = {
  arrayBufferSrc,
  clickOutside,
  copy,
  debounce,
  intoView,
  lazyLoad,
  longPress,
  throttle,
  watermark,
} as Record<'arrayBufferSrc' | 'clickOutside' | 'copy' | 'debounce' | 'intoView' | 'lazyLoad' | 'longPress' | 'throttle' | 'watermark', Directive>

/**
 * 指令安装对象
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { setupDirective } from '@oiij/directives'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 * app.use(setupDirective)
 * app.mount('#app')
 * ```
 */
export const setupDirective = {
  /**
   * 安装指令
   *
   * @param app - Vue 应用实例
   */
  install(app: App) {
    Object.entries(directives).forEach(([key, directive]) => {
      app.directive(key, directive)
    })
  },
}
declare module 'vue' {
  // eslint-disable-next-line ts/consistent-type-definitions
  export interface ComponentCustomProperties {
    vArrayBufferSrc: typeof arrayBufferSrc
    vClickOutside: typeof clickOutside
    vCopy: typeof copy
    vDebounce: typeof debounce
    vIntoView: typeof intoView
    vLazyLoad: typeof lazyLoad
    vLongPress: typeof longPress
    vThrottle: typeof throttle
    vWatermark: typeof watermark
  }
}

/**
 * 导出指令
 */
export {
  arrayBufferSrc,
  clickOutside,
  copy,
  debounce,
  directives,
  intoView,
  lazyLoad,
  longPress,
  throttle,
  watermark,
}
