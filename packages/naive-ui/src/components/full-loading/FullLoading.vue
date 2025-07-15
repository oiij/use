<script setup lang='ts'>
import type { FullLoadingProps } from './index'
import { useStyle } from '@oiij/css-render'
import { NEl, NSpin } from 'naive-ui'
import { ref, watchEffect } from 'vue'
import { NTransition } from '../transition/index'
import { cName, fullLoadingCssr } from './full-loading.cssr'

const { show, appendTo = 'body', mask = true, blur = true, disableScroll = true, scrollSelector = 'body', spinProps } = defineProps<FullLoadingProps>()
useStyle(cName, fullLoadingCssr())
const cacheOverFlow = ref('auto')
watchEffect(() => {
  if (disableScroll) {
    const el = scrollSelector instanceof HTMLElement ? scrollSelector : document.querySelector<HTMLElement>(scrollSelector)
    if (el) {
      if (show) {
        cacheOverFlow.value = el.style.overflow
      }
      el.style.overflow = show ? 'hidden' : cacheOverFlow.value
    }
  }
})
</script>

<template>
  <NTransition>
    <Teleport :to="appendTo">
      <NEl
        v-if="show"
        :class="[cName, { [`${cName}--mask`]: mask }, { [`${cName}--blur`]: blur }]"
        :style="typeof mask === 'object' ? mask : {}"
      >
        <NSpin
          v-bind="spinProps"
        >
          <template v-if="$slots.description" #description>
            <slot name="description" />
          </template>
          <template v-if="$slots.icon" #icon>
            <slot name="icon" />
          </template>
        </NSpin>
      </NEl>
    </Teleport>
  </NTransition>
</template>

<style scoped>

</style>
