<script setup lang='ts'>
import type { LoadingProviderProps } from './index'
import { useStyle } from '@oiij/css-render'
import { NEl, NSpin } from 'naive-ui'
import { provide, ref, watchEffect } from 'vue'
import { NTransition } from '../transition/index'
import { loadingProviderInjectionKey } from './index'
import { cName, loadingProviderCssr } from './loading-provider.cssr'

const { show, appendTo = 'body', mask = true, blur = true, duration, spinProps } = defineProps<LoadingProviderProps>()
useStyle(cName, loadingProviderCssr())
const _show = ref(show)
watchEffect(() => {
  _show.value = show
})
const textRef = ref('')
function hideLoading() {
  _show.value = false
}
function showLoading(options?: {
  text?: string
  duration?: number
}) {
  const { text, duration: _duration } = options ?? {}
  textRef.value = text ?? ''
  _show.value = true
  if (_duration ?? duration) {
    setTimeout(() => {
      _show.value = false
    }, _duration ?? duration)
  }
  return {
    hide: hideLoading,
  }
}
provide(loadingProviderInjectionKey, {
  show: showLoading,
  hide: hideLoading,
})
</script>

<template>
  <NTransition>
    <Teleport :to="appendTo">
      <NEl
        v-if="_show"
        :class="[cName, { [`${cName}--mask`]: mask }, { [`${cName}--blur`]: blur }]"
        :style="typeof mask === 'object' ? mask : {}"
      >
        <NSpin
          :description="textRef"
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
  <slot />
</template>

<style scoped>

</style>
