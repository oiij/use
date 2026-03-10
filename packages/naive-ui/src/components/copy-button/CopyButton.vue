<script setup lang='ts'>
import type { CopyButtonProps } from './index'
import { useClipboard } from '@vueuse/core'
import { watch } from 'vue'
import MageCopyFill from '../icons/MageCopyFill.vue'
import { NTooltipButton } from '../tooltip-button'

const { value, config, tooltipProps, buttonProps } = defineProps<CopyButtonProps>()
const emit = defineEmits<{
  (e: 'copied', v: typeof value): void
}>()

const { copied, copy } = useClipboard({
  source: value,
  ...config,
})
watch(copied, () => {
  if (copied.value) {
    emit('copied', value)
  }
})
function handleClick(ev: MouseEvent) {
  ev.preventDefault()
  copy()
}
</script>

<template>
  <NTooltipButton
    :tooltip="copied ? '复制成功' : '复制'"
    :tooltip-props="tooltipProps"
    :button-props="{
      quaternary: true,
      size: 'tiny',
      ...buttonProps,
    }"
    @click="handleClick"
  >
    <template #icon>
      <slot name="icon">
        <MageCopyFill />
      </slot>
    </template>
  </NTooltipButton>
</template>

<style scoped lang='less'>

</style>
