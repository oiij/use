<script setup lang='ts'>
import { ButterflyPhase, CardioidGlow, CardioidHeart, FourierFlow, HeartWave, HypotrochoidLoop, LemniscateBloom, LissajousDrift, OriginalThinking, RoseCurve, RoseOrbit, SpiralSearch, ThreePetalSpiral } from '@oiij/math-curve-loaders'

const loaders = [
  {
    component: OriginalThinking,
    name: 'OriginalThinking',
    description: 'OriginalThinking Loader',
    props: {
      petalCount: 7,
    },
  },
  {
    component: OriginalThinking,
    name: 'OriginalThinking',
    description: 'OriginalThinking Loader',
    props: {
      petalCount: 5,
    },
  },
  {
    component: OriginalThinking,
    name: 'OriginalThinking',
    description: 'OriginalThinking Loader',
    props: {
      petalCount: 9,
    },
  },
  {
    component: RoseOrbit,
    name: 'RoseOrbit',
    description: 'RoseOrbit Loader',
  },
  {
    component: RoseCurve,
    name: 'RoseCurve',
    description: 'RoseCurve Loader',
  },
  {
    component: RoseCurve,
    name: 'RoseCurve',
    description: 'RoseCurve Loader',
    props: {
      roseK: 2,
    },
  },
  {
    component: RoseCurve,
    name: 'RoseCurve',
    description: 'RoseCurve Loader',
    props: {
      roseK: 3,
    },
  },
  {
    component: RoseCurve,
    name: 'RoseCurve',
    description: 'RoseCurve Loader',
    props: {
      roseK: 4,
    },
  },
  {
    component: LissajousDrift,
    name: 'LissajousDrift',
    description: 'LissajousDrift Loader',
    props: {
      config: {
        rotate: false,
      },
    },
  },
  {
    component: LemniscateBloom,
    name: 'LemniscateBloom',
    description: 'LemniscateBloom Loader',
    props: {
      config: {
        rotate: false,
      },
    },
  },
  {
    component: HypotrochoidLoop,
    name: 'HypotrochoidLoop',
    description: 'HypotrochoidLoop Loader',
  },
  {
    component: ThreePetalSpiral,
    name: 'ThreePetalSpiral',
    description: 'ThreePetalSpiral Loader',
  },
  {
    component: ThreePetalSpiral,
    name: 'ThreePetalSpiral',
    description: 'ThreePetalSpiral Loader',
    props: {
      spiralR: 4,
    },
  },
  {
    component: ThreePetalSpiral,
    name: 'ThreePetalSpiral',
    description: 'ThreePetalSpiral Loader',
    props: {
      spiralR: 5,
    },
  },
  {
    component: ThreePetalSpiral,
    name: 'ThreePetalSpiral',
    description: 'ThreePetalSpiral Loader',
    props: {
      spiralR: 6,
    },
  },
  {
    component: ButterflyPhase,
    name: 'ButterflyPhase',
    description: 'ButterflyPhase Loader',
    props: {
      config: {
        rotate: false,
      },
    },
  },
  {
    component: CardioidGlow,
    name: 'CardioidGlow',
    description: 'CardioidGlow Loader',
    props: {
      config: {
        rotate: false,
      },
    },
  },
  {
    component: CardioidHeart,
    name: 'CardioidHeart',
    description: 'CardioidHeart Loader',
    props: {
      config: {
        rotate: false,
      },
    },
  },
  {
    component: HeartWave,
    name: 'HeartWave',
    description: 'HeartWave Loader',
    props: {
      config: {
        rotate: false,
      },
    },
  },
  {
    component: SpiralSearch,
    name: 'SpiralSearch',
    description: 'SpiralSearch Loader',
  },
  {
    component: FourierFlow,
    name: 'FourierFlow',
    description: 'FourierFlow Loader',
  },
]
</script>

<template>
  <div class="grid grid-cols-4 gap-3">
    <div v-for="(loader, index) in loaders" :key="index" class="flex-col-center border bg-gray-50 rounded-xl p-3">
      <component :is="loader.component" v-bind="loader.props" />
      <div class="text-sm text-gray-500">
        {{ loader.description }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
