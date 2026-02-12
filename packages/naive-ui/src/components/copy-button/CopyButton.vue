<script setup lang='ts'>
import type { CopyButtonProps } from './index'
import { useClipboard } from '@vueuse/core'
import { NButton, NTooltip } from 'naive-ui'
import { watch } from 'vue'
import MageCopyFill from '../icons/MageCopyFill.vue'

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
  <NTooltip v-bind="tooltipProps">
    <template #trigger>
      <div :style="{ cursor: 'pointer' }" @click="handleClick">
        <slot>
          <NButton quaternary size="tiny" v-bind="buttonProps">
            <template #icon>
              <slot name="icon">
                <MageCopyFill />
              </slot>
            </template>
          </NButton>
        </slot>
      </div>
    </template>
    <slot name="tooltip">
      {{ copied ? '复制成功' : '复制' }}
    </slot>
  </NTooltip>
</template>

<style scoped lang='less'>

</style>
