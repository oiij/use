import { describe, expect, it } from 'vitest'
import { mergeRule } from './_utils'

describe('mergeRule', () => {
  it('没有 required 和自定义规则时返回 undefined', () => {
    expect(mergeRule({ key: 'name' })).toBeUndefined()
  })

  it('required 为 true 时生成必填规则', () => {
    expect(mergeRule({ key: 'name', label: '姓名', required: true })).toEqual({
      required: true,
      message: '姓名不能为空',
      trigger: ['input', 'blur'],
    })
  })

  it('required 与自定义规则合并', () => {
    expect(mergeRule({ key: 'name', required: true, rule: { min: 3 } })).toEqual({
      required: true,
      message: 'name不能为空',
      trigger: ['input', 'blur'],
      min: 3,
    })
  })
})
