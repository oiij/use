<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useScrollView } from '@oiij/use'
import { NButton, NFlex } from 'naive-ui'
import { nextTick, ref, useTemplateRef } from 'vue'

const list = Array.from({ length: 20 }).map((_, i) => `${i}`)
const activeIndex = ref(0)
const { scrollToView } = useScrollView(useTemplateRef('scroll-ref'))
const { scrollToView: scrollToView1 } = useScrollView(useTemplateRef('scroll-ref-1'), {
  direction: 'horizontal',
})
function scrollTo(index: number) {
  activeIndex.value = index
  nextTick(() => {
    scrollToView()
    scrollToView1()
  })
}
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NButton @click="scrollTo(0)">
        滚动到第一个
      </NButton>
      <NButton @click="scrollTo(list.length - 1)">
        滚动到最后一个
      </NButton>
    </NFlex>
    <div ref="scroll-ref" style="display: flex;flex-direction: column;gap: 10px;width: 100;height: 300px;overflow: hidden;">
      <div v-for="(item, index) in list" :key="index" style="background-color: bisque; padding: 10px;border-radius: 10px;" :class="[{ active: activeIndex === index }]">
        {{ item }}
      </div>
    </div>
    <div ref="scroll-ref-1" style="margin-top: 20px;display: flex;gap: 10px;width: 100;height: 80px;overflow: hidden;">
      <div v-for="(item, index) in list" :key="index" style="background-color: bisque;width: 200px; flex-shrink: 0; padding: 10px;border-radius: 10px;" :class="[{ active: activeIndex === index }]">
        {{ item }}
      </div>
    </div>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
