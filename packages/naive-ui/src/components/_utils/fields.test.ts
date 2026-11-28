import { describe, expect, it } from 'vitest'
import { mergeFields } from './fields'

describe('mergeFields', () => {
  it('用户字段覆盖默认值', () => {
    expect(mergeFields({ page: 'page', pageSize: 'pageSize' }, { page: 'current' })).toEqual({
      page: 'current',
      pageSize: 'pageSize',
    })
  })

  it('未传用户字段时返回默认值副本', () => {
    const defaults = { page: 'page' }
    const result = mergeFields(defaults)

    expect(result).toEqual(defaults)
    expect(result).not.toBe(defaults)
  })
})
