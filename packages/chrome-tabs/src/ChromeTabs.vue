<script setup lang='ts'>
import type { TabsProps } from '.'
import type { TabItemKey } from './index'
import { useStyle } from '@oiij/css-render'
import { useScrollView } from '@oiij/use'
import { colord } from 'colord'
import { computed, useTemplateRef, watch } from 'vue'
import ChromeTabItem from './ChromeTabItem.vue'
import { tabsCssName, tabsCssr, tabsItemCssName } from './cssr'
import RiAddLine from './icons/RiAddLine.vue'
import RiArrowDropDownLine from './icons/RiArrowDropDownLine.vue'

const { value, colors, dropdown, addable, options, loadingValue, iconSize, contentClass, contentStyle } = defineProps<TabsProps>()

const emit = defineEmits<{
  (e: 'update:value', v?: TabItemKey | null): void
  (e: 'click', v: TabItemKey, index: number): void
  (e: 'contextmenu', v: TabItemKey, index: number): void
  (e: 'close', v: TabItemKey, index: number): void
  (e: 'add'): void
}>()

useStyle('n-chrome-tabs', tabsCssr())

const activeIndex = computed(() => value ? options?.findIndex(f => f.key === value) : 0)
const { scrollToView } = useScrollView(useTemplateRef('scroll-ref'), { activeClassName: `.${tabsItemCssName}--active`, direction: 'horizontal' })
watch(() => value, () => {
  scrollToView()
}, {
  immediate: true,
})
const lightColors = computed(() => {
  return {
    background: '#F1F1F1',
    active: '#fff',
    primary: 'rgba(0,0,0,.1)',
    ...colors,
  }
})
const darkColors = computed(() => {
  return {
    background: colord(lightColors.value.background).darken(0.8).toHex(),
    active: colord(lightColors.value.active).darken(0.8).toHex(),
    primary: colord(lightColors.value.primary).darken(0.3).toHex(),
  }
})

function onItemClick(key: TabItemKey, index: number) {
  emit('update:value', key)
  emit('click', key, index)
}
function onItemContextMenu(key: TabItemKey, index: number) {
  emit('contextmenu', key, index)
}
function onItemClose(key: TabItemKey, index: number) {
  emit('close', key, index)
}
</script>

<template>
  <div
    :class="[tabsCssName]"
    :style="{
      '--background-color': `${lightColors.background}`,
      '--background-color-dark': `${darkColors.background}`,
      '--active-background-color': `${lightColors.active}`,
      '--active-background-color-dark': `${darkColors.active}`,
      '--primary-color': `${lightColors.primary}`,
      '--primary-color-dark': `${darkColors.primary}`,
    }"
  >
    <div v-if="dropdown" :class="[`${tabsCssName}__icon`]">
      <RiArrowDropDownLine />
    </div>
    <slot name="prefix" />
    <div ref="scroll-ref" :class="[`${tabsCssName}__content`, contentClass]" :style="contentStyle">
      <transition-group name="group" tag="div" :class="[`${tabsCssName}__scroll`]">
        <ChromeTabItem
          v-for="({ key, ...item }, index) in options"
          :key="key"
          :loading="loadingValue === key"
          v-bind="item"
          :item-key="key"
          :item-index="index"
          :active-index="activeIndex"
          :icon-size="iconSize"
          @item-click="onItemClick(key, index)"
          @item-contextmenu="onItemContextMenu(key, index)"
          @item-close="onItemClose(key, index)"
        />
      </transition-group>
    </div>
    <slot name="suffix" />
    <div v-if="addable" :class="[`${tabsCssName}__icon`]" @click="emit('add')">
      <RiAddLine />
    </div>
  </div>
</template>

<style scoped>

</style>
