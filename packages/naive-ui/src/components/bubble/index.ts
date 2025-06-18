import type { AvatarProps } from 'naive-ui'
import type { CSSProperties, VNodeChild } from 'vue'

export { default as NBubble } from './Bubble.vue'

export interface BubbleProps {
  avatar?: {
    icon?: VNodeChild
    props?: AvatarProps
  }
  content?: string
  contentClass?: string
  contentStyle?: CSSProperties
  loading?: boolean
  typing?: boolean
  markdown?: boolean
  placement?: 'start' | 'end'

}
