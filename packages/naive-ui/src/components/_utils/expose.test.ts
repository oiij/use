import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createExpose } from './expose'

describe('createExpose', () => {
  it('expose 保留原始引用，slotProps 解包 ref', () => {
    const count = ref(1)
    const run = () => 'ok'
    const { expose, slotProps } = createExpose({ count, run })

    expect(expose.count).toBe(count)
    expect(slotProps.value.count).toBe(1)
    expect(slotProps.value.run).toBe(run)
  })

  it('slotProps 会跟随 ref 更新', () => {
    const count = ref(1)
    const { slotProps } = createExpose({ count })

    count.value = 2

    expect(slotProps.value.count).toBe(2)
  })
})
