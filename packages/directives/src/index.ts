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

const setupDirective = {
  install(app: App) {
    Object.entries(directives).forEach(([key, directive]) => {
      app.directive(key, directive)
    })
  },
}
declare module 'vue' {
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
export {
  arrayBufferSrc,
  clickOutside,
  copy,
  debounce,
  directives,
  intoView,
  lazyLoad,
  longPress,
  setupDirective,
  throttle,
  watermark,
}
