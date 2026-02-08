<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useTheme } from '@oiij/use'
import { NButton, NFlex } from 'naive-ui'

const { isDark, toggleDark, setDark, setLight } = useTheme({
  storageKey: '__COLOR_MODE__',
  viewTransitionOptions: {
    duration: 800,
    easing: 'ease-in-out',
  },
})
</script>

<template>
  <NFlex vertical>
    当前主题: {{ isDark ? '暗色' : '亮色' }}
    <NFlex>
      <NButton @click="toggleDark">
        切换主题
      </NButton>
      <NButton @click="(e) => setDark(e)">
        暗色模式
      </NButton>
      <NButton @click="(e) => setLight(e)">
        亮色模式
      </NButton>
    </NFlex>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
