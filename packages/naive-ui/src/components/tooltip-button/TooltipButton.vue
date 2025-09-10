<script setup lang='ts'>
import type { TooltipButtonProps } from './index'
import { NButton, NTooltip } from 'naive-ui'

const { tooltip, tooltipProps, buttonProps } = defineProps<TooltipButtonProps>()
const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()
</script>

<template>
  <NTooltip v-bind="tooltipProps">
    <template #trigger>
      <NButton v-bind="buttonProps" @click="(ev) => emit('click', ev)">
        <slot />
        <template #icon>
          <slot name="icon" />
        </template>
      </NButton>
    </template>
    <slot name="tooltip">
      {{ tooltip }}
    </slot>
  </NTooltip>
</template>

<style scoped lang='less'>

</style>
