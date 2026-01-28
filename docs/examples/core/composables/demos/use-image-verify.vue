<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useImageVerify } from '@oiij/use'
import { NButton, NCard, NFlex, NInput, NInputGroup } from 'naive-ui'
import { useTemplateRef } from 'vue'

const { valueRef, validate, passed } = useImageVerify(useTemplateRef('dom-ref'), { type: 'character' })
const { valueRef: valueRef1, validate: validate1, passed: passed1 } = useImageVerify(useTemplateRef('dom-ref-1'), { type: 'operation', config: { arith: '+' } })
</script>

<template>
  <NFlex>
    <NCard title="图形" style="flex: 1;">
      <NInputGroup>
        <NInput v-model:value="valueRef" :status="passed ? 'success' : 'error'" />
        <NButton @click="validate">
          验证
        </NButton>
      </NInputGroup>
      <canvas ref="dom-ref" style="margin-top: 5px;" />
    </NCard>
    <NCard title="计算" style="flex: 1;">
      <NInputGroup>
        <NInput v-model:value="valueRef1" :status="passed1 ? 'success' : 'error'" />
        <NButton @click="validate1">
          验证
        </NButton>
      </NInputGroup>
      <canvas ref="dom-ref-1" style="margin-top: 5px;" />
    </NCard>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
