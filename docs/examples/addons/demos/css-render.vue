<script setup lang='ts'>
import { useBem, useStyle } from '@oiij/css-render'

const { cssr, plugin } = useBem({
  namespace: 'b',
})
const { c, cB, cE, cM } = { ...cssr, ...plugin }
function generateCssr() {
  return c([
    cB('a', {
      backgroundColor: 'pink',
      padding: '20px',
    }, [
      cE('b', {
        backgroundColor: 'gray',
        padding: '20px',
      }, [
        cM('c', {
          fontSize: '30px',
          color: 'white',
        }),
      ]),
    ]),
  ])
}
useStyle('b-css-mount-id', generateCssr())
</script>

<template>
  <div class="b-a">
    <div class="b-a__b">
      <p class="b-a__b b-a__b--c">
        b-a__b--c
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
