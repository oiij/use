<script setup lang='ts'>
import type { TransitionProps } from './index'
import { useStyle } from '@oiij/css-render'
import { cName, namespace, transitionCssr } from './transition.cssr'

const { name = 'fade', transitionProps } = defineProps<TransitionProps>()
useStyle(cName, transitionCssr())
</script>

<template>
  <Transition :name="`${namespace}-${name}`" appear mode="out-in" v-bind="transitionProps">
    <slot />
  </Transition>
</template>

<style scoped>

</style>
