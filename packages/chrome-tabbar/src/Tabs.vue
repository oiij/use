<script setup lang='ts'>
import type { TabsProps } from './index'
import { useStyle } from '@oiij/css-render'
import { useScrollView } from '@oiij/use'
import { colord } from 'colord'
import { computed, watch } from 'vue'
import { tabsCssName, tabsCssr, tabsItemCssName } from './cssr'
import RiAddLine from './icons/RiAddLine.vue'
import RiArrowDropDownLine from './icons/RiArrowDropDownLine.vue'
import TabItem from './TabItem.vue'

const { colors, dropdown, addable, options } = defineProps<TabsProps>()

const emit = defineEmits<{
  (e: 'click', v: string): void
  (e: 'contextmenu', v: string): void
  (e: 'close', v: string): void
  (e: 'add'): void
}>()

useStyle('n-chrome-tabs', tabsCssr())

const { background = '#E5E7EB', active = '#fff', primary = 'rgba(251,191,36,1)' } = colors ?? {}
const value = defineModel<string | number>('value')
const activeIndex = computed(() => options?.findIndex(f => f.key === value.value))
const { scrollRef, scrollToView } = useScrollView({ activeClassName: `.${tabsItemCssName}--active`, direction: 'horizontal' })
watch(value, () => {
  scrollToView()
}, {
  immediate: true,
})

const backgroundDark = computed(() => colord(background).darken(0.9).toHex())
const activeDark = computed(() => colord(active).darken(0.8).toHex())
const primaryDark = computed(() => colord(primary).darken(0.3).toHex())
function onItemClick(key: string) {
  emit('click', key)
}
function onItemContextMenu(key: string) {
  emit('contextmenu', key)
}
function onItemClose(key: string) {
  emit('close', key)
}
</script>

<template>
  <div
    :class="[tabsCssName]"
    :style="{
      '--background-color': `${background}`,
      '--background-color-dark': `${backgroundDark}`,
      '--active-background-color': `${active}`,
      '--active-background-color-dark': `${activeDark}`,
      '--primary-color': `${primary}`,
      '--primary-color-dark': `${primaryDark}`,
    }"
  >
    <div v-if="dropdown" :class="[`${tabsCssName}__icon`]">
      <RiArrowDropDownLine />
    </div>
    <slot name="prefix" />
    <div ref="scrollRef" :class="[`${tabsCssName}__content`]">
      <transition-group name="group" tag="div" :class="[`${tabsCssName}__scroll`]">
        <TabItem v-for="({ key, ...item }, index) in options" :key="key" v-bind="item" :index="index" :active-index="activeIndex" @item-click="onItemClick(key)" @item-contextmenu="onItemContextMenu(key)" @item-close="onItemClose(key)" />
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
