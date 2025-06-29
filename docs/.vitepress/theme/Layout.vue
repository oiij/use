<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import { useViewTransition } from '@oiij/use'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { provide } from 'vue'

const { isDark } = useData()
const { run } = useViewTransition()

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  run(() => {
    isDark.value = !isDark.value
  }, {
    x,
    y,
    reverse: !isDark.value,
  })
})
</script>

<template>
  <DefaultTheme.Layout />
</template>

<style>
.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

.vitepress-demo-plugin__container>.vitepress-demo-plugin-preview {
  box-sizing: border-box;
}
</style>
