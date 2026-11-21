<script setup lang='ts'>
import { useBem, useStyle } from '@oiij/css-render'
import { NFlex } from 'naive-ui'

const { c, cB, cE, cM, nB, nE, nM } = useBem()
const classNode = c([
  cB('block', {
    backgroundColor: 'pink',
    padding: '20px',
  }, [
    cE('element', {
      backgroundColor: 'gray',
      padding: '20px',
    }),
    cM('modifier', {
      fontSize: '30px',
      color: 'white',
    }),
  ]),
])
const bName = nB('block')
const eName = `${bName}${nE('element')}`
const mName = `${bName}${nM('modifier')}`

useStyle('n-css-mount-id', classNode)
</script>

<template>
  <NFlex vertical>
    <div :class="[bName]">
      n-block
      <div :class="[eName]">
        n-block__element
        <p :class="[bName, mName]">
          n-block__element--modifier
        </p>
      </div>
    </div>
    <pre>{{ classNode.render() }}</pre>
  </NFlex>
</template>

<style scoped>

</style>
