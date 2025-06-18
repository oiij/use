<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useThreeJs } from '@oiij/three-js'
import { usePane } from '@oiij/three-js/plugins'
import { useAxesHelper, useGridHelper } from '@oiij/three-js/utils'
import { useLoader } from '@oiij/three-js/utils'
import { useAmbientLight, useDirectionalLight } from '@oiij/three-js/utils'
import { NCheckbox, NFlex } from 'naive-ui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const { onLoad } = useLoader(GLTFLoader, '/dear.gltf')

const { ambientLight, show: showAmbientLight } = useAmbientLight()
const { directionalLight, show: showDirectionalLight } = useDirectionalLight()
const { gridHelper } = useGridHelper()
const { axesHelper, show: showAxesHelper } = useAxesHelper()
const { pane, fpsGraph, show: showPane } = usePane()
pane.addBinding(ambientLight, 'visible', { label: '环境光' })
pane.addBinding(axesHelper, 'visible', { label: '坐标轴' })

const { domRef, scene, controls, onBeforeLoop, onAfterLoop } = useThreeJs({
  camera: {
    position: [0, 2, 3],
  },
  helpers: [axesHelper, gridHelper],
  lights: [ambientLight, directionalLight],
})
pane.addBinding(controls, 'autoRotate', { label: '自动旋转' })

onBeforeLoop(() => {
  fpsGraph.begin()
})
onAfterLoop(() => {
  fpsGraph.end()
})
onLoad((gltf) => {
  gltf.scene.rotateY(180)
  scene.add(gltf.scene)
})
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NCheckbox v-model:checked="showAmbientLight">
        启用AmbientLight
      </NCheckbox>
      <NCheckbox v-model:checked="showDirectionalLight">
        启用DirectionalLight
      </NCheckbox>
      <NCheckbox v-model:checked="showAxesHelper">
        启用AxesHelper
      </NCheckbox>
      <NCheckbox v-model:checked="showPane">
        启用Gui
      </NCheckbox>
    </NFlex>
    <div ref="domRef" style="width: 100%; height: 400px;" />
  </NFlex>
</template>

<style scoped>

</style>
