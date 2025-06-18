<script setup lang='ts'>
import { useNaiveTheme } from '@oiij/naive-ui'
import { NButton, NCalendar, NCard, NColorPicker, NConfigProvider, NFlex, NInput, NRadio, NRadioGroup } from 'naive-ui'
import { ref } from 'vue'

const darkMode = ref(false)
const language = ref<'zh-CN' | 'en-US'>('zh-CN')
const { theme, themeOverrides, locale, dateLocale, color } = useNaiveTheme({
  language,
  darkMode,
})
</script>

<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
    <NCard>
      <NFlex vertical>
        <NFlex>
          <NRadioGroup v-model:value="darkMode">
            <NRadio :value="false">
              Light
            </NRadio>
            <NRadio :value="true">
              Dark
            </NRadio>
          </NRadioGroup>
          <NRadioGroup v-model:value="language">
            <NRadio value="zh-CN">
              中文
            </NRadio>
            <NRadio value="en-US">
              English
            </NRadio>
          </NRadioGroup>
          <NColorPicker v-model:value="color.primary" />
        </NFlex>
        <div>
          <NButton type="primary">
            Primary
          </NButton>
        </div>
        <div>
          <NInput />
        </div>
        <div>
          <NCalendar />
        </div>
      </NFlex>
    </NCard>
  </NConfigProvider>
</template>

<style scoped lang='less'>

</style>
