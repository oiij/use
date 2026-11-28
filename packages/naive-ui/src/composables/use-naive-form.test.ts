import type { FormInst } from 'naive-ui'
import type { TemplateRef } from 'vue'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useNaiveForm } from './use-naive-form'

function createFormInstRef() {
  return ref(null) as unknown as TemplateRef<FormInst>
}

describe('useNaiveForm clearRules', () => {
  it('clear 优先使用字段级默认值，嵌套同名字段使用类型默认值', () => {
    const { formValues, clear } = useNaiveForm(createFormInstRef(), {
      values: {
        name: '张三',
        age: 18,
        enabled: true,
        nested: { name: '李四', count: 2 },
      },
      clearRules: { name: '默认' },
    })

    clear()

    expect(formValues.value).toEqual({
      name: '默认',
      age: null,
      enabled: null,
      nested: { name: null, count: null },
    })
  })

  it('resetForm 会为快照中不存在的字段使用字段级默认值', () => {
    const { formValues, setValue, resetForm } = useNaiveForm<Record<string, any>>(createFormInstRef(), {
      values: { name: '张三' },
      clearRules: { string: '', extra: '新增字段默认值' },
    })

    setValue({ extra: '临时值' })
    resetForm()

    expect(formValues.value.name).toBe('张三')
    expect(formValues.value.extra).toBe('新增字段默认值')
  })
})
