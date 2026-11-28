<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import type { BubbleProps } from './index'
import { useStyle } from '@oiij/css-render'
import { NAvatar, useThemeVars } from 'naive-ui'
import { computed } from 'vue'
import { bubbleCssr, cName } from './bubble.cssr'

const {
  content = '',
  placement = 'start',
  avatar,
  avatarProps,
  name = '',
  datetime = '',
  loading = false,
  typing = false,
  maxWidth = '80%',
} = defineProps<BubbleProps>()

useStyle(cName, bubbleCssr())

const themeVars = useThemeVars()
const isEnd = computed(() => placement === 'end')
const style = computed(() => {
  const vars = themeVars.value
  return {
    '--n-bubble-color': isEnd.value ? vars.primaryColor : vars.actionColor,
    '--n-bubble-text-color': isEnd.value ? '#fff' : vars.textColor1,
    '--n-bubble-meta-color': isEnd.value ? 'rgba(255, 255, 255, .72)' : vars.textColor3,
    '--n-bubble-font-size': vars.fontSize,
    '--n-bubble-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  } as CSSProperties
})
</script>

<template>
  <div class="n-bubble" :class="{ 'n-bubble--end': isEnd, 'n-bubble--typing': typing && !loading }" :style="style">
    <div v-if="avatar || $slots.avatar" class="n-bubble__avatar">
      <slot name="avatar">
        <NAvatar round :src="avatar" v-bind="avatarProps" />
      </slot>
    </div>
    <div class="n-bubble__body">
      <div v-if="name || datetime || $slots.header" class="n-bubble__header">
        <slot name="header">
          <span v-if="name" class="n-bubble__name">{{ name }}</span>
          <span v-if="datetime" class="n-bubble__datetime">{{ datetime }}</span>
        </slot>
      </div>
      <div class="n-bubble__content">
        <slot v-if="loading" name="loading">
          <span class="n-bubble__dots">
            <i />
            <i />
            <i />
          </span>
        </slot>
        <slot v-else>
          {{ content }}
        </slot>
      </div>
      <div v-if="$slots.footer" class="n-bubble__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
