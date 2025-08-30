import type { FormItemRule } from 'naive-ui'
import type { DataObject } from '../../composables/index'

export function mergeRule<D extends DataObject = DataObject>(option?: {
  key?: keyof D
  label?: string | (() => string)
  required?: boolean | (() => boolean)
  rule?: FormItemRule | FormItemRule[]
}) {
  const { key, label, required, rule } = option ?? {}
  let _rule: FormItemRule | FormItemRule[] | undefined
  const _required = typeof required === 'function' ? required() : required
  if (_required) {
    const message = `${typeof label === 'string' ? label : typeof label === 'function' ? label() : typeof key === 'string' ? key : '字段'}不能为空`
    _rule = {
      required: true,
      message,
      trigger: ['input', 'blur'],
    }
  }
  if (rule) {
    if (_rule) {
      Object.assign(_rule, rule)
    }
    else {
      _rule = rule
    }
  }
  return _rule
}
