import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import data from '@emoji-mart/data'
import { createEventHook, watchOnce } from '@vueuse/core'
import { Picker } from 'emoji-mart'
import { onUnmounted, shallowRef } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

/**
 * 表情结果类型
 */
export type EmojiResult = {
  /**
   * 表情 ID
   */
  id: string
  /**
   * 表情名称
   */
  name: string
  /**
   * 原生表情
   */
  native: string
  /**
   * 统一编码
   */
  unified: string
  /**
   * 关键词
   */
  keywords: string[]
  /**
   * 短代码
   */
  shortcodes: string
}

/**
 * 表情选择器选项类型
 */
export type EmojiPickerOptions = {
  /**
   * 父元素
   */
  parent?: HTMLElement
  /**
   * 表情数据
   */
  data?: object
  /**
   * 国际化配置
   */
  i18n?: object
  /**
   * 分类
   */
  categories?: ('frequent' | 'people' | 'nature' | 'food' | 'activity' | 'places' | 'objects' | 'symbols' | 'flags')[]
  /**
   * 自定义表情
   */
  custom?: []
  /**
   * 选择表情回调
   */
  onEmojiSelect?: (emoji: EmojiResult) => void
  /**
   * 点击外部回调
   */
  onClickOutside?: () => void
  /**
   * 添加自定义表情回调
   */
  onAddCustomEmoji?: (emoji: EmojiResult) => void
  /**
   * 是否自动聚焦
   */
  autoFocus?: boolean
  /**
   * 分类图标
   */
  categoryIcons?: object
  /**
   * 动态宽度
   */
  dynamicWidth?: boolean
  /**
   * 表情按钮颜色
   */
  emojiButtonColors?: string[]
  /**
   * 表情按钮圆角
   */
  emojiButtonRadius?: string
  /**
   * 表情按钮大小
   */
  emojiButtonSize?: number
  /**
   * 表情大小
   */
  emojiSize?: number
  /**
   * 表情版本
   */
  emojiVersion?: 1 | 2 | 3 | 4 | 5 | 11 | 12 | 12.1 | 13 | 13.1 | 14 | 15
  /**
   * 排除表情
   */
  exceptEmojis?: []
  /**
   * 图标样式
   */
  icons?: 'aut' | 'outline' | 'solid'
  /**
   * 语言
   */
  locale?: 'en' | 'ar' | 'be' | 'cs' | 'de' | 'es' | 'fa' | 'fi' | 'fr' | 'hi' | 'it' | 'ja' | 'ko' | 'nl' | 'pl' | 'pt' | 'ru' | 'sa' | 'tr' | 'uk' | 'vi' | 'zh'
  /**
   * 最大常用行数
   */
  maxFrequentRows?: number
  /**
   * 导航位置
   */
  navPosition?: 'top' | 'bottom' | 'none'
  /**
   * 无国家旗帜
   */
  noCountryFlags?: boolean
  /**
   * 无结果表情
   */
  noResultsEmoji?: string
  /**
   * 每行数量
   */
  perLine?: number
  /**
   * 预览表情
   */
  previewEmoji?: 'point_up' | 'point_down'
  /**
   * 预览位置
   */
  previewPosition?: 'top' | 'bottom' | 'none'
  /**
   * 搜索位置
   */
  searchPosition?: 'sticky' | 'static' | 'none'
  /**
   * 表情集
   */
  set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter'
  /**
   * 肤色
   */
  skin?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * 肤色位置
   */
  skinTonePosition?: 'preview' | 'search' | 'none'
  /**
   * 主题
   */
  theme?: 'auto' | 'light' | 'dark'
  /**
   * 获取精灵图 URL
   */
  getSpritesheetURL?: string
}

/**
 * 使用表情选择器选项类型
 */
export type UseEmojiPickerOptions = {
  /**
   * 是否开启暗黑模式
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 语言
   */
  language?: MaybeRefOrGetter<'zh' | 'en'>
  /**
   * 表情选择器选项
   */
  emojiPickerOptions?: EmojiPickerOptions
}

/**
 * 使用表情选择器
 *
 * @param templateRef - 表情选择器容器的模板引用
 * @param options - 表情选择器选项
 * @returns 表情选择器实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useEmojiPicker } from '@oiij/emoji-picker'
 *
 * const pickerRef = ref()
 * const { emojiPickerInst, updateTheme } = useEmojiPicker(pickerRef, {
 *   darkMode: false,
 *   language: 'zh',
 *   emojiPickerOptions: {
 *     onEmojiSelect: (emoji) => {
 *       console.log('选择了表情', emoji)
 *     }
 *   }
 * })
 * </script>
 *
 * <template>
 *   <div ref="pickerRef"></div>
 * </template>
 * ```
 */
export function useEmojiPicker(templateRef: TemplateRef<HTMLElement>, options?: UseEmojiPickerOptions) {
  const { darkMode, language, emojiPickerOptions } = options ?? {}

  const darkModeRef = watchRefOrGetter(darkMode, updateTheme)

  const languageRef = watchRefOrGetter(language, updateLanguage)

  const _options: EmojiPickerOptions = {
    data,
    emojiButtonRadius: '6px',
    emojiButtonColors: [
      'rgba(155,223,88,.7)',
      'rgba(149,211,254,.7)',
      'rgba(247,233,34,.7)',
      'rgba(238,166,252,.7)',
      'rgba(255,213,143,.7)',
      'rgba(211,209,255,.7)',
    ],
    theme: darkModeRef.value ? 'dark' : 'light',
    locale: languageRef.value,
    ...emojiPickerOptions,
  }
  const emojiPickerInst = shallowRef<Picker | null>(null)

  const onRenderEvent = createEventHook<[Picker]>()

  /**
   * 更新主题
   *
   * @param darkMode - 是否开启暗黑模式
   */
  function updateTheme(darkMode?: boolean) {
    if (darkMode !== undefined && darkMode !== darkModeRef.value) {
      darkModeRef.value = darkMode
    }
    const theme = darkModeRef.value ? 'dark' : 'light'
    _options.theme = theme
    destroy()
    render()
  }

  /**
   * 更新语言
   *
   * @param language - 语言
   */
  function updateLanguage(language?: 'zh' | 'en') {
    if (language !== undefined && language !== languageRef.value) {
      languageRef.value = language
    }
    _options.locale = languageRef.value ?? 'zh'
    destroy()
    render()
  }

  function render() {
    if (templateRef.value && !emojiPickerInst.value) {
      emojiPickerInst.value = new Picker({
        parent: templateRef.value,
        ..._options,
      })
      onRenderEvent.trigger(emojiPickerInst.value)
    }
  }

  function destroy() {
    emojiPickerInst.value = null
    if (templateRef.value) {
      templateRef.value.innerHTML = ''
    }
  }

  watchOnce(templateRef, render)

  onUnmounted(() => {
    destroy()
  })

  return {
    templateRef,
    darkMode: darkModeRef,
    language: languageRef,
    emojiPickerInst,
    updateTheme,
    updateLanguage,
    onRender: onRenderEvent.on,
  }
}

/**
 * 使用表情选择器返回值类型
 */
export type UseEmojiPickerReturns = ReturnType<typeof useEmojiPicker>
