<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { directives } from '@oiij/directives'
import { NButton, NCard, NFlex } from 'naive-ui'
import { ref } from 'vue'

defineOptions({
  directives,
})
const copyText = ref('复制的内容')
function onCopySuccess(value: string) {
  console.log(value)
}
function defEvent() {
  console.log('默认事件')
}
function onLongPress() {
  console.log('长按事件')
}
function onDebounce() {
  console.log('防抖触发')
}
function onThrottle() {
  console.log('节流触发')
}
function onIntoView() {
  console.log('进入视图触发')
}
function onClickOutside() {
  console.log('点击外部触发')
}
</script>

<template>
  <NFlex vertical>
    <NCard title="水印">
      <div v-watermark="'进入视图触发视图触发进入'" style="height: 200px" />
    </NCard>
    <NFlex :wrap="false">
      <NCard title="复制">
        <NButton v-copy="{ value: copyText, success: onCopySuccess }" @click="defEvent">
          点击复制
        </NButton>
        <NButton @click="() => copyText = '新的内容'">
          设置新内容
        </NButton>
      </NCard>
      <NCard title="长按">
        <NButton v-long-press:[1000]="onLongPress">
          长按触发事件
        </NButton>
      </NCard>
    </NFlex>
    <NFlex :wrap="false">
      <NCard title="防抖">
        <NButton v-debounce="onDebounce">
          点击
        </NButton>
      </NCard>
      <NCard title="节流">
        <NButton v-throttle="onThrottle">
          点击
        </NButton>
      </NCard>
    </NFlex>
    <NFlex :wrap="false">
      <NCard title="进入视图">
        <NButton v-into-view="onIntoView" v-click-outside="onClickOutside">
          进入视图
        </NButton>
      </NCard>
      <NCard title="点击元素外部">
        <NButton v-into-view="onIntoView" v-click-outside="onClickOutside">
          点击元素外部
        </NButton>
      </NCard>
    </NFlex>
  </NFlex>
</template>

<style scoped>

</style>
