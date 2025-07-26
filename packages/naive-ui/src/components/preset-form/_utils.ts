import type { NaiveFormRules, PresetFormOptions } from '.'

export function options2Rules<D extends Record<string, any>>(options?: PresetFormOptions<D>): NaiveFormRules<D> | undefined {
  if (!options) {
    return undefined
  }
  const rules: NaiveFormRules<D> = {}

  options.forEach((f) => {
    if (f.key) {
      if (f.required) {
        rules[f.key] = {
          required: true,
          message: `${typeof f.label === 'string' ? f.label : typeof f.label === 'object' && f.label.label === 'string' ? f.label.label : typeof f.key === 'string' ? f.key : '字段'}不能为空`,
          trigger: ['input', 'blur'],
        }
      }
      if (f.rules) {
        rules[f.key] = Object.assign(rules[f.key] ?? {}, f.rules)
      }
    }
  })
  return rules
}
