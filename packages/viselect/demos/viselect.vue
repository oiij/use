<script setup lang='ts'>
import { useViselect } from '@oiij/viselect'
import { NButton, NCard, NFlex, NTag } from 'naive-ui'
import { useTemplateRef } from 'vue'

const containerRef = useTemplateRef<HTMLDivElement>('container-ref')

const items = Array.from({ length: 40 }).map((_, i) => i + 1)

const { instanceRef, selected, onInit, onStart, onStop } = useViselect(containerRef, {
  selectables: '.viselect-item',
  behaviour: {
    overlap: 'keep',
    intersect: 'touch',
  },
  features: {
    singleTap: {
      allow: true,
      intersect: 'native',
    },
  },
})

onInit((instance) => {
  // eslint-disable-next-line no-console
  console.log('viselect 已初始化', instance)
})

onStart(({ event, store }) => {
  // eslint-disable-next-line no-console
  console.log('开始框选', event, store.selected)
})

onStop(() => {
  // eslint-disable-next-line no-console
  console.log('框选结束')
})

function selectAll() {
  instanceRef.value?.select('.viselect-item')
}

function clearSelection() {
  instanceRef.value?.clearSelection()
}
</script>

<template>
  <NFlex vertical>
    <NFlex align="center">
      <NButton @click="selectAll">
        全选
      </NButton>
      <NButton @click="clearSelection">
        清空
      </NButton>
      <NTag size="small" type="success">
        框选已启用
      </NTag>
      <span style="color: #999;">提示：按住 Ctrl / Cmd 可累加框选</span>
    </NFlex>

    <NFlex>
      <NCard header="选区容器" style="flex: 1;">
        <div ref="container-ref" class="viselect-container">
          <div
            v-for="i in items"
            :key="i"
            class="viselect-item"
            :class="{ 'is-selected': selected.includes(String(i)) }"
            :data-key="i"
          >
            {{ i }}
          </div>
        </div>
      </NCard>

      <NCard header="状态" style="width: 320px;">
        <NFlex vertical>
          <div>当前选中数量：{{ selected.length }}</div>
          <div>
            <span>选中项：</span>
            <span v-if="selected.length">
              <NTag
                v-for="key in selected"
                :key="key"
                size="small"
                style="margin: 2px;"
              >
                {{ key }}
              </NTag>
            </span>
            <span v-else style="color: #999;">无</span>
          </div>
        </NFlex>
      </NCard>
    </NFlex>
  </NFlex>
</template>

<style scoped>
.viselect-container {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  user-select: none;
  padding: 12px;
  border: 1px dashed #ccc;
  min-height: 200px;
}

.viselect-item {
  padding: 12px 0;
  text-align: center;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}

.viselect-item:hover {
  background: #e0e8ff;
}

.viselect-item.is-selected {
  background: #2e73fc;
  color: #fff;
}
</style>
