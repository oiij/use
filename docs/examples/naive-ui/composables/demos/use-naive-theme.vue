<script setup lang='ts'>
import { useNaiveTheme } from '@oiij/naive-ui'
import { colord } from 'colord'
import { dateKoKR, koKR, NButton, NCalendar, NCard, NColorPicker, NConfigProvider, NFlex, NInput, NRadio, NRadioGroup } from 'naive-ui'
import { ref } from 'vue'

function getDarkColor(color?: string) {
  if (!color) {
    return undefined
  }
  const colorInst = colord(color)
  if (!colorInst.isValid()) {
    return undefined
  }
  return colorInst.darken(0.1).toHex()
}
const darkMode = ref(false)
const language = ref<'zh-CN' | 'en-US' | 'ko-KR'>('zh-CN')
const { theme, themeOverrides, locale, locales, colorsRef, themeColors } = useNaiveTheme({
  colors: {
    primary: '#ff2d51',
  },
  darkColors: (colors) => {
    return {
      primary: getDarkColor(colors.primary),
    }
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
          <NColorPicker v-model:value="colorsRef.primary" :actions="['clear']" />
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
