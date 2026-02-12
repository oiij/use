import type { FormItemRule } from 'naive-ui'
import type { DataObject } from '../../composables/index'

export function mergeRule<D extends DataObject = DataObject>(option?: {
  key?: keyof D
  label?: string | (() => string)
  required?: boolean | (() => boolean)
  rule?: FormItemRule | FormItemRule[]
}): FormItemRule | FormItemRule[] | undefined {
  const { key, label, required, rule } = option ?? {}
  const _required = typeof required === 'function' ? required() : required

  if (!_required && !rule) {
    return undefined
  }

  const getLabelText = (): string => {
    if (typeof label === 'string')
      return label
    if (typeof label === 'function')
      return label()
    if (typeof key === 'string')
      return key
    return '字段'
  }

  if (_required) {
    const message = `${getLabelText()}不能为空`
    const requiredRule: FormItemRule = {
      required: true,
      message,
      trigger: ['input', 'blur'],
    }

    if (rule) {
      if (Array.isArray(rule)) {
        return [requiredRule, ...rule]
      }
      return {
        ...requiredRule,
        ...rule,
      }
    }

    return requiredRule
  }

  return rule
}
