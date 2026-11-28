import type { AvatarProps } from 'naive-ui'
import type { ClassStyle } from '../_utils/types'

export { default as NBubble } from './Bubble.vue'

/**
 * 气泡位置类型
 * - 'start': 气泡位于左侧
 * - 'end': 气泡位于右侧
 */
export type BubblePlacement = 'start' | 'end'

/**
 * 对话气泡属性
 * 用于描述单条对话消息的头像、名称、时间与正文内容
 * @example
 * const props: BubbleProps = {
 *   content: '你好，我是 Vue 助手',
 *   placement: 'start',
 *   name: 'Vue 助手'
 * }
 */
export type BubbleProps = {
  /** 气泡正文内容，默认为 '' */
  content?: string
  /** 气泡位置，默认为 'start' */
  placement?: BubblePlacement
  /** 头像图片地址，默认为 undefined */
  avatar?: string
  /** 头像属性，默认为 undefined */
  avatarProps?: AvatarProps & ClassStyle
  /** 名称，默认为 '' */
  name?: string
  /** 时间文本，默认为 '' */
  datetime?: string
  /** 是否显示加载动画，默认为 false */
  loading?: boolean
  /** 是否在正文末尾显示打字光标，默认为 false */
  typing?: boolean
  /** 气泡最大宽度，数字按 px 处理，默认为 '80%' */
  maxWidth?: string | number
}
