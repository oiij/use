<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useThreeJs } from '@oiij/three-js'
import { useTween } from '@oiij/three-js/plugins'
import { useAmbientLight, useAxesHelper, useDirectionalLight, useGridHelper } from '@oiij/three-js/utils'

import { NCheckbox, NFlex } from 'naive-ui'
import { BoxGeometry, Mesh, MeshPhongMaterial, SphereGeometry, TetrahedronGeometry } from 'three'
import { ref, useTemplateRef } from 'vue'

const enablePostprocessing = ref(true)
const { ambientLight, show: showAmbientLight } = useAmbientLight({
  intensity: 1,
})
const { directionalLight, show: showDirectionalLight, directionalLightHelper } = useDirectionalLight({
  position: [5, 5, 5],
  intensity: 1,
})
const { gridHelper } = useGridHelper()
const { axesHelper, show: showAxesHelper } = useAxesHelper()
const { lookAtObject, update } = useTween()
const { scene, camera, controls, onDoubleClick, onBeforeLoop, onIntersectObject } = useThreeJs(useTemplateRef('dom-ref'), {
  cameraOptions: {
    position: [-3, 2, 2],
  },
  lights: [ambientLight, directionalLight],
  helpers: [axesHelper, directionalLightHelper, gridHelper],
})
onBeforeLoop(() => {
  update()
})
function createObj() {
  const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshPhongMaterial({ color: '#FFFFFF' }))
  cube.castShadow = true
  cube.position.set(-2, 0, 0)
  const ball = new Mesh(new SphereGeometry(1), new MeshPhongMaterial({ color: '#334155' }))
  ball.position.set(0, 0, 0)
  ball.castShadow = true
  const triangle = new Mesh(new TetrahedronGeometry(1), new MeshPhongMaterial({ color: '#6d28d9' }))
  triangle.position.set(2, 0, 0)
  triangle.castShadow = true
  scene.add(cube, ball, triangle)
  onDoubleClick((ev) => {
    onIntersectObject([cube, ball, triangle], ev, (intersects) => {
      const targetObj = intersects[0]
      lookAtObject(camera, controls, targetObj)
    })
  })
}
createObj()
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
      <NCheckbox v-model:checked="enablePostprocessing">
        enablePostprocessing
      </NCheckbox>
    </NFlex>
    <div ref="dom-ref" style="width: 100%; height: 400px;" />
  </NFlex>
</template>

<style scoped>

</style>
