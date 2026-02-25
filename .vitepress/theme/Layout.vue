<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import { NConfigProviders } from '@oiij/naive-ui/components'
import { useViewTransition } from '@oiij/use'
import { darkTheme } from 'naive-ui'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { provide } from 'vue'

const { isDark } = useData()
const { run } = useViewTransition({
  duration: 800,
  easing: 'ease-in-out',
})

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
  <NConfigProviders :config-provider-props="{ theme: isDark ? darkTheme : undefined }">
    <DefaultTheme.Layout />
  </NConfigProviders>
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
