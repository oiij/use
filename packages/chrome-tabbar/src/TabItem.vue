<script setup lang='ts'>
import type { TabsItemProps } from '.'
import { computed, h } from 'vue'
import { tabsItemCssName } from './cssr'
import LineMdLoadingTwotoneLoop from './icons/LineMdLoadingTwotoneLoop.vue'
import RiCloseLine from './icons/RiCloseLine.vue'

const { label, icon, activeIndex = 0, index, disabled, closable, loading, loadingIcon, onClick, onClose, onContextMenu } = defineProps<TabsItemProps>()
const emit = defineEmits<{
  (e: 'itemClick', ev: MouseEvent): void
  (e: 'itemContextmenu', ev: MouseEvent): void
  (e: 'itemClose'): void
}>()
const showLine = computed(() => activeIndex !== index && activeIndex !== index - 1)
const active = computed(() => activeIndex === index)
const defaultContent = computed(() => typeof label === 'string' ? h('span', { class: `${tabsItemCssName}__label` }, label) : label)
const defaultLoadingIcon = computed(() => loadingIcon ?? h(LineMdLoadingTwotoneLoop))

function handleClick(ev: MouseEvent) {
  ev.stopPropagation()
  emit('itemClick', ev)
  onClick?.(ev)
}
function handleContextMenu(ev: MouseEvent) {
  emit('itemContextmenu', ev)
  onContextMenu?.(ev)
}
function handleClose() {
  emit('itemClose')
  onClose?.()
}
</script>

<template>
  <div
    :class="[
      tabsItemCssName,
      {
        [`${tabsItemCssName}--active`]: active,
        [`${tabsItemCssName}--disabled`]: disabled,
      },
    ]"
    @click="handleClick"
    @contextmenu="handleContextMenu"
  >
    <div :class="[`${tabsItemCssName}__content`]">
      <div :class="[`${tabsItemCssName}__icon`]">
        <component :is="loading ? defaultLoadingIcon : icon" />
      </div>
      <div :class="[`${tabsItemCssName}__slot`]">
        <component :is="defaultContent" />
      </div>
      <div v-if="closable" :class="[`${tabsItemCssName}__close`]" @click.stop="handleClose">
        <RiCloseLine />
      </div>
    </div>
    <div :class="[`${tabsItemCssName}__background`]">
      <svg width="10" height="10"><path d="M 0 10 A 10 10 0 0 0 10 0 L 10 10 Z" /></svg>
      <div :class="[`${tabsItemCssName}__block`]" />
      <svg width="10" height="10"><path d="M 0 0 A 10 10 0 0 0 10 10 L 0 10 Z" /></svg>
    </div>
    <div :class="[`${tabsItemCssName}__line`, showLine ? `${tabsItemCssName}__line--show` : '']" />
  </div>
</template>

<style scoped>

</style>
