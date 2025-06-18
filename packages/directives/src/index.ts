import type { App } from 'vue'
import { arrayBufferSrc } from './array-buffer-src'
import { clickOutside } from './click-outside'
import { copy } from './copy'
import { debounce } from './debounce'
import { intoView } from './into-view'
import { lazyLoad } from './lazy-load'
import { longPress } from './long-press'
import { throttle } from './throttle'
import { watermark } from './watermark'

export const directives = {
  arrayBufferSrc,
  clickOutside,
  copy,
  debounce,
  intoView,
  lazyLoad,
  longPress,
  throttle,
  watermark,
}

export const useDirective = {
  install(app: App) {
    Object.entries(directives).forEach(([key, directive]) => {
      app.directive(key, directive)
    })
  },
}
export default directives
