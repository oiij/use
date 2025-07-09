<script setup lang='ts'>
import { NButton, NFlex } from 'naive-ui'
import { ref } from 'vue'
import { NTransition } from '~/naive-ui/src/components'

const show = ref(true)
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NButton @click="show = !show">
        Show/Hide
      </NButton>
    </NFlex>
    <NTransition name="fade">
      <div v-if="show">
        {{ show }}
      </div>
    </NTransition>
  </NFlex>
</template>

<style>
/* .fade-enter-active,
.fade-leave-active{
  transition: all 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */
</style>
