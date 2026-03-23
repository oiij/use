<script setup lang='ts'>
import { useAutoI18n } from '@oiij/auto-i18n'
import { NButton, NFlex, NTag } from 'naive-ui'

const { language, navigatorLanguage, locale, setLanguage } = useAutoI18n()
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NTag type="info">
        语言设置: {{ language }}
      </NTag>
      <NTag type="success">
        浏览器语言: {{ navigatorLanguage }}
      </NTag>
      <NTag type="warning">
        实际语言: {{ locale }}
      </NTag>
    </NFlex>
    <NFlex>
      <NButton @click="setLanguage('auto')">
        自动（浏览器语言）
      </NButton>
      <NButton @click="setLanguage('zh-CN')">
        中文
      </NButton>
      <NButton @click="setLanguage('en-US')">
        English
      </NButton>
    </NFlex>
  </NFlex>
</template>

<style scoped>

</style>
