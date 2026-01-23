<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useAudioContext, useSpectrum } from '@oiij/use'
import { NButton, NFlex, NFormItem, NFormItemGi, NGrid, NInput, NProgress, NSlider, NTag } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'

const url = ref('')
const { play, pause, resume, stop, toggleMute, setEQFrequency, getEQFrequencies, getFrequencyData, setProgress, setVolume, setPlaybackRate, playing, paused, ended, volume, muted, playbackRate, currentTimeText, durationText, progress, cachedDuration, cachedProgress } = useAudioContext({
  fade: false,
  timeUpdateFormat: (time: number) => Number(time.toFixed(0)),
})
const { pause: pauseSpectrum, resume: resumeSpectrum } = useSpectrum(useTemplateRef('canvas-ref'), getFrequencyData, {
  type: 'bar',
  color: ['#f43f5e', '#ffe4e6'],
  // color: '#333',
})
function handlePlay() {
  play(url.value).catch((err) => {
    console.log(err)
  })
}
function handleSetProgress(val: number) {
  setProgress(val)
}
const eqFrequenciesRef = ref(getEQFrequencies())
function onEQFrequencyUpdate(index: number, val: number) {
  setEQFrequency(index, val)
  eqFrequenciesRef.value = getEQFrequencies()
}
</script>

<template>
  <NFlex vertical>
    <NFormItem label="音频URL">
      <NInput v-model:value="url" type="textarea" placeholder="请输入音频URL" />
    </NFormItem>
    <NFormItem label="音频状态">
      <NFlex>
        <NTag>playing: {{ playing }}</NTag>
        <NTag>paused: {{ paused }}</NTag>
        <NTag>ended: {{ ended }}</NTag>
        <NTag>volume: {{ volume }}</NTag>
        <NTag>muted: {{ muted }}</NTag>
        <NTag>playbackRate: {{ playbackRate }}</NTag>
        <NTag>currentTime: {{ currentTimeText }}</NTag>
        <NTag>duration: {{ durationText }}</NTag>
        <NTag>cachedDuration: {{ cachedDuration }}</NTag>
      </NFlex>
    </NFormItem>
    <NFormItem label="音频控制">
      <NFlex vertical style="width: 100%;">
        <NGrid :cols="2" :x-gap="10">
          <NFormItemGi label="音量">
            <NSlider :value="volume" :step="0.1" :min="0" :max="1" @update:value="setVolume" />
          </NFormItemGi>
          <NFormItemGi label="速率">
            <NSlider :value="playbackRate" :step="0.1" :min="0" :max="2" @update:value="setPlaybackRate" />
          </NFormItemGi>
        </NGrid>
        <NFlex>
          <NButton @click="handlePlay">
            播放
          </NButton>
          <NButton @click="() => pause()">
            暂停
          </NButton>
          <NButton @click="() => resume()">
            恢复
          </NButton>
          <NButton @click="() => stop()">
            停止
          </NButton>
          <NButton @click="() => toggleMute()">
            静音
          </NButton>
          <NButton @click="() => resumeSpectrum()">
            开启频谱
          </NButton>
          <NButton @click="() => pauseSpectrum()">
            关闭频谱
          </NButton>
        </NFlex>
      </NFlex>
    </NFormItem>
    <NFormItem label="进度">
      <NFlex vertical style="width: 100%;">
        <NSlider :value="progress" :min="0" :max="100" @update:value="(val) => handleSetProgress(val)" />
        <NProgress type="line" :percentage="progress" />
        <NProgress type="line" :percentage="cachedProgress" />
      </NFlex>
    </NFormItem>
    <NFormItem label="EQ">
      <NGrid :cols="10" :x-gap="10">
        <NFormItemGi v-for="(item, index) in eqFrequenciesRef" :key="item.frequency" :label="`${item.frequency}`">
          <NSlider style="height: 100px;" vertical :step="1" :min="-40" :max="40" :value="item.gain" @update-value="(val) => onEQFrequencyUpdate(index, val)" />
        </NFormItemGi>
      </NGrid>
    </NFormItem>
    <NFormItem label="可视化">
      <canvas ref="canvas-ref" style="border: 1px solid #000;width: 100%;height: 300px;" />
    </NFormItem>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
