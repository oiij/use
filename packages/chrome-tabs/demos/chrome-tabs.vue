<!-- eslint-disable no-alert -->
<script setup lang='ts'>
import type { TabsOption } from '@oiij/chrome-tabs'
import { ChromeTabs } from '@oiij/chrome-tabs'
import { h, reactive, ref } from 'vue'
import CustomLoadingIcon from './icons/CustomLoadingIcon.vue'
import DogIcon from './icons/DogIcon.vue'
import MageDashboardPlusFill from './icons/MageDashboardPlusFill.vue'

const value = ref<string | number>('tab1')
const options: TabsOption[] = reactive([
  {
    key: 'tab1',
    label: 'Closable',
    icon: () => h(MageDashboardPlusFill),
    closable: true,
  },
  {
    key: 'tab2',
    label: 'Icon',
    icon: () => h(DogIcon, { style: { width: '20px', height: '20px' } }),
  },
  {
    key: 'tab3',
    label: 'Disabled',
    disabled: true,
  },
  {
    key: 'tab4',
    label: 'Loading',
    loading: true,
  },
  {
    key: 'tab5',
    label: 'CustomLoadingIcon',
    loading: true,
    loadingIcon: () => h(CustomLoadingIcon),
  },
  {
    key: 'tab6',
    label: 'onClick',
    onClick: () => {
      alert('onClick')
    },
  },
  {
    key: 'tab7',
    label: 'onContextMenu',
    onClick: () => {
      alert('onContextMenu')
    },
  },
  {
    key: 'tab8',
    label: 'onClose',
    onClick: () => {
      alert('onClose')
    },
  },
])
function handleAdd() {
  const key = `tab${options.length + 1}`
  options.push({
    key,
    label: key.toUpperCase(),
  })
  value.value = key
}
function onClose(v: string | number) {
  const index = options.findIndex(f => f.key === v)
  options.splice(index, 1)
}
function handleClick(key: string | number) {
  value.value = key
}
</script>

<template>
  <ChromeTabs v-model:value="value" :options="options" addable @close="onClose" @add="handleAdd" @click="handleClick" />
</template>

<style scoped>

</style>
