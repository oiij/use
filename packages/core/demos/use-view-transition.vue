<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useViewTransition } from '@oiij/use'
import { useData } from 'vitepress'

const { isDark } = useData()

const { run } = useViewTransition({
  duration: 300,
  easing: 'linear',
  effect: true,
  reverseSelector: '.dark',

})
function onClick({ clientX: x, clientY: y }: MouseEvent) {
  run(() => {
    isDark.value = !isDark.value
  }, {
    x,
    y,
    reverse: !isDark.value,
  })
}
</script>

<template>
  <div style="width: 100%;height: 200px;display: flex;align-items: center;justify-content: center;font-size: 20px;" @click="onClick">
    点我切换
  </div>
</template>

<style scoped lang='less'>

</style>
