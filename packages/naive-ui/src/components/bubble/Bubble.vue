<script setup lang='ts'>
import type { BubbleProps } from './index'
import { useStyle } from '@oiij/css-render'
import { NAvatar, NEl, NFlex, NSpin } from 'naive-ui'
import { NTypeWriter } from '../index'
import { bubbleCssr, cName } from './bubble.cssr'

const { content, contentClass, contentStyle, avatar, loading, typing, markdown, placement } = defineProps<BubbleProps>()
const emit = defineEmits<{
  (e: 'typingComplete'): void
}>()
useStyle('n-bubble', bubbleCssr())
</script>

<template>
  <NEl tag="div" :class="[cName, placement === 'end' ? `${cName}--reverse` : ''] ">
    <slot name="avatar">
      <NAvatar v-if="avatar" round v-bind="avatar.props">
        <component :is="avatar.icon" />
      </NAvatar>
    </slot>
    <NFlex vertical>
      <slot name="header" />
      <Transition mode="out-in" name="fade">
        <slot v-if="loading" name="loading">
          <NSpin style="height: 44px;" />
        </slot>
        <slot v-else>
          <div :class="[`${cName}__content`, contentClass]" :style="contentStyle">
            <NTypeWriter :typing="typing" :markdown="markdown" :value="content" @stop="emit('typingComplete')" />
          </div>
        </slot>
      </Transition>
      <slot name="footer" />
    </NFlex>
  </NEl>
</template>

<style>

</style>
