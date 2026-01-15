<script setup lang='ts'>
import { useNaiveTheme } from '@oiij/naive-ui'
import { dateKoKR, koKR, NButton, NCalendar, NCard, NColorPicker, NConfigProvider, NFlex, NInput, NRadio, NRadioGroup } from 'naive-ui'
import { ref } from 'vue'

const darkMode = ref(false)
const language = ref<'zh-CN' | 'en-US' | 'ko-KR'>('zh-CN')
const { theme, themeOverrides, locale, locales, colors, themeColors } = useNaiveTheme({
  colors: {
    primary: '#475569',
  },
  language,
  darkMode,
  locales: {
    'ko-KR': {
      name: '한국어',
      dateLocale: dateKoKR,
      locale: koKR,
    },
  },
})
</script>

<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverrides" :locale="locale.locale" :date-locale="locale.dateLocale">
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
            <NRadio v-for="[key, item] in Object.entries(locales)" :key="key" :value="key">
              {{ item.name }}
            </NRadio>
          </NRadioGroup>
          <NColorPicker v-model:value="colors.primary" :actions="['clear']" />
        </NFlex>
        <NFlex>
          <NButton type="default">
            Default
          </NButton>
          <NButton type="primary">
            Primary
          </NButton>
          <NButton type="info">
            Info
          </NButton>
          <NButton type="success">
            Success
          </NButton>
          <NButton type="warning">
            Warning
          </NButton>
          <NButton type="error">
            Error
          </NButton>
        </NFlex>
        <div style="width: 100px;height: 40px;border: 1px solid #000;" :style="{ backgroundColor: `${themeColors.primary ?? ''}` }">
          PrimaryColor
          {{ themeColors.primary }}
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
